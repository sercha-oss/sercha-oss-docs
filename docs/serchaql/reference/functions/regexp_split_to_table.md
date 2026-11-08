---
title: "REGEXP_SPLIT_TO_TABLE"
description: "One row for each piece of a string split on a regular expression."
---

# REGEXP_SPLIT_TO_TABLE

[Functions › Text › Split into rows](../functions.md#text)

Splits a string on a regular expression and returns one row for each piece.

## Syntax

```text
SELECT ..., REGEXP_SPLIT_TO_TABLE( <string>, <pattern> [, <flags> ] ) [ AS <alias> ] FROM ...
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to split. |
| `<pattern>` | The regular expression that separates the pieces, in RE2 syntax. |
| `<flags>` | Optional. `i` matches without case. Any other flag is an error. A NULL flags value is ignored. |

## Returns

Text, one row per piece. Each input row is repeated once for each piece, with the other columns copied. An input row whose `<string>` or `<pattern>` is NULL produces no rows.

## Usage notes

- It is set returning: it must be a whole item in the select list, not inside another expression or in `WHERE`, `GROUP BY` or `ORDER BY`. To filter, group or count the pieces, select it in a derived table and use the outer query.
- Only one set-returning call is allowed in a select list. Split a second one in another derived table.
- Pieces can be empty, for example between two separators next to each other.
- Patterns use RE2: no lookahead, lookbehind or backreferences.
- It always runs after the rows are read, never in the data store.

## Examples

```sql
SELECT t.key, REGEXP_SPLIT_TO_TABLE(t.labels, '\s*[,;]\s*') AS label FROM Ticket t
```

| key | label |
|---|---|
| T-41 | billing |
| T-41 | refund |
| T-57 | billing |

Count the pieces in an outer query:

```sql
SELECT s.label, COUNT(*) AS tickets
FROM (SELECT t.key AS key, REGEXP_SPLIT_TO_TABLE(t.labels, '\s*,\s*') AS label FROM Ticket t) s
GROUP BY s.label
ORDER BY tickets DESC
```

| label | tickets |
|---|---|
| billing | 2 |
| refund | 1 |

## See also

[STRING_TO_TABLE](../functions/string_to_table.md) · [SPLIT_PART](../functions/split_part.md) · [REGEXP_REPLACE](../functions/regexp_replace.md) · [Subqueries](../clauses/subqueries.md)
