# default.project.json — FAQ & cookbook

_(companion to 000_lock_default_project_json.mdc & 011_default_project_json.mdc)_

---

## 1 Why so strict?

`default.project.json` is the _single_ mapping source.  
If it lies, every `require`, `WaitForChild`, and asset-mount breaks.

---

## 2 ABSOLUTE rule

> You may **only append new child keys _inside_ an existing service block.**  
> All root keys, every existing `$path`, and the game `"name"` are read-only.  
> Any other edit violates `000_lock_default_project_json.mdc` and will be reverted.

| Field / key                                                  | May I change it? | Why                                                   |
| ------------------------------------------------------------ | ---------------- | ----------------------------------------------------- |
| `"name": "{user_folder}"`                                    | **No**           | Keeps Rojo IDs stable across CI/Studio files.         |
| First-level service (`Workspace`,<br>`ReplicatedStorage`, …) | **No**           | Root services are fixed for this game.                |
| Existing `$path` strings                                     | **No**           | They map to the synced directories that already work. |

**Allowed additions**

1. **Physical** – create a real folder/file under an existing `$path`.
2. **Virtual child** – add a new key _inside_ a service, for example,
   ```jsonc
   "ReplicatedStorage": {
     "$path": "src/ReplicatedStorage",
     "UpdateRoundUI": { "$className": "RemoteEvent" }   // allowed
   }
   ```
3. Never touch root-level keys.
4. Need anything fancier? Make a folder + `init.meta.json` under the correct `$path`.

---

## 3 Child-creation recipes

| Goal                                 | Technique                      | Minimal example                                                   |
| ------------------------------------ | ------------------------------ | ----------------------------------------------------------------- |
| **Sync a real folder**               | `$path`                        | `json\n"ReplicatedStorage":{ "$path":"src/ReplicatedStorage" }\n` |
| **Pure virtual instance**            | `$className`                   | `json\n"MyFolder":{ "$className":"Folder" }\n`                    |
| **Transform folder into non-Folder** | `init.meta.json` inside folder | see below                                                         |

> Rojo auto-creates _Folders_ for every directory under a `$path`; use  
> **init.meta.json** only when you need a different class.

---

### 3.1 Transform example

Filesystem

```
src/ReplicatedStorage/RoundState/
  init.meta.json
```

```jsonc
{ "className": "StringValue", "properties": { "Value": "lobby" } }
```

Studio → `ReplicatedStorage.RoundState` [StringValue] (Value = "lobby")

---

## 4 Conflict table

| You did…                                           | Result in Studio        | Fix                                         |
| -------------------------------------------------- | ----------------------- | ------------------------------------------- |
| `$path` **and** a virtual child with same name     | Duplicate instances     | Delete one; keep folder + `init.meta.json`. |
| `.meta.json` under `$path` **without** anchor file | Instance may not appear | Add empty `.luau` file with same basename.  |

---

## 5 Working snippets

<details><summary>5.1 Folder synced by $path</summary>

```json
{
  "ReplicatedStorage": { "$path": "src/ReplicatedStorage" }
}
```

Filesystem → Studio  
`src/ReplicatedStorage/MyFolder/` ⇒ `ReplicatedStorage.MyFolder` [Folder]

</details>

<details><summary>5.2 Pure virtual folder (no disk folder)</summary>

```json
{
  "ReplicatedStorage": {
    "$className": "ReplicatedStorage",
    "RuntimeOnly": { "$className": "Folder" }
  }
}
```

_No filesystem change needed; Rojo creates the folder at runtime._

</details>

<details><summary>5.3 Anchor pattern (non-init .meta.json)</summary>

```
src/ReplicatedStorage/Events/
  RoundStateChanged.meta.json   // RemoteEvent spec
  RoundStateChanged.luau        // EMPTY anchor
```

Rojo now creates the `RemoteEvent` reliably.

</details>

---

_Edge case not covered?_ See `docs/rojo_file_sync_examples.md`
