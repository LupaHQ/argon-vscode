import * as path from "path"
import * as fs from "fs"
import * as os from "os"
import * as logger from "./logger"
import { getCurrentDir } from "./util"
import { isArgonProject } from "./menu/startLemonade"

/**
 * Writes MCP configuration to the workspace .cursor directory
 */
export async function writeMcpConfig(): Promise<void> {
  const workspaceRoot = getCurrentDir()
  if (!workspaceRoot) {
    logger.error("No workspace folder open", false, false)
    return
  }

  // Skip MCP config for non-Argon projects
  if (!(await isArgonProject(workspaceRoot))) {
    return
  }

  const cursorPath = path.join(workspaceRoot, ".cursor")
  if (!fs.existsSync(cursorPath)) {
    try {
      fs.mkdirSync(cursorPath)
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error)
      logger.error(`Failed to create .cursor directory: ${errMsg}`, false, true)
      return
    }
  }

  const mcpJsonPath = path.join(cursorPath, "mcp.json")
  updateMcpJsonFile(mcpJsonPath)
}

/**
 * Updates an MCP JSON file with our LemonadeRAG server config
 * @param mcpJsonPath Path to the mcp.json file
 */
function updateMcpJsonFile(mcpJsonPath: string): void {
  // Get existing data or create a new object with the right structure
  let existingData: any = { mcpServers: {} }

  // 1. Read existing file if it exists
  if (fs.existsSync(mcpJsonPath)) {
    try {
      const fileContent = fs.readFileSync(mcpJsonPath, "utf-8")
      existingData = JSON.parse(fileContent)

      // Basic validation to make sure mcpServers exists and is an object
      if (
        !existingData.mcpServers ||
        typeof existingData.mcpServers !== "object"
      ) {
        existingData.mcpServers = {}
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error)
      logger.warn(
        `Failed to read or parse existing mcp.json at ${mcpJsonPath}: ${errMsg}. Will create new file.`,
        false,
      )
      // Reset on error
      existingData = { mcpServers: {} }
    }
  }

  // 2. Define our LemonadeRAG server configuration
  const argonBinary = path.join(os.homedir(), ".argon", "bin", "argon")
  const lemonadeRagServer = {
    command: argonBinary,
    args: ["connect-mcp"],
  }

  // 3. Update or add our server config
  existingData.mcpServers.lemonadeRag = lemonadeRagServer

  // 4. Write the modified data back
  try {
    fs.writeFileSync(mcpJsonPath, JSON.stringify(existingData, null, 2))
    logger.info(
      `Successfully updated LemonadeRAG MCP server in ${mcpJsonPath}`,
      false,
    )
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    logger.error(
      `Failed to write MCP configuration to ${mcpJsonPath}: ${errMsg}`,
      false,
      true,
    )
  }
}
