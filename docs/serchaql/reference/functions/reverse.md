---
title: "REVERSE"
description: "A string with its characters in reverse order."
---

# REVERSE

[Functions › Text › Change a string](../functions.md#text)

Returns a string with its characters in reverse order.

## Syntax

```text
REVERSE( <string> )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to reverse. |

## Returns

Text. NULL when `<string>` is NULL.

## Usage notes

- It reverses characters, not bytes, so text outside ASCII stays valid.
- On large tables the engine runs it in the data store.

## Examples

```sql
SELECT p.sku, REVERSE(p.sku) AS reversed FROM Product p
```

| sku | reversed |
|---|---|
| AB-100 | 001-BA |

## See also

[RIGHT](../functions/right.md) · [SPLIT_PART](../functions/split_part.md) · [STRPOS](../functions/strpos.md)
