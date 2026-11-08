---
title: "ROUND"
description: "A number rounded to a number of decimal places."
---

# ROUND

[Functions › Number](../functions.md#number)

Rounds a number to the nearest whole number, or to a number of decimal places.

## Syntax

```text
ROUND( <number> [, <places> ] )
```

## Arguments

| Argument | Description |
|---|---|
| `<number>` | A number, or text that reads as a number. |
| `<places>` | Optional. How many decimal places to keep. Defaults to 0. A negative value rounds to the left of the decimal point: `-2` rounds to the nearest hundred. Must be a whole number. |

## Returns

`ROUND(<integer>)` returns the integer unchanged. Every other form returns a float, including `ROUND(<integer>, <places>)`. NULL when any argument is NULL.

## Usage notes

- A value exactly half way rounds away from zero: `ROUND(2.5)` is `3` and `ROUND(-2.5)` is `-3`. This differs from `CAST(x AS integer)`, which rounds half to even (`2.5` becomes `2`).
- To get an integer, wrap the result: `CAST(ROUND(x) AS integer)`.
- The arithmetic is binary floating point, so a decimal that cannot be held exactly can land on the lower side: `ROUND(1.005, 2)` is `1`.
- Text that does not read as a number, or a `<places>` that is not a whole number, fails the query.
- Runs after the rows are read; it is not pushed to the data store.

## Examples

```sql
SELECT p.key, p.price,
       ROUND(p.price)      AS whole,
       ROUND(p.price, 1)   AS one_place,
       ROUND(p.price, -1)  AS nearest_ten
FROM Product p
```

| key | price | whole | one_place | nearest_ten |
|---|---|---|---|---|
| P-1 | 12.45 | 12 | 12.5 | 10 |
| P-2 | 7.5 | 8 | 7.5 | 10 |
| P-3 | 104.98 | 105 | 105 | 100 |

The average order value per customer to two places:

```sql
SELECT o.customer, ROUND(AVG(o.total), 2) AS avg_total
FROM Order o
GROUP BY o.customer
```

| customer | avg_total |
|---|---|
| C-01 | 412.33 |
| C-02 | 98.5 |

## See also

[TRUNC](../functions/trunc.md) · [CEIL](../functions/ceil.md) · [FLOOR](../functions/floor.md) · [CAST](../clauses/cast.md)
