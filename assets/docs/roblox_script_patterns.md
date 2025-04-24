# Roblox script patterns – full guide

_(companion to 021_roblox_script_best_practices.mdc)_

---

## 1 Authority & Remote-communication patterns

_Clients (.client.luau) can’t change server state directly_ – they must call a
Remote.  
Typical flow:

| Direction              | Object & call                                | Sample one-liner          |
| ---------------------- | -------------------------------------------- | ------------------------- |
| Client → Server        | `RemoteEvent:FireServer(...)`                | send damage request       |
| Server → Client        | `RemoteEvent:FireClient(plr, …)`             | push UI update            |
| Bidirectional function | `RemoteFunction:InvokeServer / InvokeClient` | use sparingly (can yield) |

---

## 2 WaitForChild vs FindFirstChild – decision tree

```text
Is the instance created at edit-time?
│
├─ Yes → use FindFirstChild (non-blocking)  ──┐
│                                            │
└─ No  (spawned/replicated later)            ▼
        Need to proceed immediately?  — Yes → FindFirstChild + retry
                                       No  → WaitForChild(timeout?)
```

Special case: **Player characters** must use  
`player.Character or player.CharacterAdded:Wait()` then  
`character:WaitForChild("HumanoidRootPart")`.

---

## 3 Deadlock avoidance in ModuleScripts

### 3.1 Circular WaitForChild

<details><summary>Problem script pair</summary>

```luau
-- GameManager.luau  (blocks on WaitForChild)
local events = game.ServerStorage:WaitForChild("GameEvents")
return {}

-- GameInitializer.server.luau
local GM = require(path.to.GameManager)   -- never returns
local f = Instance.new("Folder")
f.Name = "GameEvents"
f.Parent = game.ServerStorage
```

</details>

**Fix 1 – post-init function**

```luau
-- GameManager.luau
local module = {}
function module.init()
    local events = game.ServerStorage:WaitForChild("GameEvents")
end
return module

-- GameInitializer.server.luau
local GM = require(path.to.GameManager)
createEventsFolder()
GM.init()
```

**Fix 2 – lazy getter with FindFirstChild + warn/timeout.**

---

## 4 UI build-time vs run-time matrix

| Scenario                                   | Recommended technique                    |
| ------------------------------------------ | ---------------------------------------- |
| UI that **scripts will access**            | Create with `Instance.new()` at run-time |
| Purely static decoration                   | Build in Studio / Rojo                   |
| Need non-Folder instance under `$path` dir | Folder + `init.meta.json`                |

_(See also `docs/init_meta_json_examples.md`.)_

---

## 5 Event-connection specificity pattern

Touch-to-remove tile (server):

```luau
local function onTileTouch(hit, tile)
    local hum = hit.Parent:FindFirstChildOfClass("Humanoid")
    if hum and roundActive then  MakeTileDisappear(tile)  end
end

for _, tile in GetTiles() do
    tile.Touched:Connect(function(part) onTileTouch(part, tile) end)
end
```

Avoid broad listeners (`Humanoid.Touched`) that require filtering.

---

## 6 Type-safety pitfalls

```luau
part.CFrame = posVector          -- ❌  Vector3 → CFrame property
part.CFrame = CFrame.new(posVector) -- ✅
```

---

## 7 Script-suffix quick-reference & “fatal-mismatch” pitfall

| File suffix    | Rojo instance | Auto-runs          | `require()` works? | Typical use                         |
| -------------- | ------------- | ------------------ | ------------------ | ----------------------------------- |
| `.luau`        | ModuleScript  | No                 | **✅ Yes**         | Shared library / utilities          |
| `.server.luau` | Script        | Yes (Server start) | ❌ No              | Server bootstrap / loop controllers |
| `.client.luau` | LocalScript   | Yes (Client join)  | ❌ No              | UI handlers / input capture         |

> **Fatal mismatch**  
> Writing a module in a `.server.luau` or `.client.luau` file silently breaks `require()`:

```lua
-- ❌ wrong: script-suffix makes this a Script → require() fails
-- BadModule.server.luau
local M = {} ; function M.foo() end ; return M
```

Rename to BadModule.luau (ModuleScript) or move the logic into a real ModuleScript, then require() works.

---

## 8 Full sample blocks preserved

_Teleport-to-spawn_, _MapManager lazy remote_, _Custom spawning + disabling
SpawnLocations_ are reproduced verbatim below for quick copy-paste.

<details><summary>Teleport-to-spawn</summary>

```luau
local function teleportPlayerToSpawn(p, pos:Vector3)
    local char = p.Character or p.CharacterAdded:Wait()
    local hrp  = char:WaitForChild("HumanoidRootPart", 5)
    if hrp then hrp.CFrame = CFrame.new(pos) end
end
```

</details>

<details><summary>MapManager lazy-load</summary>

```luau
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local module = {}
local function getRemote()
    local ev = ReplicatedStorage:FindFirstChild("RoundStateChanged")
    if not ev then
        warn("Remote missing; waiting")
        ev = ReplicatedStorage:WaitForChild("RoundStateChanged",10)
    end
    return ev
end
function module.Notify(state)
    local ev = getRemote()
    if ev then ev:FireAllClients(state) end
end
return module
```

</details>

_(…include any other long examples you need.)_

---

_End of file_
