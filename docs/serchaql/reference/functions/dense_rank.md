---
title: "DENSE_RANK"
description: "The rank of each row in its partition, with no gaps after ties."
---

# DENSE_RANK

[Functions › Window › Ranking](../functions.md#window)

Ranks the rows of each partition in the window's order. Tied rows share a rank, and the next rank follows on without a gap: 1, 2, 2, 3.

## Syntax

```text
DENSE_RANK() OVER (
  [ PARTITION BY <expression> [, ...] ]
  ORDER BY <expression> [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] )
```

## Returns

An integer, starting at 1 in each partition. The largest value is the number of distinct `ORDER BY` values in the partition.

## Usage notes

- Rows tie when every window `ORDER BY` value is equal. NULLs tie with each other.
- Without `ORDER BY` every row is ranked 1.
- A frame clause is accepted and has no effect.
- On large tables it runs in the data store when the rest of the query does.

## Examples

The orders in each customer's two largest amounts, ties included:

```sql
SELECT r.customer, r.key, r.amount
FROM (
  SELECT o.customer AS customer, o.key AS key, o.amount AS amount,
         DENSE_RANK() OVER (PARTITION BY o.customer ORDER BY o.amount DESC) AS dr
  FROM Order o
) r
WHERE r.dr <= 2
```

| customer | key | amount |
|---|---|---|
| C-1 | O-14 | 250 |
| C-1 | O-10 | 100 |
| C-1 | O-12 | 100 |

## Not supported

| Refused | Write instead |
|---|---|
| `DENSE_RANK()` in `WHERE` | Compute it in a derived table and filter outside |

```sql
-- Refused by the engine
SELECT o.key FROM Order o WHERE DENSE_RANK() OVER (ORDER BY o.amount DESC) <= 2
```

## See also

[RANK](../functions/rank.md) · [ROW_NUMBER](../functions/row_number.md) · [NTILE](../functions/ntile.md) · [OVER](../clauses/over.md)
