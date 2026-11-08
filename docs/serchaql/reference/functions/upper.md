---
title: "UPPER"
description: "A string in upper case."
---

# UPPER

[Functions › Text › Case and length](../functions.md#text)

Returns a string with every letter in upper case.

## Syntax

```text
UPPER( <string> )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to convert. A number, boolean or date is converted as its text. |

## Returns

Text. NULL when `<string>` is NULL.

## Usage notes

- Letters outside ASCII are converted too, one character at a time: `UPPER('école')` is `ÉCOLE`.
- On large tables the engine runs it in the data store, in the select list and in `WHERE`.

## Examples

```sql
SELECT p.key, UPPER(p.sku) AS sku
FROM Product p
WHERE UPPER(p.sku) = 'AB-100'
```

| key | sku |
|---|---|
| P-7 | AB-100 |

```sql
SELECT DISTINCT UPPER(TRIM(a.country)) AS country
FROM tables.crm.account a
ORDER BY country
```

| country |
|---|
| AU |
| NZ |
| US |

## See also

[LOWER](../functions/lower.md) · [INITCAP](../functions/initcap.md) · [TRIM](../functions/trim.md)
