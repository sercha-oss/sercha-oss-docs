---
title: "SQRT"
description: "The square root of a number."
---

# SQRT

[Functions › Number](../functions.md#number)

Returns the square root of a number.

## Syntax

```text
SQRT( <number> )
```

## Arguments

| Argument | Description |
|---|---|
| `<number>` | A number zero or greater, or text that reads as one. |

## Returns

Always a float. NULL when `<number>` is NULL. A negative number fails the query with "cannot take square root of a negative number"; so does text that does not read as a number.

## Usage notes

- On a number column the engine runs it in the data store, where a negative number fails the query the same way; on text it runs after the rows are read.
- Guard values that may be negative with `CASE` or `ABS`: `SQRT(ABS(x))`.

## Examples

A standard deviation from sums, since `stddev` is not available:

```sql
SELECT o.region,
       SQRT(SUM(o.total * o.total) / COUNT(o.total)
            - (SUM(o.total) / COUNT(o.total)) * (SUM(o.total) / COUNT(o.total))) AS stddev_total
FROM Order o
GROUP BY o.region
```

| region | stddev_total |
|---|---|
| north | 112.4 |
| south | 87.9 |

## See also

[POWER](../functions/power.md) · [ABS](../functions/abs.md)
