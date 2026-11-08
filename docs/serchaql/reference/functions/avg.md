---
title: "AVG"
description: "The mean of the non-NULL values in a group."
---

# AVG

[Functions › Aggregate](../functions.md#aggregate)

Returns the average of the non-NULL values of an expression over each group.

## Syntax

```text
AVG( [ ALL ] <expression> )
```

## Arguments

| Argument | Description |
|---|---|
| `<expression>` | A number column or a number expression. |

## Returns

A number with decimals (float). NULL when the group has no non-NULL value.

## Usage notes

- NULLs are skipped: they count in neither the total nor the divisor. To count them as zero, write `AVG(COALESCE(x, 0))`.
- `AVG` reads numbers. A value that is not a number counts as `0`, so cast text first: `AVG(CAST(x AS numeric))`.
- `AVG(x)` equals `SUM(x) / COUNT(x)`.
- Also a window function with `OVER (...)`, for moving averages. See [OVER](../clauses/over.md).
- On large tables `AVG` over a number column runs in the data store.

## Examples

```sql
SELECT o.status, AVG(o.amount) AS average, ROUND(AVG(o.amount), 2) AS rounded
FROM Order o
GROUP BY o.status
```

| status | average | rounded |
|---|---|---|
| open | 412.3333 | 412.33 |
| closed | 198.5 | 198.5 |

A moving average over each order and the two before it:

```sql
SELECT o.key, o.amount,
       AVG(o.amount) OVER (ORDER BY o.placed_at ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg
FROM Order o
```

| key | amount | moving_avg |
|---|---|---|
| O-1 | 90 | 90.0 |
| O-2 | 30 | 60.0 |
| O-3 | 60 | 60.0 |
| O-4 | 120 | 70.0 |

Average over distinct values, written with a derived table:

```sql
SELECT d.status, AVG(d.amount) AS avg_distinct_amount
FROM (SELECT DISTINCT o.status AS status, o.amount AS amount FROM Order o) d
GROUP BY d.status
```

## Not supported

| Refused | Write instead |
|---|---|
| `AVG(DISTINCT x)` | `AVG(x)` over a derived table of `SELECT DISTINCT` values |
| `median`, `percentile_cont`, `stddev`, `variance` | `ORDER BY` with `LIMIT`/`OFFSET` for a percentile row; `stddev` from `SUM(x)`, `SUM(x * x)` and `COUNT(x)` |

```sql
-- Refused by the engine
SELECT o.status, AVG(DISTINCT o.amount) AS a FROM Order o GROUP BY o.status
```

```sql
-- Refused by the engine
SELECT o.status, MEDIAN(o.amount) AS m FROM Order o GROUP BY o.status
```

## See also

[SUM](../functions/sum.md) · [COUNT](../functions/count.md) · [MIN](../functions/min.md) · [MAX](../functions/max.md) · [GROUP BY](../clauses/group-by.md) · [OVER](../clauses/over.md)
