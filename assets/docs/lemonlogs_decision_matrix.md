# When should wrap-execution call a documentation MCP tool?

| Log cue found in `lemonlogs.txt`                 | Tool to call                    | Why / what you’re looking for                       |
| ------------------------------------------------ | ------------------------------- | --------------------------------------------------- |
| `attempt to call` / `attempt to index`           | **luau_documentation**          | Check correct syntax / function-vs-property usage   |
| `is not a valid member of` / `unknown property`  | **roblox_engine_documentation** | Confirm the class really has that property / method |
| `Enum.*` appears but value fails                 | **roblox_engine_documentation** | Verify enum names & members                         |
| `Argument #n` type mismatch                      | **luau_documentation**          | Review expected parameter types                     |
| `Infinite yield possible on`                     | **roblox_engine_documentation** | Learn replication timing & alternatives             |
| `Players:` \* forum-style troubleshooting needed | **roblox_developer_forum**      | Search community posts for similar runtime issues   |
| Any unfamiliar API name                          | **roblox_engine_documentation** | Get the official definition                         |
| Any syntax error that isn’t obvious              | **luau_documentation**          | Refresh exact Luau grammar                          |
| `unexpected symbol 'elif'` / `expected 'end'`    | **luau_documentation**          | Classic `elseif` vs `elif` / missing-`end` pitfalls |

> **Rule-of-thumb:** when the log references _syntax_ → Luau docs;  
> when it references _engine classes / properties_ → Engine docs;  
> when you suspect edge-cases or need examples → Developer Forum.
