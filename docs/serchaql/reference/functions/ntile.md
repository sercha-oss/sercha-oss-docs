---
title: "NTILE"
description: "Splits each partition into a number of buckets of near-equal size."
---

# NTILE

[Functions › Window › Ranking](../functions.md#window)

Deals the rows of each partition, in the window's order, into `<buckets>` groups numbered from 1, and returns each row's group.

## Syntax

```text
NTILE( <buckets> ) OVER (
  [ PARTITION BY <expression> [, ...] ]
  [ ORDER BY <expression> [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] ] )
```

## Arguments

| Argument | Description |
|---|---|
| `<buckets>` | How many groups. A positive integer literal. |

## Returns

An integer from 1 to `<buckets>`.

## Usage notes

- When the rows do not divide evenly, the first groups get one row more. Ten rows in `NTILE(4)` give groups of 3, 3, 2 and 2.
- With more buckets than rows, each row gets its own bucket: 1, 2, 3 and so on.
- Ties are not kept together: tied rows can land in different buckets.
- A frame clause is accepted and has no effect.
- `NTILE` runs after the rows are read, not in the data store.

## Examples

Quartiles of order amount:

```sql
SELECT o.key, o.amount, NTILE(4) OVER (ORDER BY o.amount DESC) AS quartile
FROM Order o
```

| key | amount | quartile |
|---|---|---|
| O-14 | 250 | 1 |
| O-10 | 100 | 1 |
| O-11 | 80 | 2 |
| O-9 | 40 | 2 |
| O-7 | 25 | 3 |
| O-8 | 10 | 4 |

## Not supported

| Refused | Write instead |
|---|---|
| A column or expression as `<buckets>` | An integer literal |
| `NTILE(0)` | A positive number of buckets |

```sql
-- Refused by the engine
SELECT o.key, NTILE(o.buckets) OVER (ORDER BY o.amount) AS b FROM Order o
```

```sql
-- Refused by the engine
SELECT o.key, NTILE(0) OVER (ORDER BY o.amount) AS b FROM Order o
```

## See also

[PERCENT_RANK](../functions/percent_rank.md) · [CUME_DIST](../functions/cume_dist.md) · [ROW_NUMBER](../functions/row_number.md) · [OVER](../clauses/over.md)
