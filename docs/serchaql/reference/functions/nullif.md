---
title: "NULLIF"
description: "NULL when two values are equal, otherwise the first value."
---

# NULLIF

[Functions › Conditional](../functions.md#conditional)

Returns NULL when its two arguments are equal, and the first argument otherwise.

## Syntax

```text
NULLIF( <value>, <compare_to> )
```

## Arguments

| Argument | Description |
|---|---|
| `<value>` | The value to return. |
| `<compare_to>` | The value that turns `<value>` into NULL. |

## Returns

The type of `<value>`. NULL when `<value>` is NULL or equals `<compare_to>`. When `<compare_to>` is NULL nothing is equal to it, so `<value>` comes back.

## Usage notes

- The comparison follows the `=` rules: a number and text that reads as that number are equal.
- The common use is guarding a division: `a / NULLIF(b, 0)` gives NULL instead of failing on zero.
- On large tables the engine runs it in the data store when both arguments have the same type; otherwise it runs after the rows are read.

## Examples

Average order value, NULL for a customer with no orders instead of a division error:

```sql
SELECT c.key, c.revenue / NULLIF(c.order_count, 0) AS avg_order
FROM Customer c
```

| key | avg_order |
|---|---|
| C-01 | 250 |
| C-02 | NULL |

Treat a placeholder as missing:

```sql
SELECT t.key, COALESCE(NULLIF(t.assignee, 'unassigned'), 'triage') AS owner
FROM Ticket t
```

| key | owner |
|---|---|
| T-1 | sam |
| T-2 | triage |

## See also

[COALESCE](../functions/coalesce.md) · [CASE](../clauses/case.md) · [IS NULL](../clauses/is-null.md)
