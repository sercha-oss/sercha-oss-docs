---
title: "TRUNC"
description: "A number cut to a number of decimal places, toward zero."
---

# TRUNC

[Functions › Number](../functions.md#number)

Cuts a number to a whole number, or to a number of decimal places, by dropping the rest. It moves toward zero and never rounds up.

## Syntax

```text
TRUNC( <number> [, <places> ] )
```

## Arguments

| Argument | Description |
|---|---|
| `<number>` | A number, or text that reads as a number. |
| `<places>` | Optional. How many decimal places to keep. Defaults to 0. A negative value cuts to the left of the decimal point: `-2` cuts to the hundred. Must be a whole number. |

## Returns

`TRUNC(<integer>)` returns the integer unchanged. Every other form returns a float, including `TRUNC(<integer>, <places>)`. NULL when any argument is NULL.

## Usage notes

- Toward zero means a negative number moves up: `TRUNC(-3.7)` is `-3`, while `FLOOR(-3.7)` is `-4`.
- The arithmetic is binary floating point, so a decimal that cannot be held exactly can lose its last digit: `TRUNC(0.29, 2)` is `0.28`. Use `ROUND` when the value is a decimal amount.
- To cut a date, use [DATE_TRUNC](../functions/date_trunc.md).
- Text that does not read as a number, or a `<places>` that is not a whole number, fails the query.
- Runs after the rows are read; it is not pushed to the data store.

## Examples

```sql
SELECT m.sensor, m.reading,
       TRUNC(m.reading)     AS whole,
       TRUNC(m.reading, 1)  AS one_place
FROM data.readings m
```

| sensor | reading | whole | one_place |
|---|---|---|---|
| S1 | 21.86 | 21 | 21.8 |
| S2 | -3.75 | -3 | -3.7 |

## See also

[ROUND](../functions/round.md) · [FLOOR](../functions/floor.md) · [CEIL](../functions/ceil.md) · [DATE_TRUNC](../functions/date_trunc.md)
