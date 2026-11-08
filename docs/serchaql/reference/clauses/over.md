---
title: "OVER"
description: "The window a window function reads: its partition, order and frame."
---

# OVER

[Query syntax](../query-syntax.md)

Turns a function into a window function. The function reads a set of rows related to the current row (its window) and returns one value per row, without collapsing rows the way `GROUP BY` does.

## Syntax

```text
SELECT ...,
       <function>( [ <args> ] ) OVER (
         [ PARTITION BY <expression> [, ...] ]
         [ ORDER BY <expression> [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] ]
         [ <frame> ]
       ) [ AS <alias> ]
FROM <source> [ <alias> ]
[ WHERE ... ]
[ ORDER BY ... ]

<frame> ::= { ROWS | RANGE } { <start> | BETWEEN <start> AND <end> }
<start>, <end> ::= UNBOUNDED PRECEDING | <n> PRECEDING | CURRENT ROW | <n> FOLLOWING | UNBOUNDED FOLLOWING
```

## Parameters

| Parameter | Description |
|---|---|
| `<function>` | A window-only function (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `PERCENT_RANK`, `CUME_DIST`, `NTILE`, `LAG`, `LEAD`, `FIRST_VALUE`, `LAST_VALUE`, `NTH_VALUE`) or one of the aggregates `SUM`, `AVG`, `COUNT`, `MIN`, `MAX`. |
| `PARTITION BY` | Splits the rows into groups; the function restarts in each. Without it, all rows are one partition. |
| `ORDER BY` | Orders the rows inside each partition. Rows with equal keys are peers. |
| `ROWS` | A frame counted in rows: `ROWS BETWEEN 6 PRECEDING AND CURRENT ROW` is the current row and the six before it. `<n>` is an integer literal. |
| `RANGE` | A frame counted in `ORDER BY` values, with peers included. Only `UNBOUNDED` and `CURRENT ROW` bounds. |
| `<start>` alone | The frame runs from `<start>` to `CURRENT ROW`. |

## Usage notes

- The frame matters for the aggregates, `FIRST_VALUE`, `LAST_VALUE` and `NTH_VALUE`. Without a frame clause, a window with `ORDER BY` reads from the start of the partition to the current row and its peers (a running total); a window without `ORDER BY` reads the whole partition.
- So `LAST_VALUE(x) OVER (ORDER BY y)` returns the current row's value (or its last peer's). Write `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` to read the partition's last value.
- Inside a window's `ORDER BY`, NULL sorts after every value ascending and before every value descending, unless `NULLS FIRST` or `NULLS LAST` says otherwise. This differs from the query's own `ORDER BY`.
- A window function can sit inside an expression: `o.amount - LAG(o.amount) OVER (ORDER BY o.placed_at)`.
- Window functions are computed after `WHERE`. To filter on one, compute it in a derived table and filter outside.
- A window function cannot share a SELECT with `GROUP BY` or aggregates. Aggregate in a derived table, then apply the window over it.

## Examples

Rank orders within each customer:

```sql
SELECT o.customer, o.key, o.amount,
       RANK() OVER (PARTITION BY o.customer ORDER BY o.amount DESC) AS rank_in_customer
FROM Order o
```

| customer | key | amount | rank_in_customer |
|---|---|---|---|
| acme | PO-1017 | 4500 | 1 |
| acme | PO-1001 | 1200 | 2 |
| globex | PO-1009 | 800 | 1 |

A running total, a seven-row moving sum and the change from the previous row:

```sql
SELECT o.key, o.placed_at,
       SUM(o.amount) OVER (ORDER BY o.placed_at) AS running_total,
       SUM(o.amount) OVER (ORDER BY o.placed_at ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS last_seven,
       o.amount - LAG(o.amount, 1, 0) OVER (ORDER BY o.placed_at) AS change
FROM Order o
```

A window over aggregated rows, and a filter on a window value:

```sql
SELECT m.month, m.total, SUM(m.total) OVER (ORDER BY m.month) AS cumulative
FROM (SELECT date_trunc('month', o.placed_at) AS month, SUM(o.amount) AS total FROM Order o GROUP BY 1) m
```

```sql
SELECT r.customer, r.key
FROM (
  SELECT o.customer AS customer, o.key AS key,
         ROW_NUMBER() OVER (PARTITION BY o.customer ORDER BY o.placed_at DESC) AS rn
  FROM Order o
) r
WHERE r.rn <= 3
```

## Not supported

| Refused | Write instead |
|---|---|
| A named window: `WINDOW w AS (...)`, `OVER w` | Write the window inline in each `OVER (...)` |
| `GROUPS` frames | `ROWS`, or the default frame to include peers |
| `RANGE` with an offset: `RANGE BETWEEN 7 PRECEDING ...` | `ROWS BETWEEN n PRECEDING AND CURRENT ROW` |
| `EXCLUDE` in a frame | Subtract the current row's value outside |
| `IGNORE NULLS` | Filter NULL rows in a derived table first |
| A window function with `GROUP BY` in the same SELECT | Aggregate in a derived table, window outside |
| A window function in `WHERE` | Compute it in a derived table, filter outside |
| `COUNT(DISTINCT x) OVER (...)`, `ARRAY_AGG(x) OVER (...)` | Group in a derived table and join it back |

```sql
-- Refused by the engine
SELECT o.key, SUM(o.amount) OVER w AS s FROM Order o WINDOW w AS (ORDER BY o.placed_at)
```

```sql
-- Refused by the engine
SELECT o.key, SUM(o.amount) OVER (ORDER BY o.amount RANGE BETWEEN 100 PRECEDING AND CURRENT ROW) AS s FROM Order o
```

```sql
-- Refused by the engine
SELECT o.key, SUM(o.amount) OVER (ORDER BY o.placed_at GROUPS BETWEEN 1 PRECEDING AND CURRENT ROW) AS s FROM Order o
```

```sql
-- Refused by the engine
SELECT o.customer, SUM(o.amount) AS total, RANK() OVER (ORDER BY SUM(o.amount) DESC) AS r FROM Order o GROUP BY o.customer
```

```sql
-- Refused by the engine
SELECT o.key, LAG(o.amount) IGNORE NULLS OVER (ORDER BY o.placed_at) AS prev FROM Order o
```

## See also

[ROW_NUMBER](../functions/row_number.md) · [RANK](../functions/rank.md) · [LAG](../functions/lag.md) · [LEAD](../functions/lead.md) · [SUM](../functions/sum.md) · [FIRST_VALUE](../functions/first_value.md) · [LAST_VALUE](../functions/last_value.md) · [ORDER BY](../clauses/order-by.md)
