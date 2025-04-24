# Wrap-Execution – extended guide

_(supplement for rules 001a-c)_

---

## 0 · Three micro-rules at a glance

| Rule                         | Phase-guard used                              | Purpose                                                                        |
| ---------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------ |
| **001a_read_lemonlogs**      | `<!-- if phase() != 'finish' then return -->` | Load `lemonlogs.txt`.                                                          |
| **001b_wrap_execution**      | _(none)_                                      | Decide follow-up work and, if needed, call **any** MCP tool you deem relevant. |
| **001c_guarantee_integrity** | _(none)_                                      | Final sanity pass before Cursor returns.                                       |

Only rule 001a is phase-guarded; the other two are < 50 lines and cheap to run.

---

## 1 · Recommended 001b flow

1. **Log** “Wrap Execution started”.
2. **Summarise** (1 line) the first principles of the task just completed.
3. **Ask Cursor** for the list of files changed in this turn.
4. **Scan** `lemonlogs.txt` for `WARN`, `ERROR`, or patterns below.
5. **For each hit,** decide whether an MCP lookup helps:

   | Log cue                             | MCP tool to call              | What you’re looking for                              |
   | ----------------------------------- | ----------------------------- | ---------------------------------------------------- |
   | `syntax error`, `unexpected symbol` | `luau_documentation`          | Correct grammar / keyword usage.                     |
   | `unknown property`, `invalid arg`   | `roblox_engine_documentation` | Correct class/property names and value types.        |
   | `how do i`, `any idea`, vague notes | `roblox_developer_forum`      | Community work-arounds or best-practice discussions. |

6. **Patch** only the affected file(s) based on what you learned.
7. Hand off to **001c_guarantee_integrity**.

---

## 2 · Integrity checklist consumed by 001c

- [ ] No actionable lines remain in **`lemonlogs.txt`**.
- [ ] All modified files still compile / lint clean.
- [ ] No circular `require`, bad IDs, or path mistakes introduced.

_(End of file)_
