---
title: "REFRESH TABLE"
description: "Rebuild a cleaned table from its landed table, with the same rule."
---

# REFRESH TABLE

[Commands › Tables](../commands.md#tables) · Admins only, through `sercha_define` or a tenant file

Rebuilds `clean.<source>.<table>` and its `_map` from the landed table, with the rule [NORMALISE](../commands/alter-table-normalise.md) declared. Run it after new rows land.

## Syntax

```text
REFRESH TABLE clean.<source>.<table>
```

## Parameters

| Parameter | Description |
|---|---|
| `clean.<source>.<table>` | A cleaned table. Only a clean-layer table is built by Sercha; any other name is refused when the statement runs. |

## Usage notes

- Only the group and map rows that changed are written: a refresh that changes nothing writes nothing.
- The result is `property` and `value` rows: `table`, `map`, `rows_read`, `groups`, `rows_written`, `rows_removed`.

## Examples

```sql
REFRESH TABLE clean.crm.account
```

| property | value |
|---|---|
| table | clean.crm.account |
| map | clean.crm.account_map |
| rows_read | 1251 |
| groups | 1019 |
| rows_written | 18 |
| rows_removed | 0 |

## Not supported

| Refused | Write instead |
|---|---|
| A source with no table | `clean.<source>.<table>` |

```sql
-- Refused by the engine
REFRESH TABLE clean.crm
```

## See also

[ALTER TABLE ... NORMALISE](../commands/alter-table-normalise.md) · [ALTER TABLE ... RENAME TO](../commands/alter-table-rename.md) · [SHOW MODEL](../commands/show-model.md)
