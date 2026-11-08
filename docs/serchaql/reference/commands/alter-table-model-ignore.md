---
title: "ALTER TABLE ... MODEL IGNORE"
description: "Mark a landed or cleaned table as deliberately left out of the model."
---

# ALTER TABLE ... MODEL IGNORE

[Commands › Tables](../commands.md#tables) · Admins only, through `sercha_define` or a tenant file

Marks a table as deliberately not part of the model, so `SHOW MODEL COVERAGE` reports it as `left out` rather than `not modelled`. `DROP MODEL IGNORE` removes the mark.

## Syntax

```text
ALTER TABLE <layer name> SET MODEL IGNORE

ALTER TABLE <layer name> DROP MODEL IGNORE
```

## Parameters

| Parameter | Description |
|---|---|
| `<layer name>` | `tables.<source>.<table>` or `clean.<source>.<table>`. Any other name is refused when the statement runs. |

## Usage notes

- The mark changes only what [SHOW MODEL COVERAGE](../commands/show-model.md) reports. The table stays readable.
- `SET` on a name `SHOW TABLES` does not list is refused. `DROP` on a table that is not marked is refused.

## Examples

```sql
ALTER TABLE tables.crm.legacy_note SET MODEL IGNORE
```

| result |
|---|
| tables.crm.legacy_note is left out of the model |

```sql
ALTER TABLE tables.crm.legacy_note DROP MODEL IGNORE
```

| result |
|---|
| tables.crm.legacy_note counts for the model again |

## Not supported

| Refused | Write instead |
|---|---|
| `SET IGNORE` without `MODEL` | `SET MODEL IGNORE` |

```sql
-- Refused by the engine
ALTER TABLE tables.crm.legacy_note SET IGNORE
```

## See also

[SHOW MODEL](../commands/show-model.md) · [ALTER TABLE ... RENAME TO](../commands/alter-table-rename.md) · [ALTER TABLE ... NORMALISE](../commands/alter-table-normalise.md) · [CREATE ENTITY](../commands/create-entity.md)
