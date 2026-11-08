---
title: "REGEXP_REPLACE"
description: "A string with matches of a regular expression replaced."
---

# REGEXP_REPLACE

[Functions › Text › Change a string](../functions.md#text)

Replaces the first match of a regular expression, or every match with the `g` flag.

## Syntax

```text
REGEXP_REPLACE( <string>, <pattern>, <replacement> [, <flags> ] )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to change. |
| `<pattern>` | The regular expression to match. See the usage notes for the syntax. |
| `<replacement>` | The text to put in place of each match. `\1` to `\9` insert the pattern's groups, `\&` the whole match, and `\\` a backslash. A `$` is literal. |
| `<flags>` | Optional. `g` replaces every match, not just the first. `i` matches without case. Any other flag is an error. |

## Returns

Text. `<string>` unchanged when nothing matches. NULL when any argument is NULL.

## Usage notes

- Patterns use RE2 syntax, as in PostgreSQL for the common cases: classes like `[0-9]`, `\d`, `\s`, `\w`, `[[:alpha:]]`, anchors `^` and `$`, groups and alternation. RE2 has no lookahead, lookbehind or backreferences in the pattern; a pattern that uses them is an error.
- The match is case sensitive unless the `i` flag is given.
- On large tables the engine runs it in the data store when the pattern and replacement are literals, the call replaces every match (the `g` flag, or a pattern that starts with `^` and so can match only once), and the flags are `g`, `i` or both. The data store uses its own regular expression engine (Trino, Java style), so the engine also keeps a pattern in memory when it holds `(?`, `\b`, `\B`, `\A`, `\z`, `\Z`, `\p`, `\P`, `\k`, `\Q`, `\E` or a `\` followed by a digit, and a replacement that holds `$` or a backslash other than `\1` to `\9` and `\&`. With those rules both engines give the same result. Everything else runs after the rows are read, in RE2.

## Examples

Keep only the digits:

```sql
SELECT c.key, REGEXP_REPLACE(c.phone, '[^0-9]', '', 'g') AS digits FROM Customer c
```

| key | digits |
|---|---|
| C-104 | 61290001234 |

Reorder with groups:

```sql
SELECT i.number, REGEXP_REPLACE(i.issued, '^(\d{4})-(\d{2})-(\d{2})$', '\3/\2/\1') AS issued_au FROM data.invoices i
```

| number | issued_au |
|---|---|
| 412 | 15/03/2026 |

Only the first match, without the `g` flag:

```sql
SELECT REGEXP_REPLACE(f.name, '[ _]+', '-') AS slug FROM tables.drive.file f
```

| slug |
|---|
| annual-report_final.pdf |

## See also

[REPLACE](../functions/replace.md) · [REGEXP_LIKE](../functions/regexp_like.md) · [REGEXP_SPLIT_TO_TABLE](../functions/regexp_split_to_table.md) · [SPLIT_PART](../functions/split_part.md)
