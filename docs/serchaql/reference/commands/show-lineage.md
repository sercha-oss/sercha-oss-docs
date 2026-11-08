---
title: "SHOW LINEAGE"
description: "The rows a model record was made from, or the records built from one row."
---

# SHOW LINEAGE

[Commands › Looking around](../commands.md#looking-around) · Any caller; rows they are not granted never appear

Walks a record through the layers. `DOWN` (the default) starts from a model record and lists the cleaned rows, source rows and original items it was made from. `UP` starts from one row of a table and lists the model records built from it.

## Syntax

```text
SHOW LINEAGE OF <Entity> '<key>' [ DOWN | UP ]

SHOW LINEAGE OF <Entity> IN ( '<key>' [, ...] ) [ DOWN ]

SHOW LINEAGE OF <table> '<row id>' UP
```

## Parameters

| Parameter | Description |
|---|---|
| `<Entity>` | A model entity with records of its own. |
| `'<key>'` | The record's key, quoted. |
| `IN ( '<key>', ... )` | Several records walked down together: the traced body runs once for all of them. Each record's first rows carry its key in `via`. |
| `<table>` | `tables.<source>.<table>`, `clean.<source>.<table>`, `data.<table>` or `<corpus>.<Entity>`. A walk from a table goes `UP` only. |
| `'<row id>'` | The row's id: a source row's `_source_key` or `_id`, a cleaned group's `_id`. |

## Usage notes

- Columns: `layer`, `table`, `row_id`, `source_key`, `via`, `title`. `layer` is `record` (a model record), `cleaned` (a `clean.` group), `source` (a landed row), `original` (the item as the source sent it: read it with [SHOW RAW](../commands/show-raw.md)) or `untraced`.
- `DOWN` rewrites the entity's body so every table it reads carries its row ids out, through derived tables, CTEs and set operations, and filters it to the key. A body that cannot be traced gives one `untraced` row saying why.
- `UP` runs the same rewritten bodies the other way, for every entity that reads the row's table (or the cleaned group the row belongs to), and then the entities built on those.
- A walk reads at most 10000 rows per step and follows at most four levels of entities built on entities.
- The MCP `query` tool runs this statement.
- `SHOW LINEAGE OF '<_id>'`, with no entity or table, parses but is not implemented.

## Examples

```sql
SHOW LINEAGE OF Order 'PO-1042'
```

| layer | table | row_id | source_key | via | title |
|---|---|---|---|---|---|
| record | Order | PO-1042 | | | PO-1042 |
| source | tables.drive.file | f_88 | drive:file:f_88 | | po-1042.pdf |
| original | tables.drive.file | f_88 | drive:file:f_88 | | |

Several records at once:

```sql
SHOW LINEAGE OF Order IN ('PO-1042', 'PO-1017') DOWN
```

From one landed row up to what was built from it:

```sql
SHOW LINEAGE OF tables.crm.account 'crm:account:0017' UP
```

## Not supported

| Refused | Write instead |
|---|---|
| `IN (...)` with `UP` | Walk up from one row: `SHOW LINEAGE OF <table> '<row id>' UP` |

```sql
-- Refused by the engine
SHOW LINEAGE OF Order IN ('PO-1042', 'PO-1017') UP
```

## See also

[SHOW RAW](../commands/show-raw.md) · [SHOW LINKS](../commands/show-links.md) · [SHOW MODEL](../commands/show-model.md) · [CREATE ENTITY](../commands/create-entity.md) · [ALTER TABLE ... NORMALISE](../commands/alter-table-normalise.md)
