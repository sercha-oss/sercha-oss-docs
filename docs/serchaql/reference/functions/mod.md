---
title: "MOD"
description: "The remainder of one number divided by another."
---

# MOD

[Functions › Number](../functions.md#number)

Returns the remainder after dividing the first number by the second. `MOD(a, b)` is the same as `a % b`.

## Syntax

```text
MOD( <dividend>, <divisor> )
```

## Arguments

| Argument | Description |
|---|---|
| `<dividend>` | The number to divide. |
| `<divisor>` | The number to divide by. |

## Returns

An integer when both arguments are integers; otherwise a float. NULL when either argument is NULL.

## Usage notes

- The result takes the sign of `<dividend>`: `MOD(-7, 3)` is `-1` and `MOD(7, -3)` is `1`.
- With floats it is the float remainder: `MOD(7.5, 2)` is `1.5`.
- A `<divisor>` of 0 fails the query with "division by zero". Guard it with [NULLIF](../functions/nullif.md): `MOD(a, NULLIF(b, 0))`.
- `MOD()` runs after the rows are read. The `%` operator on number columns can run in the data store, so prefer `a % b` on large tables.

## Examples

Every tenth order, for a sample:

```sql
SELECT o.key, o.seq
FROM Order o
WHERE MOD(o.seq, 10) = 0
```

| key | seq |
|---|---|
| O-110 | 10 |
| O-120 | 20 |

The same with the operator:

```sql
SELECT o.key, o.seq FROM Order o WHERE o.seq % 10 = 0
```

## See also

[Operators](../clauses/operators.md) · [TRUNC](../functions/trunc.md) · [FLOOR](../functions/floor.md)
