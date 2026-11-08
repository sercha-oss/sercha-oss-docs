---
title: "SUM"
description: "The total of the non-NULL values in a group."
---

# SUM

[Functions › Aggregate](../functions.md#aggregate)

Adds up the non-NULL values of an expression over each group.

## Syntax

```text
SUM( [ ALL ] <expression> )
```

## Arguments

| Argument | Description |
|---|---|
| `<expression>` | A number column or a number expression, such as `o.price * o.quantity`. |

## Returns

A number with decimals (float), even when every input is an integer. NULL when the group has no non-NULL value.

## Usage notes

- NULLs are skipped. Use `COALESCE(SUM(x), 0)` to get `0` instead of NULL for an empty group.
- `SUM` reads numbers. A value that is not a number adds nothing, so cast text first: `SUM(CAST(x AS numeric))`.
- Aggregates can be combined in one expression: `SUM(o.amount) / COUNT(*)`.
- Total only the rows that meet a condition with a `CASE` inside: `SUM(CASE WHEN <condition> THEN x ELSE 0 END)`.
- Also a window function with `OVER (...)`, for running totals and totals per partition. See [OVER](../clauses/over.md).
- On large tables `SUM` over a number column runs in the data store.

## Examples

Revenue per region, and the share that is overdue:

```sql
SELECT i.region,
       SUM(i.amount) AS total,
       SUM(CASE WHEN i.status = 'overdue' THEN i.amount ELSE 0 END) / SUM(i.amount) AS overdue_share
FROM data.invoices i
GROUP BY i.region
ORDER BY total DESC
```

| region | total | overdue_share |
|---|---|---|
| North | 184200.0 | 0.12 |
| South | 96350.0 | 0.04 |

A running total per customer:

```sql
SELECT o.customer, o.key, o.amount,
       SUM(o.amount) OVER (PARTITION BY o.customer ORDER BY o.placed_at) AS running_total
FROM Order o
```

| customer | key | amount | running_total |
|---|---|---|---|
| C-1 | O-10 | 100 | 100.0 |
| C-1 | O-14 | 250 | 350.0 |
| C-2 | O-11 | 80 | 80.0 |

## Not supported

| Refused | Write instead |
|---|---|
| `SUM(DISTINCT x)` | `SUM(x)` over a derived table of `SELECT DISTINCT` values |
| `SUM(x) FILTER (WHERE ...)` | `SUM(CASE WHEN ... THEN x END)` |
| `SUM(SUM(x)) OVER (...)` | Aggregate in a derived table, then apply the window in the outer `SELECT` |

```sql
-- Refused by the engine
SELECT o.status, SUM(DISTINCT o.amount) AS total FROM Order o GROUP BY o.status
```

```sql
-- Refused by the engine
SELECT o.status, SUM(o.amount) FILTER (WHERE o.amount > 0) AS total FROM Order o GROUP BY o.status
```

```sql
-- Refused by the engine
SELECT o.customer, SUM(SUM(o.amount)) OVER () AS grand_total FROM Order o GROUP BY o.customer
```

## See also

[AVG](../functions/avg.md) · [COUNT](../functions/count.md) · [MIN](../functions/min.md) · [MAX](../functions/max.md) · [GROUP BY](../clauses/group-by.md) · [OVER](../clauses/over.md)
