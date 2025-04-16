import * as argon from "../argon"
import { Item } from "."
import { updateExtension } from "../extension"
import { writeMcpConfig } from "../mcpConfig"
import { syncRules } from "../ruleSync"
import { State } from "../state"

export const item: Item = {
  label: "$(refresh) Update Lemonade",
  description: "Update CLI, plugin and extension components",
  action: "update",
}

export async function run(_state: State): Promise<void> {
  // Update CLI, plugin and templates (but not vscode since we'll handle that separately)
  await argon.update("cli", false)
  await argon.update("plugin", false)
  await argon.update("templates", false)

  // Then try to update the extension itself
  await updateExtension()

  // After updates, sync rule files and ensure MCP configuration is properly set up
  await syncRules(_state.context)
  await writeMcpConfig()
}
