_(companion to **`mdc:020_init_meta_json_best_practices.mdc`**)_

---

## 1 · Minimal “name-folder-as-instance” recipe

> **Goal:** turn a directory into a **non-Folder** instance.

```
# Filesystem
src/
  ReplicatedStorage/
    RoundState/
      init.meta.json
```

```jsonc
// RoundState/init.meta.json
{
  "className": "stringvalue",
  "properties": {
    "value": "lobby", // default
  },
}
```

**Outcome in Studio**

```
ReplicatedStorage
  RoundState   [StringValue]   → Value = "lobby"
```

_(No Lua files needed when all you want is the ValueObject itself.)_

---

## 2 · Adding custom properties

```jsonc
{
  "className": "part",
  "properties": {
    "size": { "Vector3": [4, 1, 4] },
    "anchored": true,
    "color": { "Color3": [0.2, 0.6, 1] },
  },
}
```

Keys stay **lowercase**; complex types are wrapped (`Vector3`, `Color3`, …).

---

## 3 · When **not** to use `init.meta.json`

| Situation                                                                 | Correct approach                                                  |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| UI (Frame, Button, …) that scripts will reference                         | Create at runtime with `Instance.new()` inside a LocalScript      |
| Plain organisational folder already synced via `$path`                    | Do nothing — Rojo already makes a `Folder`                        |
| You only need to set properties on an existing file (for example, Script) | Use a sibling **`<Name>.meta.json`**, **not** an `init.meta.json` |

---

## 4 · Common mistakes → quick fixes

| Mistake                                         | Symptom                             | Fix                                                                  |
| ----------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------- |
| File named `SomeValue.meta.json` (no folder)    | A _file_ instance appears in Studio | Create folder `SomeValue/` → move JSON to `SomeValue/init.meta.json` |
| Upper-case keys (`"ClassName"`, `"Properties"`) | Rojo ignores JSON                   | Make every key **lowercase**                                         |
| Raw complex type (`"size": [[0,100],[0,50]]`)   | Rojo sync error                     | Wrap type → `"size": { "UDim2": [[0,100],[0,50]] }`                  |

---

## 5 · FAQ

**Q — Can I place Lua code alongside an `init.meta.json`?**  
A — Yes. Any `.luau` in the same directory becomes a child Script/ModuleScript of the new instance.

**Q — Does `init.meta.json` work inside a folder already transformed by `init.client|server|.luau`?**  
A — No. A directory can transform into **one** thing: either a Script/ModuleScript _or_ a non-script instance, not both.

---

> 💡 **Tip:** need to share functions or tables across scripts?  
> Use a ModuleScript or BindableEvent – **Attributes cannot store functions** (see `mdc:020_init_meta_json_best_practices.mdc §attributes`).
