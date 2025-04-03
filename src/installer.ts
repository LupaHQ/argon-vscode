import * as os from "os"
import * as fs from "fs"
import * as path from "path"
import * as childProcess from "child_process"
import { downloadRelease } from "@terascope/fetch-github-release"
import { updatePathVariable } from "./util"

export async function install() {
  const isWindows = os.platform() === "win32"
  const argonDir = path.join(os.homedir(), ".argon")
  const binDir = path.join(argonDir, "bin")
  const execName = "argon" + (isWindows ? ".exe" : "")
  const execPath = path.join(binDir, execName)

  const owner = "LupaHQ"
  const repo = "argon"

  let versionIndex = 0

  // Ensure the target directory exists
  fs.mkdirSync(binDir, { recursive: true })

  console.log(`Attempting to download Argon CLI from ${owner}/${repo} to: ${binDir}`)

  try {
    await downloadRelease(
      owner,
      repo,
      binDir,
      undefined,
      (asset) => {
        if (versionIndex > 1) {
          console.warn("Found multiple potential assets, download logic might be confused.")
        }

        const platform = os
          .platform()
          .replace("darwin", "macos")
          .replace("win32", "windows")

        const arch = isWindows
          ? "x86_64"
          : os.arch().replace("x64", "x86_64").replace("arm64", "aarch64")

        console.log(`Checking asset: ${asset.name} against platform: ${platform}, arch: ${arch}`)
        const isMatch = asset.name.includes(platform) && asset.name.includes(arch)

        if (isMatch) {
          console.log(`Found matching asset: ${asset.name}`)
          versionIndex++
        }
        return isMatch
      },
      false,
      false
    )

    console.log(`Download/extraction complete. Target path: ${execPath}`)

    if (!fs.existsSync(execPath)) {
      throw new Error(`Executable not found after download/extraction: ${execPath}`)
    }

    console.log("Setting executable permissions...")
    fs.chmodSync(execPath, 0o755)

    if (os.platform() === "darwin") {
      console.log("Attempting to remove quarantine attribute on macOS...")
      try {
        const xattrResult = childProcess.spawnSync("xattr", ["-d", "com.apple.quarantine", execPath], { stdio: 'inherit' })
        if (xattrResult.status !== 0) {
          console.warn(`'xattr -d com.apple.quarantine' failed with status ${xattrResult.status}. Gatekeeper might still interfere.`)
        } else {
          console.log("Quarantine attribute removed (or was not present).")
        }
      } catch (err) {
        console.warn(`Failed to run xattr command: ${err}. Gatekeeper might still interfere.`)
      }
    }

    console.log("Verifying installation by running --version...")
    childProcess.execFileSync(execPath, ["--version"])

    console.log("Installation verified successfully.")

    updatePathVariable()

  } catch (err) {
    console.error(`Installation failed: ${err}`)
    throw err
  }
}
