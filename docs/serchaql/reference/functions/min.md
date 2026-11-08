---
title: "MIN"
description: "The smallest non-NULL value in a group."
---

# MIN

[Functions › Aggregate](../functions.md#aggregate)

Returns the smallest non-NULL value of an expression over each group. Works on numbers, text and dates.

## Syntax

```text
MIN( [ ALL ] <expression> )
```

## Arguments

| Argument | Description |
|---|---|
| `<expression>` | A column or an expression of any comparable type. |

## Returns

The same type as `<expression>`. NULL when the group has no non-NULL value.

## Usage notes

- NULLs are skipped. An empty text value is treated as NULL.
- Text compares character by character, so `'B'` sorts before `'a'` and `'10'` before `'9'`.
- To compare values within one row, use [LEAST](../functions/least.md) instead.
- Also a window function with `OVER (...)`. See [OVER](../clauses/over.md).
- On large tables `MIN` runs in the data store.

## Examples

The first and last order of each customer:

```sql
SELECT o.customer, MIN(o.placed_at) AS first_order, MAX(o.placed_at) AS last_order, MIN(o.amount) AS smallest
FROM Order o
GROUP BY o.customer
```

| customer | first_order | last_order | smallest |
|---|---|---|---|
| C-1 | 2026-01-04 | 2026-10-12 | 40 |
| C-2 | 2026-03-18 | 2026-03-18 | 125 |

## Not supported

| Refused | Write instead |
|---|---|
| `MIN(MIN(x))` and other nested aggregates | Aggregate in a derived table, then aggregate again outside |

```sql
-- Refused by the engine
SELECT MIN(MAX(o.amount)) AS m FROM Order o
```

## See also

[MAX](../functions/max.md) · [COUNT](../functions/count.md) · [LEAST](../functions/least.md) · [GROUP BY](../clauses/group-by.md) · [OVER](../clauses/over.md)
