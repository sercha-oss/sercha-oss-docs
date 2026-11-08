---
title: "IS NULL"
description: "Test whether a value is missing; IS TRUE and IS FALSE test booleans."
---

# IS NULL

[Operators and expressions](../operators-and-expressions.md)

Tests whether a value is NULL. Comparisons with NULL are unknown (`x = NULL` is never true), so `IS NULL` is the only reliable test.

## Syntax

```text
SELECT ...
FROM <source> [ <alias> ]
WHERE <expression> IS [ NOT ] NULL
   OR <expression> IS [ NOT ] { TRUE | FALSE }
...
```

## Parameters

| Parameter | Description |
|---|---|
| `IS NULL` | True when the value is NULL. Never NULL itself. |
| `IS NOT NULL` | True when the value is present. |
| `IS TRUE`, `IS FALSE` | True when a boolean is true, or false. A NULL gives false. |
| `IS NOT TRUE`, `IS NOT FALSE` | The opposite: true for NULL as well. |

## Usage notes

- In a text, date or timestamp column, an empty string is NULL. `IS NULL` matches both a missing value and `''`. A numeric 0 and a boolean false are values, not NULL.
- An expression that produces empty text, such as `trim('  ')`, also reads as NULL.
- `IS NULL` works anywhere an expression does: `SELECT o.closed_at IS NULL AS still_open`.
- A plain column `IS [NOT] NULL` is pushed into the read of the table.
- To replace NULLs with a value, use [COALESCE](../functions/coalesce.md). To turn a value into NULL, use [NULLIF](../functions/nullif.md).

## Examples

Orders not yet closed:

```sql
SELECT o.key, o.placed_at FROM Order o WHERE o.closed_at IS NULL
```

| key | placed_at |
|---|---|
| PO-1001 | 2026-09-14 10:02:00 |
| PO-1017 | 2026-10-02 08:45:00 |

Keep NULLs that a comparison would drop:

```sql
SELECT o.key, o.status FROM Order o WHERE o.status <> 'closed' OR o.status IS NULL
```

A boolean test and a flag column:

```sql
SELECT o.key, o.closed_at IS NOT NULL AS is_closed FROM Order o WHERE o.is_priority IS TRUE
```

## Not supported

| Refused | Write instead |
|---|---|
| `a IS DISTINCT FROM b`, `a IS NOT DISTINCT FROM b` | `(a = b OR (a IS NULL AND b IS NULL))`, or its negation |
| `ISNULL(x)`, `x ISNULL`, `x NOTNULL` | `x IS NULL`, `x IS NOT NULL` |
| `IS UNKNOWN` | `IS NULL` |

```sql
-- Refused by the engine
SELECT o.key FROM Order o WHERE o.status IS DISTINCT FROM o.previous_status
```

```sql
-- Refused by the engine
SELECT o.key FROM Order o WHERE isnull(o.closed_at)
```

```sql
-- Refused by the engine
SELECT o.key FROM Order o WHERE o.closed_at IS UNKNOWN
```

## See also

[COALESCE](../functions/coalesce.md) · [NULLIF](../functions/nullif.md) · [Operators](../clauses/operators.md) · [IN](../clauses/in.md) · [WHERE](../clauses/where.md)
