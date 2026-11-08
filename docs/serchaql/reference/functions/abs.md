---
title: "ABS"
description: "The absolute value of a number."
---

# ABS

[Functions › Number](../functions.md#number)

Returns a number without its sign.

## Syntax

```text
ABS( <number> )
```

## Arguments

| Argument | Description |
|---|---|
| `<number>` | A number, or text that reads as a number. |

## Returns

An integer for an integer argument; otherwise a float. NULL when `<number>` is NULL. Text that does not read as a number fails the query.

## Usage notes

- On a number column the engine runs it in the data store; on text it runs after the rows are read.

## Examples

How far each invoice is from its expected total:

```sql
SELECT i.invoice_no, i.amount, i.expected,
       ABS(i.amount - i.expected) AS difference
FROM data.invoices i
ORDER BY difference DESC
```

| invoice_no | amount | expected | difference |
|---|---|---|---|
| INV-104 | 820.5 | 950 | 129.5 |
| INV-101 | 1200 | 1180 | 20 |
| INV-102 | 300 | 300 | 0 |

## See also

[SIGN](../functions/sign.md) · [ROUND](../functions/round.md) · [Operators](../clauses/operators.md)
