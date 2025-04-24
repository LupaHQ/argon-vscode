# Luau Syntax “Gotchas”

_(extended examples for **022_luau_syntax_pitfalls.mdc**)_

---

## 1 · `elseif` is one word

```lua
-- BAD
if foo then
    …
else if bar then  -- ❌ creates nested if; needs extra end
    …
end

-- GOOD
if foo then
    …
elseif bar then   -- ✅ single keyword
    …
end
```

---

## 2 · `:` vs `.` when calling methods

```lua
local part = Instance.new("Part")

part.Destroy(part)   -- ❌ passes self twice, runtime error
part:Destroy()       -- ✅ idiomatic
```

---

## 3 · Forgetting `local` inside loops

```lua
for i = 1, 3 do
    counter = (counter or 0) + 1   -- ❌ leaks global ‘counter’
end

-- fix
local counter = 0
for _ = 1, 3 do
    counter += 1
end
```

---

## 4 · Shadowing built-ins

```lua
local table = {}          -- ❌ now you can’t use the real table library
print(table.concat)       -- runtime error
```

_Pick another name or prefix like `tbl_`.\_

---

## 5 · `==` vs `=` in conditionals

```lua
if value = 5 then   -- ❌ assignment, not comparison
    …
end

if value == 5 then  -- ✅ compare
    …
end
```

---

## 6 · `and` / `or` precedence surprises

```lua
local flag = true
local txt  = flag and "yes" or "no"   -- ✅ idiom

-- Parenthesise when mixing
result = a and (b or c)               -- clearer
```

---

## 7 · Numeric `for` loop boundaries are _inclusive_

```lua
for i = 1, 3 do print(i) end  --> 1 2 3
```

Use `for i = 1, n - 1` when you truly want “less than n”.

---

## 8 · Indexing `nil`

```lua
local t
print(t.x)        -- ❌ error: attempt to index nil

-- guard
if t and t.x then … end
```

---

## 9 · Colon-method vs dot-function definitions

```lua
local M = {}

function M:foo()           -- implicit self
    print(self.value)
end

function M.bar(self)       -- explicit self
    print(self.value)
end
```

Call with `obj:foo()` or `obj.bar(obj)` respectively.

---

## 10 · Top-level `WaitForChild`

Blocking waits in module top-level code can deadlock:

```lua
-- BAD inside ModuleScript
local folder = game:GetService("ReplicatedStorage"):WaitForChild("Data")

-- move into init or get-on-demand function instead
```
