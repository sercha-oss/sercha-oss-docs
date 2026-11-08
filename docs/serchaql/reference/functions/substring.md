---
title: "SUBSTRING"
description: "Part of a string, by start position and length."
---

# SUBSTRING

[Functions › Text › Take part of a string](../functions.md#text) · Also written `SUBSTR`

Returns the part of a string that starts at a position, optionally for a number of characters.

## Syntax

```text
SUBSTRING( <string>, <start> [, <count> ] )
SUBSTR( <string>, <start> [, <count> ] )
SUBSTRING( <string> FROM <start> [ FOR <count> ] )
SUBSTRING( <string> FOR <count> )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to take from. |
| `<start>` | The position of the first character, counting from 1. An integer. |
| `<count>` | Optional. How many characters to take. Without it, the rest of the string. Cannot be negative. |

## Returns

Text. NULL when any argument is NULL. An empty string when the range falls outside the string.

## Usage notes

- `SUBSTRING( <string> FOR <count> )` starts at position 1.
- A `<start>` below 1 counts against `<count>`, as in PostgreSQL: `SUBSTRING('abcdef', 0, 3)` is `ab`, and `SUBSTRING('abcdef', -1, 3)` is `a`.
- A `<count>` past the end stops at the end.
- A negative `<count>`, or a `<start>` or `<count>` that is not an integer, is an error.
- On large tables the engine runs it in the data store when `<start>` is a literal of at least 1; otherwise it runs after the rows are read.

## Examples

```sql
SELECT o.key, SUBSTRING(o.reference, 4) AS ref_number, SUBSTR(o.reference, 1, 2) AS ref_prefix
FROM Order o
```

| key | ref_number | ref_prefix |
|---|---|---|
| O-501 | 8812 | PO |
| O-502 | 9034 | SO |

The standard form:

```sql
SELECT i.number, SUBSTRING(i.issued FROM 1 FOR 7) AS issued_month FROM data.invoices i
```

| number | issued_month |
|---|---|
| 412 | 2026-03 |

## See also

[LEFT](../functions/left.md) · [RIGHT](../functions/right.md) · [SPLIT_PART](../functions/split_part.md) · [STRPOS](../functions/strpos.md) · [LENGTH](../functions/length.md)
