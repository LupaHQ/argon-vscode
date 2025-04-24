import * as vscode from "vscode"
import * as path from "path"
import * as fs from "fs"
import * as argon from "../argon" // Use correct relative path
import * as config from "../config" // Use correct relative path
import * as logger from "../logger" // Import logger
import { getCurrentDir, findProjects } from "../util" // Add findProjects import
import { State } from "../state" // Import State if needed by run signature
import { Item } from "." // Import Item type from index
import { writeMcpConfig } from "../mcpConfig"
import { syncRules } from "../ruleSync"

export const item: Item = {
  label: "$(rocket) Start Lemonade",
  description: "Click to initiate and sync with Roblox Studio",
  action: "startLemonade",
}

const REQUIRED_SRC_DIRS = [
  "ReplicatedFirst",
  "ReplicatedStorage",
  "ServerScriptService",
  "ServerStorage",
  "StarterGui",
  "StarterPack",
  "StarterPlayer",
  "Workspace",
]

// Function to check if the current workspace is an Argon project
export async function isArgonProject(workspaceRoot: string): Promise<boolean> {
  // Check for .project.json files
  try {
    const hasProjectFile = findProjects().length > 0

    // Quick check if there's a project file
    if (!hasProjectFile) {
      return false
    }

    // For a more complete check, verify the src directory structure
    return await checkSrcStructure(workspaceRoot)
  } catch (error) {
    // If findProjects throws an error (e.g., no workspace folder), it's not an Argon project
    return false
  }
}

// Helper function to set up .cursor directory and files
async function ensureCursorSetup(
  workspaceRoot: string,
  context: vscode.ExtensionContext,
) {
  // Only set up cursor if this is an Argon project
  if (!(await isArgonProject(workspaceRoot))) {
    // Skip cursor setup for non-Argon projects
    return
  }

  const cursorPath = path.join(workspaceRoot, ".cursor")
  if (!fs.existsSync(cursorPath)) {
    try {
      fs.mkdirSync(cursorPath)
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error)
      logger.error(`Failed to create .cursor directory: ${errMsg}`, false, true)
      return // Stop if we can't create the base directory
    }
  }

  // Sync rule files
  await syncRules(context)

  // Configure MCP server
  await writeMcpConfig()
}

async function checkSrcStructure(workspaceRoot: string): Promise<boolean> {
  const srcPath = path.join(workspaceRoot, "src")
  if (!fs.existsSync(srcPath)) {
    return false
  }

  try {
    const entries = fs.readdirSync(srcPath, { withFileTypes: true })
    const existingDirs = entries
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)

    const allExist = REQUIRED_SRC_DIRS.every((reqDir) =>
      existingDirs.includes(reqDir),
    )
    return allExist
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    vscode.window.showErrorMessage(
      `Error reading src directory: ${errorMessage}`,
    )
    return false
  }
}

export async function run(_state: State, context: vscode.ExtensionContext) {
  const workspaceRoot = getCurrentDir()
  if (!workspaceRoot) {
    logger.error(
      "No workspace folder open. Please open your project folder.",
      false,
      true,
    )
    return
  }

  await ensureCursorSetup(workspaceRoot, context)

  const isArgon = await isArgonProject(workspaceRoot)

  if (!isArgon) {
    const folderName = path.basename(workspaceRoot)
    const choice = await vscode.window.showWarningMessage(
      `Your setup ('${folderName}') doesn't have the required Lemonade structure yet. Initialize it now?`,
      { modal: true },
      "Yes, Initialize",
    )

    if (choice === "Yes, Initialize") {
      try {
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Initializing Lemonade project...",
            cancellable: false,
          },
          async (progress) => {
            progress.report({ increment: 0 })
            await argon.init("default.project.json", "quick", ["--git=false"])
            progress.report({ increment: 100 })
          },
        )

        const srcPath = path.join(workspaceRoot, "src")
        const projectPath = path.join(workspaceRoot, "default.project.json")
        if (fs.existsSync(srcPath) && fs.existsSync(projectPath)) {
          vscode.window.showInformationMessage(
            "Project initialized successfully.",
          )
        } else {
          const errorMsg = `Initialization verification failed: src or project file not found.`
          logger.error(errorMsg, false, true)
          return
        }
      } catch (initError) {
        // Ensure we properly handle all error formats
        let errorMsg: string
        if (Array.isArray(initError)) {
          errorMsg = initError[0] || "Unknown error (array format)"
        } else if (initError instanceof Error) {
          errorMsg = initError.message
        } else {
          errorMsg = String(initError)
        }

        logger.error(`Project initialization failed: ${errorMsg}`, false, true)
        return
      }
    } else {
      return // User cancelled init
    }
  }

  // Structure exists OR was just successfully initialized
  try {
    const projectPath = path.join(workspaceRoot, "default.project.json")
    if (!fs.existsSync(projectPath)) {
      const errorMsg = `default.project.json not found in ${workspaceRoot}. Cannot start server.`
      logger.error(errorMsg, false, true)
      return
    }

    const host = config.defaultHost()
    const port = config.defaultPort()
    const options = ["--host", host, "--port", port.toString(), "--sourcemap"]

    try {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Starting Lemonade server...",
          cancellable: false,
        },
        async (progress) => {
          progress.report({ increment: 0 })

          const [sessionId, actualAddress] = await argon.serve(
            projectPath,
            options,
          )

          progress.report({
            increment: 50,
            message: "Server started, launching Studio...",
          })

          if (!sessionId || !actualAddress) {
            const errorMsg =
              "No valid session ID or address returned from argon.serve."
            throw new Error(errorMsg)
          }

          // Directly attempt to launch Studio after server starts
          try {
            const studioMessage = `Lemonade server running on ${actualAddress}.`

            await argon.studio(false, undefined)

            vscode.window.showInformationMessage(
              `${studioMessage} Launching Studio...`,
            )
          } catch (launchError) {
            const errorMsg =
              launchError instanceof Error
                ? launchError.message
                : String(launchError)
            console.error("ERROR launching Roblox Studio:", launchError)
            logger.error(
              `Server running on ${actualAddress}, but failed to launch Studio: ${errorMsg}`,
              false,
              true,
            )
          }
          progress.report({ increment: 100 })
        },
      )
    } catch (serveError) {
      const errorMsg =
        serveError instanceof Error ? serveError.message : String(serveError)
      console.error(
        "[Lemonade] ERROR: Caught error in server start block:",
        serveError,
      )
      logger.error(`Failed to start Lemonade server: ${errorMsg}`, false, true)
    }
  } catch (outerError) {
    const errorMsg =
      outerError instanceof Error ? outerError.message : String(outerError)
    console.error("[Lemonade] ERROR: Caught error in outer block:", outerError)
    logger.error(`Failed unexpectedly: ${errorMsg}`, false, true)
  }
}
