---
title: "LIKE"
description: "Match text against a pattern with % and _ wildcards."
---

# LIKE

[Operators and expressions](../operators-and-expressions.md)

Tests whether text matches a pattern. `%` matches any run of characters, `_` matches exactly one. `ILIKE` ignores case.

## Syntax

```text
SELECT ...
FROM <source> [ <alias> ]
WHERE <text> [ NOT ] { LIKE | ILIKE } <pattern>
...
```

## Parameters

| Parameter | Description |
|---|---|
| `<text>` | The text to test: a column or any expression. A number, boolean or date is read as its text. |
| `<pattern>` | A string literal, or an expression such as another column. `%` is any run of characters (including none), `_` is one character, and a backslash makes the next character literal: `\%`, `\_`, `\\`. |
| `LIKE` | Case-sensitive. |
| `ILIKE` | Ignores case. |
| `NOT` | Negates the match. |

## Usage notes

- The pattern must match the whole text: `'abc' LIKE 'b'` is false, `'abc' LIKE '%b%'` is true.
- A NULL text or pattern gives NULL, so the row is dropped by both `LIKE` and `NOT LIKE`. An empty text value is NULL here too.
- A pattern that ends with a single backslash is an error when the query runs.
- The pattern may come from a column, to match values against stored patterns: `WHERE m.line LIKE p.template`.
- `LIKE` with a literal pattern runs in the data store where the table lives there. For a fixed prefix, [STARTS_WITH](../functions/starts_with.md) says the same thing more plainly; for anything richer, use [REGEXP_LIKE](../functions/regexp_like.md).

## Examples

```sql
SELECT t.name FROM tables.drive.file t WHERE t.name ILIKE '%invoice%.pdf'
```

| name |
|---|
| Invoice-0042.pdf |
| supplier_invoice_march.PDF |

A literal underscore and a single-character wildcard:

```sql
SELECT t.name FROM tables.drive.file t WHERE t.name LIKE 'Q_\_report%'
```

| name |
|---|
| Q1_report.xlsx |
| Q3_report_final.docx |

Exclude a pattern:

```sql
SELECT o.key, o.title FROM Order o WHERE o.title NOT LIKE '%test%'
```

## Not supported

| Refused | Write instead |
|---|---|
| `LIKE ... ESCAPE '<char>'` | Escape `%` and `_` with a backslash, the default escape character |
| `SIMILAR TO`, `NOT SIMILAR TO` | `LIKE` / `ILIKE`, or `regexp_like` |
| `~`, `~*` regular expression operators | `regexp_like(x, pattern)`, with flag `'i'` to ignore case |

```sql
-- Refused by the engine
SELECT t.name FROM tables.drive.file t WHERE t.name LIKE '50!%%' ESCAPE '!'
```

```sql
-- Refused by the engine
SELECT t.name FROM tables.drive.file t WHERE t.name SIMILAR TO '%(invoice|receipt)%'
```

```sql
-- Refused by the engine
SELECT t.name FROM tables.drive.file t WHERE t.name ~ '^Q[1-4]'
```

## See also

[REGEXP_LIKE](../functions/regexp_like.md) · [STARTS_WITH](../functions/starts_with.md) · [STRPOS](../functions/strpos.md) · [LOWER](../functions/lower.md) · [Operators](../clauses/operators.md)
