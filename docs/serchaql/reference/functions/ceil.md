---
title: "CEIL"
description: "The smallest whole number not less than a number."
---

# CEIL

[Functions › Number](../functions.md#number) · Also written `CEILING`

Rounds a number up to the next whole number. `CEILING` is the same function.

## Syntax

```text
{ CEIL | CEILING }( <number> )
```

## Arguments

| Argument | Description |
|---|---|
| `<number>` | A number, or text that reads as a number. |

## Returns

An integer argument comes back unchanged, as an integer. Any other argument returns a float with no fraction (`4.0`). NULL when `<number>` is NULL. Text that does not read as a number fails the query.

## Usage notes

- Up means toward positive infinity: `CEIL(-3.7)` is `-3`.
- To get an integer from a float, wrap it: `CAST(CEIL(x) AS integer)`.
- Runs after the rows are read; it is not pushed to the data store.

## Examples

Boxes needed when a box holds 12 units:

```sql
SELECT o.key, o.quantity,
       CAST(CEIL(o.quantity / 12.0) AS integer) AS boxes
FROM Order o
```

| key | quantity | boxes |
|---|---|---|
| O-100 | 30 | 3 |
| O-101 | 12 | 1 |
| O-102 | 1 | 1 |

## See also

[FLOOR](../functions/floor.md) · [ROUND](../functions/round.md) · [TRUNC](../functions/trunc.md)
