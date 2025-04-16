import { commands } from "vscode"
import * as argon from "../argon"
import { updateExtension } from "../extension"
import { writeMcpConfig } from "../mcpConfig"
import { syncRules } from "../ruleSync"
import { State } from "../state"

export function update(state: State) {
  return commands.registerCommand("argon.update", async () => {
    // Update CLI, plugin and templates (but not vscode since we'll handle that separately)
    await argon.update("cli", false)
    await argon.update("plugin", false)
    await argon.update("templates", false)

    // Then try to update the extension itself
    await updateExtension()
    
    // After updates, sync rule files and ensure MCP configuration is properly set up
    await syncRules(state.context)
    await writeMcpConfig()
  })
}
