---
title: "ROW_NUMBER"
description: "The position of each row in its partition, counting from 1."
---

# ROW_NUMBER

[Functions › Window › Ranking](../functions.md#window)

Numbers the rows of each partition 1, 2, 3 and so on, in the window's order. Tied rows still get different numbers.

## Syntax

```text
ROW_NUMBER() OVER (
  [ PARTITION BY <expression> [, ...] ]
  [ ORDER BY <expression> [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] ] )
```

## Returns

An integer, starting at 1 in each partition.

## Usage notes

- Rows that tie on the window's `ORDER BY` are numbered in the order they were read, which the query does not fix. Add a unique column to the `ORDER BY` for a stable result.
- Without `ORDER BY` the rows are numbered in the order they were read.
- To keep one row per group (the latest, the largest), compute `ROW_NUMBER()` in a derived table and filter `rn = 1` outside. This replaces `DISTINCT ON`.
- A frame clause is accepted and has no effect.
- A window function goes in the `SELECT` list or `ORDER BY`, also inside a larger expression. It cannot share a `SELECT` with `GROUP BY` or an aggregate: aggregate in a derived table first.
- On large tables it runs in the data store when the rest of the query does.

## Examples

The latest order of each customer:

```sql
SELECT r.customer, r.key, r.placed_at
FROM (
  SELECT o.customer AS customer, o.key AS key, o.placed_at AS placed_at,
         ROW_NUMBER() OVER (PARTITION BY o.customer ORDER BY o.placed_at DESC, o.key) AS rn
  FROM Order o
) r
WHERE r.rn = 1
```

| customer | key | placed_at |
|---|---|---|
| C-1 | O-14 | 2026-10-12 |
| C-2 | O-11 | 2026-03-18 |

Number the rows of a result:

```sql
SELECT ROW_NUMBER() OVER (ORDER BY o.amount DESC) AS position, o.key, o.amount
FROM Order o
```

| position | key | amount |
|---|---|---|
| 1 | O-14 | 250 |
| 2 | O-10 | 100 |
| 3 | O-11 | 80 |

## Not supported

| Refused | Write instead |
|---|---|
| `ROW_NUMBER()` in `WHERE`, or `QUALIFY` | Compute it in a derived table and filter outside |
| `ROW_NUMBER()` without `OVER` | Add `OVER (...)` |
| A named window: `OVER w ... WINDOW w AS (...)` | Write the window inline |

```sql
-- Refused by the engine
SELECT o.key FROM Order o WHERE ROW_NUMBER() OVER (ORDER BY o.amount DESC) = 1
```

```sql
-- Refused by the engine
SELECT o.key, ROW_NUMBER() AS rn FROM Order o
```

```sql
-- Refused by the engine
SELECT o.key, ROW_NUMBER() OVER w AS rn FROM Order o WINDOW w AS (ORDER BY o.amount)
```

## See also

[RANK](../functions/rank.md) · [DENSE_RANK](../functions/dense_rank.md) · [NTILE](../functions/ntile.md) · [OVER](../clauses/over.md) · [SELECT](../commands/select.md)
