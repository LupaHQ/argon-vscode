import * as vscode from "vscode"
import * as path from "path"
import * as os from "os"
import * as fs from "fs"
import * as childProcess from "child_process"
import * as logger from "./logger"

export function getArgonPath(): string {
  return path.join(os.homedir(), ".argon")
}

export function getCurrentDir(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
}

export function findProjects(placesOnly?: boolean): string[] {
  const dir = getCurrentDir()

  if (!dir) {
    throw new Error("Cannot find projects without a workspace folder open!")
  }

  let projects = fs
    .readdirSync(dir)
    .filter(
      (entry) =>
        entry.endsWith(".project.json") &&
        fs.statSync(path.join(dir, entry)).isFile(),
    )

  if (placesOnly) {
    projects = projects.filter((project) => {
      try {
        var tree = JSON.parse(
          fs.readFileSync(path.join(dir, project), "utf8"),
        ).tree
      } catch (err) {
        logger.error(`Failed to parse ${project}: ${err}`)
        return false
      }

      if (!tree) {
        return false
      }

      return tree["$className"] === "DataModel"
    })
  }

  return projects
}

export function findPlaces(): string[] {
  const dir = getCurrentDir()

  if (!dir) {
    throw new Error("Cannot find places without a workspace folder open!")
  }

  let places = fs
    .readdirSync(dir)
    .filter(
      (entry) =>
        (entry.endsWith(".rbxl") || entry.endsWith(".rbxlx")) &&
        fs.statSync(path.join(dir, entry)).isFile(),
    )

  return places
}

export function getProjectName(project: string): string {
  if (!path.isAbsolute(project)) {
    const dir = getCurrentDir()

    if (!dir) {
      throw new Error(
        "Cannot get project name without a workspace folder open!",
      )
    }

    project = path.join(dir, project)
  }

  try {
    return JSON.parse(fs.readFileSync(project, "utf8")).name
  } catch {
    return path.basename(project, ".project.json")
  }
}

export function getProjectAddress(project: string): {
  host?: string
  port?: string
} {
  if (!path.isAbsolute(project)) {
    const dir = getCurrentDir()

    if (!dir) {
      throw new Error(
        "Cannot get project name without a workspace folder open!",
      )
    }

    project = path.join(dir, project)
  }

  try {
    var json = JSON.parse(fs.readFileSync(project, "utf8"))
  } catch {
    return {}
  }

  return {
    host: json.host || json.serveAddress,
    port: json.port || json.servePort,
  }
}

export function getVersion(): string | undefined {
  try {
    const execPath =
      path.join(os.homedir(), ".argon", "bin", "argon") +
      (os.platform() === "win32" ? ".exe" : "")

    return childProcess
      .execFileSync(execPath, ["--version"])
      .toString()
      .replace("argon-rbx ", "")
      .trim()
  } catch (err) {
    // Try PATH-based lookup as fallback
    try {
      return childProcess
        .execSync(`argon --version`)
        .toString()
        .replace("argon-rbx ", "")
        .trim()
    } catch {}
  }
}

export function updatePathVariable() {
  if (os.platform() !== "win32") {
    // Skip registry operations on non-Windows platforms
    return
  }

  try {
    const argonBinPath = path.join(os.homedir(), ".argon", "bin")
    // Use fully qualified path to reg.exe instead of relying on PATH
    const regExePath = path.join(
      process.env.SystemRoot || "C:\\Windows",
      "System32",
      "reg.exe",
    )

    // Get current PATH
    let currentPath = childProcess
      .execSync(
        `"${regExePath}" query "HKEY_CURRENT_USER\\Environment" /v PATH`,
      )
      .toString()

    const index =
      currentPath.indexOf("REG_EXPAND_SZ") || currentPath.indexOf("REG_SZ")
    if (index !== -1) {
      currentPath = currentPath.substring(index + 12).trim()
    }

    // Check if our path is already in there
    if (!currentPath.toLowerCase().includes(argonBinPath.toLowerCase())) {
      // Add our path
      const newPath = currentPath
        ? `${currentPath};${argonBinPath}`
        : argonBinPath

      // Update the registry
      childProcess.execSync(
        `"${regExePath}" add "HKEY_CURRENT_USER\\Environment" /v PATH /t REG_EXPAND_SZ /d "${newPath}" /f`,
      )

      // Update current process PATH
      process.env.PATH = newPath

      // Broadcast WM_SETTINGCHANGE using rundll32 (available on all Windows versions)
      childProcess.execSync(
        `rundll32 user32.dll,SendMessageTimeout HWND_BROADCAST WM_SETTINGCHANGE 0 "Environment" SMTO_ABORTIFHUNG 5000`,
      )
    }
  } catch (err) {
    logger.error(`Failed to update PATH: ${err}`)
    // Continue without updating PATH - better than crashing
  }
}
