---
title: "CONCAT"
description: "Strings joined end to end, skipping NULLs."
---

# CONCAT

[Functions › Text › Change a string](../functions.md#text)

Joins its arguments into one string. NULL arguments are skipped.

## Syntax

```text
CONCAT( <value> [, <value> ...] )
```

## Arguments

| Argument | Description |
|---|---|
| `<value>` | One or more values to join. A number, boolean or date is joined as its text. |

## Returns

Text. A NULL argument adds nothing, so the result is never NULL because of one NULL argument. When every argument is NULL the result is empty.

## Usage notes

- The `||` operator also joins text, but `a || b` is NULL when either side is NULL. Use `CONCAT` when a missing part should be left out.
- To put a separator between the parts, use [CONCAT_WS](../functions/concat_ws.md).
- To join values across rows, use [STRING_AGG](../functions/string_agg.md).
- On large tables the engine runs it in the data store, unless an argument is a decimal number or a timestamp.

## Examples

```sql
SELECT c.key, CONCAT(c.first_name, ' ', c.last_name) AS name FROM Customer c
```

| key | name |
|---|---|
| C-104 | Ana Ruiz |
| C-221 | Smith |

Compared with `||` when a part is NULL:

```sql
SELECT o.key, CONCAT('Order ', o.number, o.suffix) AS with_concat, 'Order ' || o.number || o.suffix AS with_pipes
FROM Order o
```

| key | with_concat | with_pipes |
|---|---|---|
| O-501 | Order 4410A | Order 4410A |
| O-502 | Order 4411 | NULL |

## See also

[CONCAT_WS](../functions/concat_ws.md) · [Operators](../clauses/operators.md) · [COALESCE](../functions/coalesce.md) · [STRING_AGG](../functions/string_agg.md)
