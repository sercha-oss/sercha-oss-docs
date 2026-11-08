---
title: SQL reference
---

# SQL reference

A page for every SerchaQL command, clause and function, in the order you would read them.

- [Query syntax](query-syntax.md): The parts of a query, in the order you write them.
- [Operators and expressions](operators-and-expressions.md): Comparisons, conditions, CASE, CAST and comments.
- [Functions](functions.md): Functions grouped by what they work on.
- [Commands](commands.md): Statements that define, change and inspect what Sercha holds, grouped by the object they act on. Most need an admin.

## How to read a page

Each page has the same parts, in this order: what it does, **Syntax**, **Parameters** or **Arguments**, **Returns** (functions), **Usage notes**, **Examples**, **Not supported** (forms the engine refuses, with what to write instead) and **See also**.

Syntax uses this notation:

| Notation | Means |
|---|---|
| `KEYWORD` | Write it as shown. Case does not matter. |
| `<name>` | A value you supply. |
| `[ ... ]` | Optional. |
| `{ a \| b }` | Choose one. |
| `...` | The previous item can repeat. |
