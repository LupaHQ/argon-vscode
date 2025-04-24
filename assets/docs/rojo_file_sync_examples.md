# Rojo file-sync – deep-dive examples

_(companion to 012_rojo_file_sync.mdc)_

---

## 1 · “Anchor” pattern for non-script instances inside `$path`

Filesystem ⬇

```
src/
  ReplicatedStorage/
    Events/                      ← synced by "$path"
      RoundStateChanged.meta.json
      RoundStateChanged.luau     ← EMPTY anchor
```

```jsonc
// RoundStateChanged.meta.json
{ "className": "RemoteEvent" }
```

Studio result ⬇

```
ReplicatedStorage
  Events [Folder]
    RoundStateChanged [RemoteEvent]
```

**Why the empty `.luau`?**  
Without it Rojo sometimes skips the `.meta.json`, causing
`Infinite yield possible` when scripts `WaitForChild` the event.

---

## 2 · `init.meta.json` vs `init.luau` decision table

| Need                                      | File(s) to add                          | Resulting instance                                    |
| ----------------------------------------- | --------------------------------------- | ----------------------------------------------------- |
| Turn folder into **Script / LocalScript** | `init.server.luau` / `init.client.luau` | the folder itself **becomes** a Script / LocalScript  |
| Turn folder into **ModuleScript**         | `init.luau`                             | becomes a ModuleScript                                |
| Turn folder into **non-Folder value**     | `init.meta.json`                        | becomes for example, `BoolValue`, `StringValue`, etc. |
| Keep as Folder but set props              | _nothing_ – Folder is default           | Folder                                                |

> One directory can use **one** transform file, never both.

---

## 3 · Duplicate-instance pitfalls & fixes

| Conflict pattern                                                                 | Symptom                          | Fix                                                           |
| -------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------- |
| `$path` syncs `MyFolder/` **and** virtual `"MyFolder"` in `default.project.json` | Two “MyFolder” objects in Studio | Delete the virtual child **or** rename physical folder        |
| `SomeValue.meta.json` as a **file** (not folder)                                 | A file-instance shows up         | Create `SomeValue/` directory → move JSON to `init.meta.json` |
| Upper-case JSON keys (`"ClassName"`)                                             | Instance not created             | Use **lowercase** keys only                                   |
| Raw complex type (`"size":[[0,100],[0,50]]`)                                     | Rojo sync error                  | Wrap → `"size":{ "UDim2":[[0,100],[0,50]] }`                  |

---

## 4 · Quick reference – common `$path` layouts

| Roblox service       | Typical `$path`                          |
| -------------------- | ---------------------------------------- |
| ReplicatedStorage    | `src/ReplicatedStorage`                  |
| ServerScriptService  | `src/ServerScriptService`                |
| StarterPlayerScripts | `src/StarterPlayer/StarterPlayerScripts` |
| StarterGui           | `src/StarterGui`                         |

Keep the default mapping unless you _must_ move it.

---

_End of file_
