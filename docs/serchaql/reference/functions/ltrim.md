---
title: "LTRIM"
description: "A string with characters removed from the start."
---

# LTRIM

[Functions › Text › Change a string](../functions.md#text)

Removes characters from the start of a string.

## Syntax

```text
LTRIM( <string> [, <characters> ] )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to trim. |
| `<characters>` | Optional. The set of characters to remove. Each character counts on its own. Without it, spaces are removed. |

## Returns

Text. NULL when any argument is NULL.

## Usage notes

- Without `<characters>` only the space character is removed, not tabs or line breaks. Use [TRIM](../functions/trim.md) for all white space.
- `TRIM(LEADING <characters> FROM <string>)` is the same call.
- On large tables the engine runs `LTRIM( <string> )` in the data store; with `<characters>` it runs after the rows are read.

## Examples

Strip leading zeros:

```sql
SELECT i.number, LTRIM(i.number, '0') AS number_trimmed FROM data.invoices i
```

| number | number_trimmed |
|---|---|
| 000412 | 412 |
| 010020 | 10020 |

## See also

[TRIM](../functions/trim.md) · [RTRIM](../functions/rtrim.md) · [LPAD](../functions/lpad.md)
