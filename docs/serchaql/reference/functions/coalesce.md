---
title: "COALESCE"
description: "The first argument that is not NULL."
---

# COALESCE

[Functions › Conditional](../functions.md#conditional)

Returns the first of its arguments that is not NULL.

## Syntax

```text
COALESCE( <expr> [, <expr> ...] )
```

## Arguments

| Argument | Description |
|---|---|
| `<expr>` | One or more values, read left to right. |

## Returns

The first argument that is not NULL, or NULL when all of them are. The result type joins the argument types: integers and floats give a float; any other mix gives text.

## Usage notes

- An empty text value reads as NULL everywhere in SerchaQL, so `COALESCE(c.region, 'unknown')` also replaces `''`.
- On large tables the engine runs it in the data store when the arguments are all numbers or all text; otherwise it runs after the rows are read. The result is the same either way.
- `COALESCE` is the rewrite for `IFNULL`, `NVL` and `ISNULL`, which are refused.

## Examples

```sql
SELECT c.key, COALESCE(c.billing_email, c.contact_email, 'none') AS email
FROM Customer c
```

| key | email |
|---|---|
| C-01 | ap@example.com |
| C-02 | sam@example.com |
| C-03 | none |

Count missing values as zero in a sum:

```sql
SELECT o.customer, SUM(COALESCE(o.discount, 0)) AS discounts
FROM Order o
GROUP BY o.customer
```

## Not supported

| Refused | Write instead |
|---|---|
| `IFNULL(a, b)`, `NVL(a, b)`, `ISNULL(a)` | `COALESCE(a, b)`; for a test, `a IS NULL` |

```sql
-- Refused by the engine
SELECT c.key, IFNULL(c.region, 'unknown') AS region FROM Customer c
```

```sql
-- Refused by the engine
SELECT c.key, NVL(c.region, 'unknown') AS region FROM Customer c
```

## See also

[NULLIF](../functions/nullif.md) · [CASE](../clauses/case.md) · [IS NULL](../clauses/is-null.md) · [GREATEST](../functions/greatest.md)
