---
title: "BETWEEN"
description: "Test whether a value lies in a range, ends included."
---

# BETWEEN

[Operators and expressions](../operators-and-expressions.md)

Tests whether a value lies between two bounds, both included. `x BETWEEN a AND b` is `x >= a AND x <= b`.

## Syntax

```text
SELECT ...
FROM <source> [ <alias> ]
WHERE <expression> [ NOT ] BETWEEN <low> AND <high>
...
```

## Parameters

| Parameter | Description |
|---|---|
| `<expression>` | The value to test. |
| `<low>`, `<high>` | The bounds, both included. The low bound comes first: `BETWEEN 10 AND 1` matches nothing. |
| `NOT` | True when the value is outside the range. |

## Usage notes

- NULL in the value or a bound gives NULL, except where the other half of the range already decides: `5 BETWEEN 10 AND NULL` is false, because `5 >= 10` is false.
- Numbers compare as numbers, text as text, timestamps as times. Text that reads as a number compares as a number against a number.
- On a timestamp column, `BETWEEN '2026-09-01' AND '2026-09-30'` stops at the first moment of 30 September. Use `>= '2026-09-01' AND < '2026-10-01'` to take whole days.
- A plain column between two literals is pushed into the read of the table.

## Examples

```sql
SELECT o.key, o.amount FROM Order o WHERE o.amount BETWEEN 1000 AND 5000
```

| key | amount |
|---|---|
| PO-1001 | 1200 |
| PO-1017 | 4500 |

Outside a range, and a date range:

```sql
SELECT o.key FROM Order o WHERE o.amount NOT BETWEEN 100 AND 10000
```

```sql
SELECT o.key, o.placed_at FROM Order o
WHERE o.placed_at >= '2026-09-01' AND o.placed_at < '2026-10-01'
```

## Not supported

| Refused | Write instead |
|---|---|
| `BETWEEN SYMMETRIC` | `(x BETWEEN a AND b OR x BETWEEN b AND a)` |

```sql
-- Refused by the engine
SELECT o.key FROM Order o WHERE o.amount BETWEEN SYMMETRIC 5000 AND 1000
```

## See also

[Operators](../clauses/operators.md) · [IN](../clauses/in.md) · [WHERE](../clauses/where.md) · [DATE_TRUNC](../functions/date_trunc.md)
