---
title: "RANK"
description: "The rank of each row in its partition, with gaps after ties."
---

# RANK

[Functions › Window › Ranking](../functions.md#window)

Ranks the rows of each partition in the window's order. Tied rows share a rank, and the next rank skips the tied positions: 1, 2, 2, 4.

## Syntax

```text
RANK() OVER (
  [ PARTITION BY <expression> [, ...] ]
  ORDER BY <expression> [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] )
```

## Returns

An integer, starting at 1 in each partition.

## Usage notes

- Rows tie when every window `ORDER BY` value is equal. NULLs tie with each other.
- Without `ORDER BY` every row ties, so every row is ranked 1.
- In the window's `ORDER BY`, NULL sorts after every value in ascending order and before every value in descending order, unless `NULLS FIRST` or `NULLS LAST` says otherwise.
- A frame clause is accepted and has no effect.
- On large tables it runs in the data store when the rest of the query does.

## Examples

Rank customers' orders by amount:

```sql
SELECT o.customer, o.key, o.amount,
       RANK() OVER (PARTITION BY o.customer ORDER BY o.amount DESC) AS rnk,
       DENSE_RANK() OVER (PARTITION BY o.customer ORDER BY o.amount DESC) AS dense
FROM Order o
```

| customer | key | amount | rnk | dense |
|---|---|---|---|---|
| C-1 | O-14 | 250 | 1 | 1 |
| C-1 | O-10 | 100 | 2 | 2 |
| C-1 | O-12 | 100 | 2 | 2 |
| C-1 | O-9 | 40 | 4 | 3 |

Rank groups by an aggregate, computed in a derived table first:

```sql
SELECT s.customer, s.total, RANK() OVER (ORDER BY s.total DESC) AS rnk
FROM (SELECT o.customer AS customer, SUM(o.amount) AS total FROM Order o GROUP BY o.customer) s
```

## Not supported

| Refused | Write instead |
|---|---|
| An aggregate in the window's `ORDER BY`, or a window and `GROUP BY` in one `SELECT` | Aggregate in a derived table, rank in the outer `SELECT` |
| `RANK(x)` with an argument | `RANK() OVER (ORDER BY x)` |

```sql
-- Refused by the engine
SELECT o.customer, RANK() OVER (ORDER BY SUM(o.amount) DESC) AS rnk FROM Order o GROUP BY o.customer
```

```sql
-- Refused by the engine
SELECT o.key, RANK(o.amount) OVER (ORDER BY o.amount) AS rnk FROM Order o
```

## See also

[DENSE_RANK](../functions/dense_rank.md) · [ROW_NUMBER](../functions/row_number.md) · [PERCENT_RANK](../functions/percent_rank.md) · [OVER](../clauses/over.md)
