---
title: "LEAST"
description: "The smallest of its arguments, ignoring NULLs."
---

# LEAST

[Functions › Conditional](../functions.md#conditional)

Returns the smallest of its arguments. Unlike [MIN](../functions/min.md), which works across rows, `LEAST` compares values within one row.

## Syntax

```text
LEAST( <expr> [, <expr> ...] )
```

## Arguments

| Argument | Description |
|---|---|
| `<expr>` | One or more values to compare. |

## Returns

The smallest argument that is not NULL. NULL only when every argument is NULL. The result type joins the argument types: integers and floats give a float; any other mix gives text.

## Usage notes

- NULL arguments are skipped: `LEAST(5, NULL, 2)` is `2`.
- Comparison follows the same rules as [GREATEST](../functions/greatest.md). A value that cannot be compared with the current smallest is skipped.
- Runs after the rows are read; it is not pushed to the data store.

## Examples

Cap a refund at the amount paid:

```sql
SELECT i.invoice_no, i.paid, i.claimed, LEAST(i.claimed, i.paid) AS refund
FROM data.invoices i
```

| invoice_no | paid | claimed | refund |
|---|---|---|---|
| INV-101 | 500 | 650 | 500 |
| INV-102 | 300 | 120 | 120 |

The earlier of two dates:

```sql
SELECT o.key, LEAST(o.promised_date, o.shipped_date) AS first_date
FROM Order o
```

## See also

[GREATEST](../functions/greatest.md) · [MIN](../functions/min.md) · [COALESCE](../functions/coalesce.md)
