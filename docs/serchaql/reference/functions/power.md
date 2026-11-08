---
title: "POWER"
description: "A number raised to a power."
---

# POWER

[Functions › Number](../functions.md#number) · Also written `POW`

Raises a number to a power. `POW` is the same function.

## Syntax

```text
{ POWER | POW }( <base>, <exponent> )
```

## Arguments

| Argument | Description |
|---|---|
| `<base>` | A number, or text that reads as a number. |
| `<exponent>` | A number, or text that reads as a number. May be negative or have a fraction. |

## Returns

Always a float, even for integer arguments: `POWER(2, 10)` is `1024.0`. NULL when either argument is NULL. Text that does not read as a number fails the query.

## Usage notes

- A fractional exponent of a negative base has no real result and returns NaN.
- Runs after the rows are read; it is not pushed to the data store.

## Examples

Compound growth over a number of years:

```sql
SELECT a.key, a.balance, a.rate, a.years,
       ROUND(a.balance * POWER(1 + a.rate, a.years), 2) AS projected
FROM tables.crm.account a
```

| key | balance | rate | years | projected |
|---|---|---|---|---|
| A-1 | 1000 | 0.04 | 3 | 1124.86 |
| A-2 | 2500 | 0.02 | 5 | 2760.2 |

## Not supported

| Refused | Write instead |
|---|---|
| `EXP(x)`, `LN(x)`, `LOG(x)` | Not available. `POWER(2.718281828459045, x)` stands in for `EXP(x)`. |

```sql
-- Refused by the engine
SELECT a.key, LN(a.balance) AS log_balance FROM tables.crm.account a
```

## See also

[SQRT](../functions/sqrt.md) · [ROUND](../functions/round.md)
