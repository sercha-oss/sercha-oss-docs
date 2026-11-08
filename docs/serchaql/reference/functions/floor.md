---
title: "FLOOR"
description: "The largest whole number not greater than a number."
---

# FLOOR

[Functions › Number](../functions.md#number)

Rounds a number down to the whole number below it.

## Syntax

```text
FLOOR( <number> )
```

## Arguments

| Argument | Description |
|---|---|
| `<number>` | A number, or text that reads as a number. |

## Returns

An integer argument comes back unchanged, as an integer. Any other argument returns a float with no fraction (`3.0`). NULL when `<number>` is NULL. Text that does not read as a number fails the query.

## Usage notes

- Down means toward negative infinity: `FLOOR(-3.2)` is `-4`. Use [TRUNC](../functions/trunc.md) to move toward zero.
- Runs after the rows are read; it is not pushed to the data store.

## Examples

Group orders into price bands of 100:

```sql
SELECT FLOOR(o.total / 100) * 100 AS band, COUNT(*) AS orders
FROM Order o
GROUP BY FLOOR(o.total / 100) * 100
ORDER BY band
```

| band | orders |
|---|---|
| 0 | 34 |
| 100 | 21 |
| 200 | 9 |

## See also

[CEIL](../functions/ceil.md) · [TRUNC](../functions/trunc.md) · [ROUND](../functions/round.md)
