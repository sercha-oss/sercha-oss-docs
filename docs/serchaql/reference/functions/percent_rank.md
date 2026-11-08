---
title: "PERCENT_RANK"
description: "The relative rank of each row in its partition, from 0 to 1."
---

# PERCENT_RANK

[Functions › Window › Ranking](../functions.md#window)

Returns `(rank - 1) / (rows in partition - 1)`: 0 for the first row, 1 for the last, with tied rows sharing a value.

## Syntax

```text
PERCENT_RANK() OVER (
  [ PARTITION BY <expression> [, ...] ]
  ORDER BY <expression> [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] )
```

## Returns

A number with decimals (float) from 0 to 1. `0` when the partition has one row.

## Usage notes

- The rank is the one [RANK](../functions/rank.md) gives, so ties share a value and leave a gap after them.
- Without `ORDER BY` every row ties, so every row gets `0`.
- A frame clause is accepted and has no effect.
- `PERCENT_RANK` runs after the rows are read, not in the data store.

## Examples

```sql
SELECT o.key, o.amount,
       PERCENT_RANK() OVER (ORDER BY o.amount) AS pct_rank,
       CUME_DIST() OVER (ORDER BY o.amount) AS cume
FROM Order o
```

| key | amount | pct_rank | cume |
|---|---|---|---|
| O-9 | 40 | 0.0 | 0.2 |
| O-11 | 80 | 0.25 | 0.4 |
| O-10 | 100 | 0.5 | 0.8 |
| O-12 | 100 | 0.5 | 0.8 |
| O-14 | 250 | 1.0 | 1.0 |

As a percentage inside an expression:

```sql
SELECT o.key, ROUND(100 * PERCENT_RANK() OVER (ORDER BY o.amount), 1) AS percentile FROM Order o
```

## Not supported

| Refused | Write instead |
|---|---|
| `percentile_cont(...) WITHIN GROUP (ORDER BY x)` | `PERCENT_RANK()` in a derived table, or `ORDER BY` with `LIMIT`/`OFFSET` to read the row |

```sql
-- Refused by the engine
SELECT PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY o.amount) AS p90 FROM Order o
```

## See also

[CUME_DIST](../functions/cume_dist.md) · [RANK](../functions/rank.md) · [NTILE](../functions/ntile.md) · [OVER](../clauses/over.md)
