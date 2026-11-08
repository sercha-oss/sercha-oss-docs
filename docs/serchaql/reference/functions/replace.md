---
title: "REPLACE"
description: "A string with every occurrence of one substring replaced by another."
---

# REPLACE

[Functions › Text › Change a string](../functions.md#text)

Replaces every occurrence of a substring with another string.

## Syntax

```text
REPLACE( <string>, <from>, <to> )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to change. |
| `<from>` | The substring to find. Matched exactly, with case. |
| `<to>` | The text to put in its place. Use `''` to delete it. |

## Returns

Text. NULL when any argument is NULL. `<string>` unchanged when `<from>` is empty.

## Usage notes

- For a pattern, or to match without case, use [REGEXP_REPLACE](../functions/regexp_replace.md).
- On large tables the engine runs it in the data store when `<from>` is a non-empty literal; otherwise it runs after the rows are read.

## Examples

```sql
SELECT c.key, REPLACE(c.phone, ' ', '') AS phone FROM Customer c
```

| key | phone |
|---|---|
| C-104 | +61290001234 |

Nested calls replace several substrings:

```sql
SELECT f.path, REPLACE(REPLACE(f.path, '_', ' '), '/', ' > ') AS label FROM tables.drive.file f
```

| path | label |
|---|---|
| finance/annual_report.pdf | finance > annual report.pdf |

## See also

[REGEXP_REPLACE](../functions/regexp_replace.md) · [TRIM](../functions/trim.md) · [CONCAT](../functions/concat.md)
