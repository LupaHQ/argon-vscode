# Roblox / Luau quick references

| Topic                        | TL;DR one-liner                                      | Full doc / search term         |
| ---------------------------- | ---------------------------------------------------- | ------------------------------ |
| ModuleScript                 | Return _one_ table, locals are private               | “ModuleScript best practices”  |
| Instance.new                 | Server-side → replicated, Client-side → local-only   | “Instance.new”                 |
| Part                         | Class inherits BasePart; no UI code                  | “Part”                         |
| CFrame                       | Use `CFrame.new(Vector3)` not `Vector3` for Position | “CFrame”                       |
| RemoteEvent vs BindableEvent | Network vs same-context                              | “RemoteEvent”, “BindableEvent” |
