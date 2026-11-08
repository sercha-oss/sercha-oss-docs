---
title: "Comments"
description: "Text in a statement that the engine ignores."
---

# Comments

[Operators and expressions](../operators-and-expressions.md)

Notes inside a statement. The engine skips them.

## Syntax

```text
-- <text to the end of the line>

/* <text, over any number of lines> */
```

## Usage notes

- A line comment starts at `--` and runs to the end of the line.
- A block comment runs from `/*` to the matching `*/`. Block comments nest, as in PostgreSQL: `/* a /* b */ c */` is one comment.
- An unterminated block comment is an error.
- `--` and `/*` inside a quoted string are part of the string, not a comment.
- A comment can go anywhere whitespace can, including inside the body of a view, a materialized view or a tool.
- To describe a view, a column or a tool for the people and agents who read it, use [COMMENT ON](../commands/comment-on.md): a comment in the text is not shown to them.

## Examples

```sql
-- Open orders over a threshold
SELECT o.key, o.amount   -- amount is in dollars
FROM Order o
WHERE o.status = 'open'
  /* held orders are left out on purpose:
     they are reviewed elsewhere */
  AND o.amount > 1000
```

A dash pair inside a string is text:

```sql
SELECT t.name FROM tables.drive.file t WHERE t.name LIKE '%--draft%'
```

## Not supported

| Refused | Write instead |
|---|---|
| An unterminated block comment | Close it with `*/` |
| `#` line comments | `--` |

```sql
-- Refused by the engine
SELECT o.key FROM Order o /* never closed
```

```sql
-- Refused by the engine
SELECT o.key FROM Order o # a note
```

## See also

[SELECT](../commands/select.md) · [COMMENT ON](../commands/comment-on.md)
