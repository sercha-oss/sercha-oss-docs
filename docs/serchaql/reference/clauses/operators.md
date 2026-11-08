---
title: "Operators"
description: "Comparison, logical, arithmetic and concatenation operators, and their precedence."
---

# Operators

[Operators and expressions](../operators-and-expressions.md)

The operators that build expressions: comparisons, `AND`, `OR` and `NOT`, arithmetic, and `||` to join text. They work in the SELECT list, `WHERE`, `HAVING`, `ORDER BY`, `GROUP BY`, `CASE` and function arguments.

## Syntax

```text
SELECT <a> + <b>, <a> || <b>, ...
FROM <source> [ <alias> ]
WHERE <x> <comparison> <y> { AND | OR } NOT <condition>
...

<comparison> ::= = | <> | != | < | <= | > | >=
<arithmetic> ::= + | - | * | / | %
```

## Parameters

| Parameter | Description |
|---|---|
| `=`, `<>` (or `!=`), `<`, `<=`, `>`, `>=` | Comparison. NULL on either side gives NULL. |
| `AND`, `OR`, `NOT` | Logic with three values: true, false and NULL (unknown). |
| `+`, `-`, `*`, `/` | Arithmetic. |
| `%` | Remainder: `7 % 3` is 1. Same as [MOD](../functions/mod.md). |
| `-x`, `+x` | Negation, and a no-op. |
| `\|\|` | Joins two values as text: `'PO-' \|\| o.key`. |
| `::` | Cast. See [CAST](../clauses/cast.md). |

## Usage notes

Precedence, from the loosest to the tightest binding. Operators on one line bind equally and group from the left.

| Level | Operators |
|---|---|
| 1 (loosest) | `OR` |
| 2 | `AND` |
| 3 | `NOT` |
| 4 | `=`, `<>`, `<`, `<=`, `>`, `>=`, `[NOT] LIKE`, `[NOT] ILIKE`, `[NOT] IN`, `[NOT] BETWEEN`, `IS [NOT] NULL` |
| 5 | `\|\|` |
| 6 | `+`, `-` |
| 7 | `*`, `/`, `%` |
| 8 | unary `-`, unary `+` |
| 9 (tightest) | `::` |

So `a OR b AND c` is `a OR (b AND c)`, `NOT a = b` is `NOT (a = b)`, and `'n=' || 1 + 2` is `'n=3'`. Use parentheses whenever it is not obvious.

Comparisons:

- Two numbers compare as numbers. A number against text that reads as a number compares as numbers; text that does not read as a number gives NULL, so it never matches.
- Timestamps compare as times; text on the other side in any date or timestamp form is read as one. Everything else compares as text, byte by byte, so case matters: use `lower()` or `ILIKE` to ignore it.
- In a text, date or timestamp column an empty string is NULL. Test for it with `IS NULL`.

Logic:

- `false AND NULL` is false and `true OR NULL` is true; every other mix with NULL is NULL. `NOT NULL` is NULL.
- A row is kept by `WHERE` only when its condition is true.
- A boolean column can stand alone as a condition: `WHERE o.is_priority AND NOT o.is_cancelled`.

Arithmetic:

- Two integers give an integer, and `/` then drops the fraction: `7 / 2` is 3. Make one side a float for an exact result: `7 / 2.0`, or `CAST(x AS double precision) / y`.
- Division or remainder by zero is an error that stops the query. Guard with `NULLIF(y, 0)`: `x / NULLIF(y, 0)` is NULL instead.
- NULL on either side gives NULL.
- Text that reads as a number takes part as a number. Other text is an error.
- Aggregates can be combined: `SUM(o.amount) / COUNT(*)`.

Concatenation:

- `||` gives NULL when either side is NULL. [CONCAT](../functions/concat.md) skips NULLs instead.
- A number or boolean is joined as its text.

## Examples

Arithmetic, concatenation and a guarded division:

```sql
SELECT o.key,
       o.amount * 1.25 AS with_markup,
       'PO-' || o.key AS label,
       o.amount / NULLIF(o.quantity, 0) AS unit_price
FROM Order o
```

| key | with_markup | label | unit_price |
|---|---|---|---|
| 1001 | 1500 | PO-1001 | 400 |
| 1002 | 387.5 | PO-1002 | 310 |

Parentheses change the grouping:

```sql
SELECT o.key FROM Order o
WHERE (o.status = 'open' OR o.status = 'held') AND o.amount > 1000
```

Remainder and a ratio of aggregates:

```sql
SELECT o.customer,
       SUM(o.amount) / COUNT(*) AS average,
       COUNT(CASE WHEN o.quantity % 2 = 0 THEN 1 END) AS even_quantities
FROM Order o
GROUP BY o.customer
```

## Not supported

| Refused | Write instead |
|---|---|
| `IS [NOT] DISTINCT FROM` | `(a = b OR (a IS NULL AND b IS NULL))` |
| `= ANY ( ... )`, `<> ALL ( ... )` | `IN`, `NOT IN` |
| `INTERVAL` arithmetic | Compare dates directly, or subtract `extract(epoch FROM ...)` values |
| `~`, `~*`, `SIMILAR TO` | `regexp_like`, `LIKE` |
| `^` for powers, bitwise `&`, `\|`, `#` | [POWER](../functions/power.md); no bitwise operators |

```sql
-- Refused by the engine
SELECT o.key FROM Order o WHERE o.status IS NOT DISTINCT FROM o.previous_status
```

```sql
-- Refused by the engine
SELECT o.key, o.amount ^ 2 AS squared FROM Order o
```

## See also

[CAST](../clauses/cast.md) · [LIKE](../clauses/like.md) · [IN](../clauses/in.md) · [BETWEEN](../clauses/between.md) · [IS NULL](../clauses/is-null.md) · [CASE](../clauses/case.md) · [CONCAT](../functions/concat.md) · [MOD](../functions/mod.md) · [COALESCE](../functions/coalesce.md)
