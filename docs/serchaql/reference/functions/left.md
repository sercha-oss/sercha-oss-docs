---
title: "LEFT"
description: "The first characters of a string."
---

# LEFT

[Functions › Text › Take part of a string](../functions.md#text)

Returns the first characters of a string.

## Syntax

```text
LEFT( <string>, <n> )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to take from. |
| `<n>` | How many characters to take. A negative number takes all but the last `-<n>` characters. |

## Returns

Text. NULL when any argument is NULL. The whole string when `<n>` is at least its length.

## Usage notes

- `LEFT('invoice', -3)` is `invo`.
- A `<n>` that is not an integer is an error.
- On large tables the engine runs it in the data store when `<n>` is a literal of 0 or more; otherwise it runs after the rows are read.

## Examples

```sql
SELECT p.sku, LEFT(p.sku, 2) AS family, COUNT(*) AS products
FROM Product p
GROUP BY p.sku, LEFT(p.sku, 2)
```

| sku | family | products |
|---|---|---|
| AB-100 | AB | 1 |
| AB-210 | AB | 1 |

## See also

[RIGHT](../functions/right.md) · [SUBSTRING](../functions/substring.md) · [LPAD](../functions/lpad.md) · [STARTS_WITH](../functions/starts_with.md)
