---
title: "CUME_DIST"
description: "The share of rows in the partition that sort at or before each row."
---

# CUME_DIST

[Functions › Window › Ranking](../functions.md#window)

Returns the number of rows that sort before the current row or tie with it, divided by the number of rows in the partition.

## Syntax

```text
CUME_DIST() OVER (
  [ PARTITION BY <expression> [, ...] ]
  ORDER BY <expression> [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] )
```

## Returns

A number with decimals (float) greater than 0 and at most 1. The last row, and every row tied with it, gets `1`.

## Usage notes

- Tied rows share a value: the share up to the last of them.
- Without `ORDER BY` every row ties, so every row gets `1`.
- A frame clause is accepted and has no effect.
- `CUME_DIST` runs after the rows are read, not in the data store.

## Examples

Orders in the top fifth of amounts per customer:

```sql
SELECT r.customer, r.key, r.amount
FROM (
  SELECT o.customer AS customer, o.key AS key, o.amount AS amount,
         CUME_DIST() OVER (PARTITION BY o.customer ORDER BY o.amount) AS cd
  FROM Order o
) r
WHERE r.cd > 0.8
```

| customer | key | amount |
|---|---|---|
| C-1 | O-14 | 250 |
| C-2 | O-11 | 80 |

## Not supported

| Refused | Write instead |
|---|---|
| `CUME_DIST()` in `WHERE` | Compute it in a derived table and filter outside |

```sql
-- Refused by the engine
SELECT o.key FROM Order o WHERE CUME_DIST() OVER (ORDER BY o.amount) > 0.8
```

## See also

[PERCENT_RANK](../functions/percent_rank.md) · [NTILE](../functions/ntile.md) · [RANK](../functions/rank.md) · [OVER](../clauses/over.md)
