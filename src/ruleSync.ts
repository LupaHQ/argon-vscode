import * as vscode from "vscode"
import * as path from "path"
import * as fs from "fs"
import * as logger from "./logger"
import { getCurrentDir } from "./util"
import { isArgonProject } from "./menu/startLemonade"

/**
 * Syncs the rule files from the extension to the workspace .cursor/rules directory
 * @param context VS Code extension context
 * @returns True if rules were synced successfully, false otherwise
 */
export async function syncRules(
  context: vscode.ExtensionContext,
): Promise<boolean> {
  const workspaceRoot = getCurrentDir()
  if (!workspaceRoot) {
    logger.error("No workspace folder open", false, false)
    return false
  }

  // Skip rule syncing for non-Argon projects
  if (!(await isArgonProject(workspaceRoot))) {
    return false
  }

  // Ensure .cursor directory exists
  const cursorPath = path.join(workspaceRoot, ".cursor")
  if (!fs.existsSync(cursorPath)) {
    try {
      fs.mkdirSync(cursorPath)
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error)
      logger.error(`Failed to create .cursor directory: ${errMsg}`, false, true)
      return false
    }
  }

  // Delete existing rules directory if it exists, then recreate it
  const rulesPath = path.join(cursorPath, "rules")
  if (fs.existsSync(rulesPath)) {
    try {
      // Force removal of the directory and its contents
      fs.rmSync(rulesPath, { recursive: true, force: true })
      logger.info(`Removed existing directory: ${rulesPath}`, false)
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error)
      logger.error(
        `Failed to remove existing .cursor/rules directory: ${errMsg}`,
        false,
        true,
      )
      return false // Stop if we cannot clean the old directory
    }
  }

  // Always create the rules directory after attempting removal
  if (!fs.existsSync(rulesPath)) {
    try {
      fs.mkdirSync(rulesPath)
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error)
      logger.error(
        `Failed to recreate .cursor/rules directory: ${errMsg}`,
        false,
        true,
      )
      return false
    }
  }

  // Copy the rule files from the extension's assets
  try {
    const ruleAssetsPath = vscode.Uri.joinPath(
      context.extensionUri,
      "assets",
      "rules",
    ).fsPath

    if (fs.existsSync(ruleAssetsPath)) {
      const ruleFiles = fs.readdirSync(ruleAssetsPath)
      let copiedFiles = 0

      for (const file of ruleFiles) {
        const srcPath = vscode.Uri.joinPath(
          context.extensionUri,
          "assets",
          "rules",
          file,
        ).fsPath
        const destPath = path.join(rulesPath, file)

        // Use copyFileSync to overwrite if exists
        fs.copyFileSync(srcPath, destPath)
        copiedFiles++
      }

      logger.info(
        `Successfully synced ${copiedFiles} rule files to ${rulesPath}`,
        false,
      )
      return true
    } else {
      logger.warn(
        `Extension assets/rules directory not found at: ${ruleAssetsPath}`,
        false,
      )
      return false
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to sync rule files: ${errMsg}`, false, true)
    return false
  }
}

/**
 * Syncs the documentation files from the extension to the workspace docs directory
 * @param context VS Code extension context
 * @returns True if docs were synced successfully, false otherwise
 */
export async function syncDocs(
  context: vscode.ExtensionContext,
): Promise<boolean> {
  const workspaceRoot = getCurrentDir()
  if (!workspaceRoot) {
    logger.warn("Cannot sync docs: No workspace folder open.", false)
    return false
  }

  // Ensure root docs directory exists
  const docsPath = path.join(workspaceRoot, "docs")
  if (!fs.existsSync(docsPath)) {
    try {
      fs.mkdirSync(docsPath)
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error)
      logger.error(
        `Failed to create root docs directory: ${errMsg}`,
        false,
        true,
      )
      return false
    }
  }

  // Copy the doc files from the extension's assets
  try {
    const docAssetsPath = vscode.Uri.joinPath(
      context.extensionUri,
      "assets",
      "docs", // Source directory
    ).fsPath

    if (fs.existsSync(docAssetsPath)) {
      const docFiles = fs.readdirSync(docAssetsPath)
      let copiedFiles = 0

      for (const file of docFiles) {
        const srcPath = vscode.Uri.joinPath(
          context.extensionUri,
          "assets",
          "docs", // Source directory
          file,
        ).fsPath
        const destPath = path.join(docsPath, file) // Destination directory

        // Use copyFileSync to overwrite if exists
        fs.copyFileSync(srcPath, destPath)
        copiedFiles++
      }

      logger.info(
        `Successfully synced ${copiedFiles} doc files to ${docsPath}`,
        false,
      )
      return true
    } else {
      logger.warn(
        `Extension assets/docs directory not found at: ${docAssetsPath}`,
        false,
      )
      // Don't fail if the source dir doesn't exist yet
      return true
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to sync doc files: ${errMsg}`, false, true)
    return false
  }
}
