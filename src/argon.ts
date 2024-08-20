import * as childProcess from "child_process"
import * as logger from "./logger"
import * as config from "./config"
import { getCurrentDir } from "./util"

let lastId = 0

export type DebugMode = "play" | "run" | "start" | "stop"
export type PluginMode = "install" | "uninstall"
export type UpdateMode = "all" | "cli" | "plugin" | "templates"

function log(data: string, silent?: boolean) {
  let output = undefined

  for (const line of data.trim().split("\n")) {
    const isVerbose = line.endsWith("]") || !/^.{0,5}:/.test(line)

    if (line.startsWith("ERROR")) {
      logger.error(line, isVerbose)
    } else if (line.startsWith("WARN")) {
      logger.warn(line, isVerbose)
    } else {
      logger.info(line, isVerbose || silent)
    }

    if (!isVerbose && !output) {
      output = line
    }
  }

  return output
}

async function spawn(args: string[], silent?: boolean) {
  logger.info("Starting new Argon process..", true)

  const process = childProcess.spawn(
    "argon",
    args.concat([
      config.verbose() ? "-vvvv" : "-v",
      "--yes",
      "--color",
      "never",
    ]),
    {
      cwd: getCurrentDir(),
    },
  )

  const firstOutput: string = await new Promise((resolve) => {
    process.stdout?.on("data", (data) => {
      const output = log(data.toString(), silent)

      if (output) {
        resolve(output)
      }
    })

    process.stderr?.on("data", (data) => {
      const output = log(data.toString(), silent)

      if (output) {
        resolve(output)
      }
    })
  })

  return (process.exitCode === 0 || process.exitCode === null) &&
    !firstOutput.includes("Command execution failed")
    ? Promise.resolve(firstOutput)
    : Promise.reject(firstOutput)
}

function generateId() {
  let id = Date.now()

  if (id === lastId) {
    id++
  }

  lastId = id

  return id
}

export async function serve(
  project: string,
  options: string[],
): Promise<[number, string]> {
  const id = generateId()
  const message = await spawn(["serve", project, id.toString(), ...options])

  return [id, message]
}

export async function build(project: string, options: string[]) {
  if (options.includes("--watch")) {
    const id = generateId()
    await spawn(["build", project, id.toString(), ...options])

    return id
  }

  await spawn(["build", project, ...options])
}

export async function sourcemap(project: string, options: string[]) {
  if (options.includes("--watch")) {
    const id = generateId()
    await spawn(["sourcemap", project, id.toString(), ...options])

    return id
  }

  await spawn(["sourcemap", project, ...options])
}

export function init(project: string, template: string, options: string[]) {
  spawn(["init", project, "--template", template, ...options])
}

export function stop(ids: number[]) {
  spawn(["stop", ...ids.map((id) => id.toString())], true)
}

export function debug(mode: DebugMode) {
  spawn(["debug", mode], true)
}

export function exec(code: string, focus?: boolean) {
  const args = focus ? ["--focus"] : []
  spawn(["exec", code, ...args], true)
}

export function studio(check?: boolean, place?: string) {
  const args = []

  if (place) {
    args.push(place)
  }

  if (check) {
    args.push("--check")
  }

  spawn(["studio", ...args], true)
}

export function plugin(mode: PluginMode) {
  spawn(["plugin", mode])
}

export function update(mode: UpdateMode, auto?: boolean) {
  spawn(["update", mode], auto)
}

export function version() {
  return childProcess.execSync("argon --version").toString()
}
