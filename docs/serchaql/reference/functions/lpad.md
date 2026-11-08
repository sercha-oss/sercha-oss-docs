---
title: "LPAD"
description: "A string padded on the left to a length."
---

# LPAD

[Functions › Text › Change a string](../functions.md#text)

Pads a string on the left to a given length, or cuts it to that length.

## Syntax

```text
LPAD( <string>, <length> [, <fill> ] )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to pad. |
| `<length>` | The length of the result, in characters. An integer. |
| `<fill>` | Optional. The text to pad with, repeated as needed. A space when left out. |

## Returns

Text. NULL when any argument is NULL.

## Usage notes

- When `<string>` is already longer than `<length>`, the result is its first `<length>` characters: `LPAD('12345', 3, '0')` is `123`.
- A `<length>` of 0 or less gives an empty string.
- An empty `<fill>` returns `<string>` unchanged.
- A `<length>` that is not an integer is an error.
- It always runs after the rows are read, never in the data store.

## Examples

```sql
SELECT i.number, LPAD(i.number, 6, '0') AS padded FROM data.invoices i
```

| number | padded |
|---|---|
| 412 | 000412 |
| 10020 | 010020 |

## See also

[RPAD](../functions/rpad.md) · [LTRIM](../functions/ltrim.md) · [LEFT](../functions/left.md)
