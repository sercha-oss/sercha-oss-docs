---
title: "GREATEST"
description: "The largest of its arguments, ignoring NULLs."
---

# GREATEST

[Functions › Conditional](../functions.md#conditional)

Returns the largest of its arguments. Unlike [MAX](../functions/max.md), which works across rows, `GREATEST` compares values within one row.

## Syntax

```text
GREATEST( <expr> [, <expr> ...] )
```

## Arguments

| Argument | Description |
|---|---|
| `<expr>` | One or more values to compare. |

## Returns

The largest argument that is not NULL. NULL only when every argument is NULL. The result type joins the argument types: integers and floats give a float; any other mix gives text.

## Usage notes

- NULL arguments are skipped, as in Postgres: `GREATEST(1, NULL, 3)` is `3`.
- Numbers compare as numbers, dates and timestamps in time order, and text by character code. Text that reads as a number compares as a number against a number. A value that cannot be compared with the current largest, such as text that is not a number against a number, is skipped.
- Runs after the rows are read; it is not pushed to the data store.

## Examples

The latest activity on each ticket:

```sql
SELECT t.key, GREATEST(t.updated_at, t.last_comment_at, t.closed_at) AS last_activity
FROM Ticket t
```

| key | last_activity |
|---|---|
| T-1 | 2026-10-04 09:12:00.000 |
| T-2 | 2026-09-30 16:40:00.000 |

A floor on a computed value:

```sql
SELECT o.key, GREATEST(o.total - o.discount, 0) AS charged
FROM Order o
```

| key | charged |
|---|---|
| O-100 | 120 |
| O-101 | 0 |

## See also

[LEAST](../functions/least.md) · [MAX](../functions/max.md) · [COALESCE](../functions/coalesce.md)
