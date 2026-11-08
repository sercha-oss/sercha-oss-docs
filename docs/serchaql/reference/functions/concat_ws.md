---
title: "CONCAT_WS"
description: "Strings joined with a separator, skipping NULLs."
---

# CONCAT_WS

[Functions › Text › Change a string](../functions.md#text)

Joins its arguments into one string with a separator between them. NULL arguments are skipped, with no separator for them.

## Syntax

```text
CONCAT_WS( <separator>, <value> [, <value> ...] )
```

## Arguments

| Argument | Description |
|---|---|
| `<separator>` | The text to put between the values. |
| `<value>` | One or more values to join. A number, boolean or date is joined as its text. |

## Returns

Text. NULL when `<separator>` is NULL. NULL values are left out, so `CONCAT_WS(', ', 'a', NULL, 'b')` is `a, b`. Empty when every value is NULL.

## Usage notes

- On large tables the engine runs it in the data store, unless an argument is a decimal number or a timestamp.

## Examples

```sql
SELECT a.key, CONCAT_WS(', ', a.street, a.city, a.country) AS address FROM tables.crm.account a
```

| key | address |
|---|---|
| A-12 | 1 George St, Sydney, AU |
| A-19 | Auckland, NZ |

## See also

[CONCAT](../functions/concat.md) · [SPLIT_PART](../functions/split_part.md) · [STRING_AGG](../functions/string_agg.md)
