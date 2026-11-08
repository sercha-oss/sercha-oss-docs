---
title: "TRIM"
description: "A string with characters removed from both ends."
---

# TRIM

[Functions › Text › Change a string](../functions.md#text) · Also written `BTRIM`

Removes characters from both ends of a string, or from one end with `LEADING` or `TRAILING`.

## Syntax

```text
TRIM( <string> [, <characters> ] )
BTRIM( <string> [, <characters> ] )
TRIM( [ { BOTH | LEADING | TRAILING } ] [ <characters> ] FROM <string> )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to trim. |
| `<characters>` | Optional. The set of characters to remove. Each character counts on its own, in any order: `'xy'` removes every `x` and `y` at the ends. |
| `BOTH` | Trim both ends. The default. |
| `LEADING` | Trim the start only. The same as [LTRIM](../functions/ltrim.md). |
| `TRAILING` | Trim the end only. The same as [RTRIM](../functions/rtrim.md). |

## Returns

Text. NULL when any argument is NULL.

## Usage notes

- Without `<characters>`, `TRIM` and `BTRIM` remove white space at both ends: spaces, tabs, line breaks and other Unicode white space.
- On large tables the engine runs `TRIM( <string> )` in the data store; with `<characters>` it runs after the rows are read.
- An empty string reads as NULL, so a value that trims to nothing can behave as NULL when it is read back.

## Examples

```sql
SELECT a.key, TRIM(a.name) AS name
FROM tables.crm.account a
WHERE TRIM(a.name) = 'Northwind Traders'
```

| key | name |
|---|---|
| A-12 | Northwind Traders |

Remove a set of characters:

```sql
SELECT o.key, TRIM(o.reference, '#-') AS reference FROM Order o
```

| key | reference |
|---|---|
| O-501 | PO-8812 |

The standard form:

```sql
SELECT o.key, TRIM(LEADING '0' FROM o.number) AS number FROM Order o
```

| key | number |
|---|---|
| O-501 | 4410 |

## See also

[LTRIM](../functions/ltrim.md) · [RTRIM](../functions/rtrim.md) · [REPLACE](../functions/replace.md) · [LENGTH](../functions/length.md)
