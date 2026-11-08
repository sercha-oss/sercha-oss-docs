---
title: "POSITION"
description: "The position of a substring in a string, standard form."
---

# POSITION

[Functions › Text › Find](../functions.md#text)

Returns the position of the first occurrence of a substring, counting from 1, or 0 when it is not found. The standard SQL spelling of [STRPOS](../functions/strpos.md).

## Syntax

```text
POSITION( <substring> IN <string> )
```

## Arguments

| Argument | Description |
|---|---|
| `<substring>` | The text to find. Matched exactly, with case. |
| `<string>` | The text to search. |

## Returns

An integer: the character position of the first match, or 0 when there is none. NULL when either argument is NULL.

## Usage notes

- The engine reads it as `STRPOS(<string>, <substring>)`, so the two behave the same, including where they run.
- Each side of `IN` is a value expression: a column, a literal, a function call or arithmetic, and `||` joins. It cannot hold a comparison.
- Only the `IN` form is accepted. With a comma, write `STRPOS(<string>, <substring>)`, and note the order is reversed.

## Examples

```sql
SELECT c.email, POSITION('@' IN c.email) AS at_sign FROM Customer c
```

| email | at_sign |
|---|---|
| ana.ruiz@example.com | 9 |
| j.smith@example.com | 8 |

```sql
SELECT t.key FROM Ticket t WHERE POSITION('refund' IN LOWER(t.title)) > 0
```

| key |
|---|
| T-41 |

## Not supported

| Refused | Write instead |
|---|---|
| `POSITION(<substring>, <string>)` | `STRPOS(<string>, <substring>)` or `POSITION(<substring> IN <string>)` |

```sql
-- Refused by the engine
SELECT POSITION('@', c.email) FROM Customer c
```

## See also

[STRPOS](../functions/strpos.md) · [SUBSTRING](../functions/substring.md) · [SPLIT_PART](../functions/split_part.md)
