# Wrap-Execution – extended guide

_(supplement for rules 001a-c)_

---

## 0 · Three micro-rules at a glance

| Rule                         | Phase-guard used                              | Purpose                                                                        |
| ---------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------ |
| **001a_read_lemonlogs**      | `<!-- if phase() != 'finish' then return -->` | Load `lemonlogs.txt`.                                                          |
| **001b_wrap_execution**      | _(none)_                                      | Decide follow-up work and, if needed, call **any** MCP tool you deem relevant. |
| **001c_guarantee_integrity** | _(none)_                                      | Final sanity pass before Cursor returns.                                       |

Only rule 001a is phase-guarded;

---

## 1 · Recommended 001b flow

1. **Log** “Wrap Execution started”.
2. **Summarise** (1 line) the first principles of the task just completed.
3. **Ask Cursor** for the list of files changed in this turn.
4. **Scan** `lemonlogs.txt` for `WARN`, `ERROR`, or patterns below.
5. **For each hit,** decide whether an MCP lookup helps:

| Log cue / dev note                                 | MCP tool                      | **User-lens query** example                           |
| -------------------------------------------------- | ----------------------------- | ----------------------------------------------------- |
| `syntax error`, `unexpected symbol`                | `luau_documentation`          | “elseif syntax example”, “for-loop grammar”           |
| `unknown property`, `invalid arg`, `Enum.*` issues | `roblox_engine_documentation` | “Humanoid:MoveTo parameters”, “Enum.Material members” |
| “how do I …”, “any idea”, performance or patterns  | `roblox_developer_forum`      | “How do I handle many Touched events efficiently”     |

6. **Patch** only the affected file(s) based on what you learned.
7. Hand off to **001c_guarantee_integrity**.

---

## 2 · Integrity checklist consumed by 001c

- [ ] No actionable lines remain in **`lemonlogs.txt`**.
- [ ] All modified files still compile / lint clean.
- [ ] No circular `require`, bad IDs, or path mistakes introduced.

_(End of file)_
