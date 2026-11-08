---
title: "SPLIT_PART"
description: "One part of a string split on a delimiter."
---

# SPLIT_PART

[Functions › Text › Take part of a string](../functions.md#text)

Splits a string on a delimiter and returns one part.

## Syntax

```text
SPLIT_PART( <string>, <delimiter>, <part> )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to split. |
| `<delimiter>` | The text to split on. The whole delimiter is one separator, even when it is several characters. |
| `<part>` | Which part to return, counting from 1. A negative number counts from the end: `-1` is the last part. |

## Returns

Text. An empty string when `<part>` is past the last part. NULL when any argument is NULL.

## Usage notes

- `<part>` cannot be 0.
- On large tables the engine runs it in the data store when `<delimiter>` and `<part>` are literals and `<part>` is positive; otherwise it runs after the rows are read.

## Examples

```sql
SELECT f.path,
       SPLIT_PART(f.path, '/', 1)  AS top_folder,
       SPLIT_PART(f.path, '/', -1) AS file_name
FROM tables.drive.file f
```

| path | top_folder | file_name |
|---|---|---|
| finance/2026/q1.xlsx | finance | q1.xlsx |
| hr/policies.pdf | hr | policies.pdf |

A delimiter of several characters:

```sql
SELECT t.ref, SPLIT_PART(t.ref, '::', 2) AS class_name FROM data.symbols t
```

| ref | class_name |
|---|---|
| Billing::Invoice::total | Invoice |

## See also

[STRPOS](../functions/strpos.md) · [REGEXP_REPLACE](../functions/regexp_replace.md) · [REGEXP_SPLIT_TO_TABLE](../functions/regexp_split_to_table.md)
