---
title: "STRING_TO_TABLE"
description: "One row for each piece of a string split on a delimiter."
---

# STRING_TO_TABLE

[Functions › Text › Split into rows](../functions.md#text)

Splits a string on a delimiter and returns one row for each piece.

## Syntax

```text
SELECT ..., STRING_TO_TABLE( <string>, <delimiter> ) [ AS <alias> ] FROM ...
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to split. |
| `<delimiter>` | The text that separates the pieces, matched exactly. NULL splits into single characters. An empty delimiter returns the whole string as one piece. |

## Returns

Text, one row per piece. Each input row is repeated once for each piece, with the other columns copied. An input row whose `<string>` is NULL produces no rows.

## Usage notes

- It is set returning: it must be a whole item in the select list, not inside another expression or in `WHERE`, `GROUP BY` or `ORDER BY`. To filter, group or count the pieces, select it in a derived table and use the outer query.
- Only one set-returning call is allowed in a select list.
- The pieces are not trimmed. Split on `', '` or trim the pieces in an outer query.
- The PostgreSQL third argument (a value to read as NULL) is not accepted.
- For one piece by position, use [SPLIT_PART](../functions/split_part.md). For a pattern, use [REGEXP_SPLIT_TO_TABLE](../functions/regexp_split_to_table.md).
- It always runs after the rows are read, never in the data store.

## Examples

```sql
SELECT p.key, STRING_TO_TABLE(p.tags, ',') AS tag FROM Product p
```

| key | tag |
|---|---|
| P-7 | outdoor |
| P-7 | steel |
| P-9 | indoor |

Products per tag, with the pieces trimmed:

```sql
SELECT TRIM(s.tag) AS tag, COUNT(*) AS products
FROM (SELECT p.key AS key, STRING_TO_TABLE(p.tags, ',') AS tag FROM Product p) s
GROUP BY TRIM(s.tag)
```

| tag | products |
|---|---|
| outdoor | 1 |
| steel | 1 |
| indoor | 1 |

## See also

[REGEXP_SPLIT_TO_TABLE](../functions/regexp_split_to_table.md) · [SPLIT_PART](../functions/split_part.md) · [STRING_AGG](../functions/string_agg.md) · [Subqueries](../clauses/subqueries.md)
