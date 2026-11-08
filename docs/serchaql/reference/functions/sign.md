---
title: "SIGN"
description: "-1, 0 or 1 by the sign of a number."
---

# SIGN

[Functions › Number](../functions.md#number)

Returns -1 for a negative number, 0 for zero and 1 for a positive number.

## Syntax

```text
SIGN( <number> )
```

## Arguments

| Argument | Description |
|---|---|
| `<number>` | A number, or text that reads as a number. |

## Returns

An integer for an integer argument; otherwise a float (`-1.0`, `0.0` or `1.0`). NULL when `<number>` is NULL. Text that does not read as a number fails the query.

## Usage notes

- Runs after the rows are read; it is not pushed to the data store.

## Examples

Count stock movements in and out:

```sql
SELECT SIGN(m.quantity) AS direction, COUNT(*) AS movements
FROM data.stock_movements m
GROUP BY SIGN(m.quantity)
```

| direction | movements |
|---|---|
| -1 | 212 |
| 0 | 3 |
| 1 | 187 |

## See also

[ABS](../functions/abs.md) · [CASE](../clauses/case.md)
