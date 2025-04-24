# Master-Structure FAQ

_(extended reference for **010_master_project_structure.mdc**)_

---

## 1 · “Why can’t I edit `default.project.json`?”

`default.project.json` is the **ground truth** mapping between your local
filesystem and the live Roblox hierarchy.  
Changing it mid-stream breaks every path-based require, WaitForChild, and
synced asset.  
**Allowed edits only**

| Allowed change              | Typical reason                                           |
| --------------------------- | -------------------------------------------------------- |
| Top-level `"name"`          | Renaming the whole game / experience (avoid this though) |
| Service-level `$path` tweak | Non-standard source layout **required** by tooling.      |

---

## 2 · File-suffix ⇒ script-type cheat-sheet

| Suffix            | Creates             | Can `require` it? |
| ----------------- | ------------------- | ----------------- |
| `.client.luau`    | **LocalScript**     | ❌                |
| `.server.luau`    | **Script** (server) | ❌                |
| `.luau` _(plain)_ | **ModuleScript**    | ✅                |

_💡 Rojo decides by filename alone; no overrides._

---

## 3 · “Why did `require` just explode?”

1. You handed it a LocalScript / Script, not a ModuleScript.
2. The module you asked for also calls `require` on you: **circular
   dependency**; break the loop by:
   - Passing one module as a parameter, **or**
   - Using **BindableEvent / BindableFunction**.

---

## 4 · UI creation MUST be runtime

Rojo-mapped UI often synchronises as a **Folder**, so scripts looking for
`Frame` will Block/Wait forever.  
Always build UI programmatically with:

```lua
local frame = Instance.new("Frame")
frame.Parent = playerGui
```

(See `021_roblox_script_best_practices.mdc` for the rationale.)

---

## 5 · `init` files vs `init.meta.json`

| Purpose                        | File placed **inside** folder                         |
| ------------------------------ | ----------------------------------------------------- |
| Turn folder → Script/Module    | `init.client.luau` / `init.server.luau` / `init.luau` |
| Turn folder → non-script asset | `init.meta.json`                                      |

Never combine the two in one directory.

---

## 6 · One-value export rule

ModuleScripts **must**:

```lua
local M = {}
return M   -- exactly one value
```

Multiple returns or naked locals confuse the Luau loader.

---

## 7 · Common gotchas quick-list

| Symptom                                                | Likely cause & fix                                                |
| ------------------------------------------------------ | ----------------------------------------------------------------- |
| _“Attempted to call require with invalid argument(s)”_ | Requiring a Script/LocalScript. Use a ModuleScript.               |
| Module never finishes loading                          | Top-level `WaitForChild` deadlock → move inside an init function. |
| UI `Folder` instead of `ScreenGui`                     | You used `init.meta.json` for UI → build at runtime instead.      |
| New asset not appearing in Studio                      | `$path` mismatch — check `default.project.json`.                  |

---

## 8 · Still puzzled?

_Ask yourself:_

1. Which **service / path** is this file supposed to live under?
2. Does its **suffix** match the runtime behaviour I expect?
3. Am I accidentally creating a **cycle** of `require`s or `WaitForChild`s?

If any answer is fuzzy — stop and check the relevant rule doc first.

---

_(End of file)_
