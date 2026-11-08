---
title: "RTRIM"
description: "A string with characters removed from the end."
---

# RTRIM

[Functions › Text › Change a string](../functions.md#text)

Removes characters from the end of a string.

## Syntax

```text
RTRIM( <string> [, <characters> ] )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to trim. |
| `<characters>` | Optional. The set of characters to remove. Each character counts on its own. Without it, white space is removed. |

## Returns

Text. NULL when any argument is NULL.

## Usage notes

- Without `<characters>` it removes white space: spaces, tabs, line breaks.
- `TRIM(TRAILING <characters> FROM <string>)` is the same call.
- On large tables the engine runs `RTRIM( <string> )` in the data store; with `<characters>` it runs after the rows are read.

## Examples

Drop a trailing slash from folder paths:

```sql
SELECT f.path, RTRIM(f.path, '/') AS folder FROM tables.drive.file f
```

| path | folder |
|---|---|
| finance/2026/ | finance/2026 |
| hr/ | hr |

## See also

[TRIM](../functions/trim.md) · [LTRIM](../functions/ltrim.md) · [RPAD](../functions/rpad.md)
