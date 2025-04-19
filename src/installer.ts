import * as os from "os"
import * as fs from "fs"
import * as path from "path"
import * as childProcess from "child_process"
import { downloadRelease } from "@terascope/fetch-github-release"
import { updatePathVariable } from "./util"
import * as logger from "./logger"

export async function install() {
  const execPath =
    path.join(os.homedir(), ".argon", "bin", "argon") +
    (os.platform() === "win32" ? ".exe" : "")

  // Check if argon is already installed and working
  try {
    const version = childProcess
      .execSync(`"${execPath}" --version`, {
        encoding: "utf-8" as BufferEncoding,
      })
      .toString()
      .trim()
    logger.info(`Argon ${version} is already installed`)
    return
  } catch (err) {
    logger.info("Installing Argon...")
  }

  let versionIndex = 0

  // Create bin directory
  const binDir = path.dirname(execPath)
  fs.mkdirSync(binDir, { recursive: true })

  try {
    // Clean up any existing broken installation
    if (fs.existsSync(execPath)) {
      fs.unlinkSync(execPath)
    }

    // Download the binary
    await downloadRelease("LupaHQ", "argon", binDir, undefined, (asset) => {
      if (versionIndex > 1) {
        throw new Error(
          `Your OS or CPU architecture is not yet supported by Argon! (${os.platform()} ${os.arch()})`,
        )
      }

      if (asset.name.endsWith("linux-x86_64.zip")) {
        versionIndex++
      }

      const platform = os
        .platform()
        .replace("darwin", "macos")
        .replace("win32", "windows")

      const arch =
        os.platform() === "win32"
          ? "x86_64"
          : os.arch().replace("x64", "x86_64").replace("arm64", "aarch64")

      const matches = asset.name.includes(platform) && asset.name.includes(arch)
      if (matches) {
        logger.info(`Downloading ${asset.name}...`)
      }
      return matches
    })

    // Verify the binary exists and has content
    if (!fs.existsSync(execPath)) {
      throw new Error(`Failed to download Argon binary`)
    }

    const stats = fs.statSync(execPath)
    if (stats.size === 0) {
      throw new Error(`Downloaded binary is empty`)
    }

    // On Windows, verify the executable
    if (os.platform() === "win32") {
      try {
        const execOptions = {
          windowsHide: true,
          env: {
            ...process.env,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            PATH: `${process.env.SystemRoot}\\System32;${process.env.PATH || ""}`,
          },
          encoding: "utf-8" as BufferEncoding,
        }
        childProcess.execFileSync(execPath, ["--help"], execOptions)
      } catch (err: any) {
        throw new Error(`Installation failed: ${err.message}`)
      }
    }

    // Make binary executable on Unix systems
    if (os.platform() !== "win32") {
      fs.chmodSync(execPath, "755")
    }

    // Update PATH before trying to run argon
    updatePathVariable()

    // Try running with full path
    try {
      const execOptions = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        env: { ...process.env, PATH: process.env.PATH },
        encoding: "utf-8" as BufferEncoding,
      }
      const version = childProcess.execFileSync(
        execPath,
        ["--version"],
        execOptions,
      )
      logger.info(`Successfully installed Argon ${version.toString().trim()}`)
    } catch (err: any) {
      throw new Error(`Failed to verify installation: ${err.message}`)
    }
  } catch (err) {
    logger.error(`Installation failed: ${err}`)
    throw err
  }
}
