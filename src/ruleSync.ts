import * as vscode from "vscode"
import * as path from "path"
import * as fs from "fs"
import * as logger from "./logger"
import { getCurrentDir } from "./util"

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
    logger.warn("Cannot sync rules: No workspace folder open.", false)
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

  // Ensure rules directory exists
  const rulesPath = path.join(cursorPath, "rules")
  if (!fs.existsSync(rulesPath)) {
    try {
      fs.mkdirSync(rulesPath)
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error)
      logger.error(
        `Failed to create .cursor/rules directory: ${errMsg}`,
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
