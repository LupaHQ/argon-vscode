````markdown
# Master-Structure FAQ

_(extended reference for **010_master_project_structure.mdc**)_

---

## 1 · Why can’t I edit `default.project.json`?

`default.project.json` is the **ground truth** mapping between your local
filesystem and the live Roblox hierarchy.  
If it drifts, every `require`, `WaitForChild`, and asset mount breaks.

| Allowed change (rare) | Typical reason                                           |
| --------------------- | -------------------------------------------------------- |
| Top-level `"name"`    | Re-branding the whole experience (avoid unless required) |
| Service `$path` tweak | Non-standard source layout **mandated** by tooling       |

Everything else is **frozen**. Add new content _inside_ the folders those
`$path` strings already point to.

---

## 2 · Service-selection cheat-sheet ⭐ **NEW**

| Store the thing…           | Service / path                 | Why                             |
| -------------------------- | ------------------------------ | ------------------------------- |
| Shared modules / remotes   | **ReplicatedStorage**          | Visible to both server & client |
| Server-only data / assets  | **ServerStorage**              | Hidden from clients             |
| Auto-cloned UI roots       | **StarterGui**                 | Copied to `PlayerGui` on spawn  |
| Per-player client scripts  | **StarterPlayerScripts**       | Runs once each join             |
| Map parts / gameplay props | **Workspace** (or sub-folders) | World geometry & live objects   |

Use folders to group logically related items.  
Need a non-Folder instance under a service? Add a new directory +
`init.meta.json` (see §5).

---

## 3 · File-suffix ⇒ script-type cheat-sheet

| Suffix            | Creates             | Can `require` it? |
| ----------------- | ------------------- | ----------------- |
| `.client.luau`    | **LocalScript**     | ❌                |
| `.server.luau`    | **Script** (server) | ❌                |
| `.luau` _(plain)_ | **ModuleScript**    | ✅                |

_💡 Rojo decides by filename alone; no overrides._

**Fatal mismatch**: writing a module in `.server.luau` / `.client.luau`
→ `require()` returns **nil** → silent bugs.

---

## 4 · “Why did `require` explode?”

1. You passed a LocalScript / Script, not a ModuleScript.
2. The module you asked for also calls `require` on _you_ — **circular
   dependency**. Break the loop by:
   - passing one module as a parameter, **or**
   - using **BindableEvent / BindableFunction**.

---

## 5 · UI creation MUST be runtime

Rojo-mapped UI folders often sync as plain **Folder** instances, so code
waiting for `Frame` stalls forever.  
Always build scripted UI at run-time:

```lua
local frame = Instance.new("Frame")
frame.Parent = playerGui
```
````

(See `021_roblox_script_best_practices.mdc` for details.)

---

## 6 · `init` files vs `init.meta.json`

| Purpose                        | File placed **inside** folder                         |
| ------------------------------ | ----------------------------------------------------- |
| Turn folder → Script/Module    | `init.client.luau` / `init.server.luau` / `init.luau` |
| Turn folder → non-script asset | `init.meta.json`                                      |

> **One transform per folder** — never combine both.

---

## 7 · One-value export rule

ModuleScripts **must** return exactly one value:

```lua
local M = {}
return M          -- one value only
```

Multiple returns or naked locals confuse Luau’s loader.

---

## 8 · Common gotchas quick-list

| Symptom                                                | Likely cause & fix                                                |
| ------------------------------------------------------ | ----------------------------------------------------------------- |
| _“Attempted to call require with invalid argument(s)”_ | Requiring a Script/LocalScript → use a ModuleScript.              |
| Module never finishes loading                          | Top-level `WaitForChild` deadlock → move inside an init function. |
| UI `Folder` instead of `ScreenGui`                     | Used `init.meta.json` for UI → build at run-time instead.         |
| New asset not appearing in Studio                      | `$path` mismatch — check `default.project.json`.                  |

---

## 9 · Still puzzled? run this mental checklist

1. **Service / path** — am I under the right `$path`?
2. **Suffix** — does the filename match the behaviour I expect?
3. **Cycles** — did I create a loop of `require`s or `WaitForChild`s?

If any answer is fuzzy → open the linked rule/doc before coding.

---

_End of file_
