---
title: "RIGHT"
description: "The last characters of a string."
---

# RIGHT

[Functions › Text › Take part of a string](../functions.md#text)

Returns the last characters of a string.

## Syntax

```text
RIGHT( <string>, <n> )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to take from. |
| `<n>` | How many characters to take. A negative number takes all but the first `-<n>` characters. |

## Returns

Text. NULL when any argument is NULL. The whole string when `<n>` is at least its length.

## Usage notes

- `RIGHT('invoice', -2)` is `voice`.
- A `<n>` that is not an integer is an error.
- On large tables the engine runs it in the data store when `<n>` is a literal of 0 or more; otherwise it runs after the rows are read.

## Examples

File extensions of four characters:

```sql
SELECT f.name, RIGHT(f.name, 4) AS ext
FROM tables.drive.file f
WHERE RIGHT(f.name, 4) = 'xlsx'
```

| name | ext |
|---|---|
| q1.xlsx | xlsx |
| budget.xlsx | xlsx |

## See also

[LEFT](../functions/left.md) · [SUBSTRING](../functions/substring.md) · [RPAD](../functions/rpad.md) · [SPLIT_PART](../functions/split_part.md)
