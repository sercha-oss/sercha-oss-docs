---
title: "REGEXP_LIKE"
description: "Whether a string matches a regular expression."
---

# REGEXP_LIKE

[Functions › Text › Find](../functions.md#text)

Returns TRUE when a regular expression matches anywhere in a string.

## Syntax

```text
REGEXP_LIKE( <string>, <pattern> [, <flags> ] )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to test. |
| `<pattern>` | The regular expression. It matches anywhere in the string; anchor it with `^` and `$` to match the whole value. |
| `<flags>` | Optional. `i` matches without case. Any other flag is an error. |

## Returns

A boolean. NULL when any argument is NULL.

## Usage notes

- Patterns use RE2 syntax: classes like `[0-9]`, `\d`, `\s`, `\w`, `[[:alpha:]]`, anchors, groups and alternation. RE2 has no lookahead, lookbehind or backreferences; a pattern that uses them is an error.
- For a simple wildcard match, `LIKE` and `ILIKE` are often enough.
- On large tables the engine runs it in the data store when the pattern is a literal, the flags are a literal of `i` or empty, and the pattern holds none of `(?`, `\b`, `\B`, `\A`, `\z`, `\Z`, `\p`, `\P`, `\k`, `\Q`, `\E` or a `\` followed by a digit. The data store uses its own regular expression engine (Trino, Java style); these rules keep to patterns both engines read the same. Everything else runs after the rows are read, in RE2.

## Examples

```sql
SELECT o.key, o.reference
FROM Order o
WHERE REGEXP_LIKE(o.reference, '^PO-[0-9]{4}$')
```

| key | reference |
|---|---|
| O-501 | PO-8812 |

Without case:

```sql
SELECT t.key, t.title FROM Ticket t WHERE REGEXP_LIKE(t.title, 'refund|chargeback', 'i')
```

| key | title |
|---|---|
| T-41 | Refund not received |
| T-57 | Chargeback dispute |

## Not supported

| Refused | Write instead |
|---|---|
| `REGEXP_MATCHES(...)` | `REGEXP_LIKE(<string>, <pattern>)`, or `LIKE` / `ILIKE` |

```sql
-- Refused by the engine
SELECT t.key FROM Ticket t WHERE regexp_matches(t.title, 'refund')
```

## See also

[LIKE](../clauses/like.md) · [REGEXP_REPLACE](../functions/regexp_replace.md) · [STARTS_WITH](../functions/starts_with.md) · [STRPOS](../functions/strpos.md)
