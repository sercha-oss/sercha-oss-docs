---
title: "STARTS_WITH"
description: "Whether a string begins with a prefix."
---

# STARTS_WITH

[Functions › Text › Find](../functions.md#text)

Returns TRUE when a string begins with a given prefix.

## Syntax

```text
STARTS_WITH( <string>, <prefix> )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to test. |
| `<prefix>` | The text it must begin with. Matched exactly, with case. |

## Returns

A boolean. TRUE when `<prefix>` is empty. NULL when any argument is NULL.

## Usage notes

- `STARTS_WITH(x, 'ab')` matches the same rows as `x LIKE 'ab%'`, without treating `%` and `_` in the prefix as wildcards.
- To match without case, lower both sides: `STARTS_WITH(LOWER(x), 'ab')`.
- On large tables the engine runs it in the data store.

## Examples

```sql
SELECT f.path FROM tables.drive.file f WHERE STARTS_WITH(f.path, 'finance/')
```

| path |
|---|
| finance/2026/q1.xlsx |
| finance/budget.xlsx |

## See also

[LIKE](../clauses/like.md) · [LEFT](../functions/left.md) · [STRPOS](../functions/strpos.md) · [REGEXP_LIKE](../functions/regexp_like.md)
