---
title: "RPAD"
description: "A string padded on the right to a length."
---

# RPAD

[Functions › Text › Change a string](../functions.md#text)

Pads a string on the right to a given length, or cuts it to that length.

## Syntax

```text
RPAD( <string>, <length> [, <fill> ] )
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

- When `<string>` is already longer than `<length>`, the result is its first `<length>` characters: `RPAD('abcdef', 3)` is `abc`.
- A `<length>` of 0 or less gives an empty string.
- An empty `<fill>` returns `<string>` unchanged.
- A `<length>` that is not an integer is an error.
- It always runs after the rows are read, never in the data store.

## Examples

```sql
SELECT RPAD(p.name, 12, '.') || p.sku AS line FROM Product p
```

| line |
|---|
| Widget......AB-100 |
| Gear........AB-210 |

## See also

[LPAD](../functions/lpad.md) · [RTRIM](../functions/rtrim.md) · [RIGHT](../functions/right.md)
