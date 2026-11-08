---
title: "MAX"
description: "The largest non-NULL value in a group."
---

# MAX

[Functions › Aggregate](../functions.md#aggregate)

Returns the largest non-NULL value of an expression over each group. Works on numbers, text and dates.

## Syntax

```text
MAX( [ ALL ] <expression> )
```

## Arguments

| Argument | Description |
|---|---|
| `<expression>` | A column or an expression of any comparable type. |

## Returns

The same type as `<expression>`. NULL when the group has no non-NULL value.

## Usage notes

- NULLs are skipped. An empty text value is treated as NULL.
- Text compares character by character, so `'a'` sorts after `'B'` and `'9'` after `'10'`.
- To compare values within one row, use [GREATEST](../functions/greatest.md) instead.
- `MAX(CASE WHEN <condition> THEN 1 ELSE 0 END) = 1` tests whether any row of the group meets a condition.
- Also a window function with `OVER (...)`. See [OVER](../clauses/over.md).
- On large tables `MAX` runs in the data store.

## Examples

The latest update per ticket status, and whether any ticket in it is high priority:

```sql
SELECT t.status,
       MAX(t.updated_at) AS last_update,
       MAX(CASE WHEN t.priority = 'high' THEN 1 ELSE 0 END) = 1 AS any_high
FROM Ticket t
GROUP BY t.status
```

| status | last_update | any_high |
|---|---|---|
| open | 2026-11-07 | true |
| resolved | 2026-11-06 | false |

The largest order of each customer next to every order:

```sql
SELECT o.key, o.customer, o.amount,
       MAX(o.amount) OVER (PARTITION BY o.customer) AS customer_max
FROM Order o
```

| key | customer | amount | customer_max |
|---|---|---|---|
| O-10 | C-1 | 100 | 250 |
| O-14 | C-1 | 250 | 250 |
| O-11 | C-2 | 80 | 80 |

## Not supported

| Refused | Write instead |
|---|---|
| `bool_or(cond)` | `MAX(CASE WHEN cond THEN 1 ELSE 0 END) = 1` |

```sql
-- Refused by the engine
SELECT t.status, BOOL_OR(t.priority = 'high') AS any_high FROM Ticket t GROUP BY t.status
```

## See also

[MIN](../functions/min.md) · [COUNT](../functions/count.md) · [GREATEST](../functions/greatest.md) · [GROUP BY](../clauses/group-by.md) · [OVER](../clauses/over.md)
