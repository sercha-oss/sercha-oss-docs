---
title: "ALTER TABLE ... RENAME TO"
description: "Give a stored table a layer name, tables.<source>.<table> or clean.<source>.<table>."
---

# ALTER TABLE ... RENAME TO

[Commands › Tables](../commands.md#tables) · Admins only, through `sercha_define` or a tenant file

Gives a stored table a layer name, so queries read it as `tables.<source>.<table>`: the faithful form of a source. The name is a catalogue entry. Nothing is copied, and the stored name keeps working beside the new one while readers move over.

## Syntax

```text
ALTER TABLE <stored table> RENAME TO <layer name>
ALTER TABLE <layer name> RENAME TO <other layer name>
ALTER TABLE <layer name> RENAME TO <stored table>
```

## Parameters

| Parameter | Description |
|---|---|
| `<stored table>` | A dataset table, `data.<table>`, or an extracted entity, `<corpus>.<Entity>`. |
| `<layer name>` | `tables.<source>.<table>` or `clean.<source>.<table>`. A link table may also be named `links.<name>`. |

## Usage notes

- A stored table to a layer name: the layer name now reads the table. Renaming it again to the same table is a no-op; a layer name that already names another table is refused.
- A layer name to another layer name: the name moves.
- A layer name back to the table it names: the layer name is removed and the table keeps its stored name.
- Two stored names are refused: a stored table keeps its name.
- [NORMALISE](../commands/alter-table-normalise.md) works only on a `tables.` name, so name a table here before cleaning it.

## Examples

```sql
ALTER TABLE data.crm_account RENAME TO tables.crm.account
```

| result |
|---|
| data.crm_account is now tables.crm.account |

Then:

```sql
SELECT a.name, a.region FROM tables.crm.account a WHERE a.region = 'north'
```

Remove the layer name again:

```sql
ALTER TABLE tables.crm.account RENAME TO data.crm_account
```

## Not supported

| Refused | Write instead |
|---|---|
| An unqualified table name | `data.<table>`, `<corpus>.<Entity>` or `tables.<source>.<table>` |
| `tables.<source>` without a table | `tables.<source>.<table>` |

```sql
-- Refused by the engine
ALTER TABLE crm_account RENAME TO tables.crm.account
```

```sql
-- Refused by the engine
ALTER TABLE data.crm_account RENAME TO tables.crm
```

## See also

[ALTER TABLE ... NORMALISE](../commands/alter-table-normalise.md) · [ALTER TABLE ... MODEL IGNORE](../commands/alter-table-model-ignore.md) · [REFRESH TABLE](../commands/refresh-table.md) · [FROM](../clauses/from.md) · [SHOW](../commands/show.md)
