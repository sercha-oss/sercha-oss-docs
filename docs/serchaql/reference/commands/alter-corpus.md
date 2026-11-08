---
title: "ALTER CORPUS"
description: "Recompute a corpus's partition keys, or attach and detach dataset tables."
---

# ALTER CORPUS

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Changes a corpus after it is created.

## Syntax

```text
ALTER CORPUS <name> REPARTITION
ALTER CORPUS <name> { ATTACH | DETACH } DATASET data.<table>
ALTER CORPUS <name> ADD PATH '<path>'
```

## Parameters

| Parameter | Description |
|---|---|
| `REPARTITION` | Recomputes every document's folder partition key from the corpus's `LEVEL`, and reports how many membership rows it rewrote. |
| `ATTACH DATASET data.<table>` | Attaches a dataset table to the corpus: anyone with `SELECT` on the corpus can then read the table. The table must exist. |
| `DETACH DATASET data.<table>` | Removes the attachment. Detaching a table that is not attached is an error. |
| `ADD PATH '<path>'` | Parsed, but refused when it runs: add a folder to a corpus through the REST API. |

## Usage notes

- A corpus's organisation is fixed when it is created. `ALTER CORPUS <name> ORGANISE BY ...` parses so it can be refused by name; drop and re-create the corpus to change it.
- Attaching is the way to give a corpus's readers the dataset tables made from the same documents, without a grant per table.

## Examples

```sql
ALTER CORPUS books ATTACH DATASET data.invoices
```

| result |
|---|
| dataset data.invoices attached to corpus books: SELECT on the corpus now reads it |

```sql
ALTER CORPUS books REPARTITION
```

| result |
|---|
| corpus "books" repartitioned (214 membership rows rewritten, level 2) |

```sql
ALTER CORPUS books DETACH DATASET data.invoices
```

## Not supported

| Refused | Write instead |
|---|---|
| `ALTER CORPUS ... ORGANISE BY` (refused when it runs) | `DROP CORPUS`, then `CREATE CORPUS ... ORGANISE BY STRUCTURE` |
| `ALTER CORPUS ... ADD PATH` (refused when it runs) | The REST API |
| `ATTACH DATASET` on a name outside `data.` | `data.<table>` |

```sql
-- Refused by the engine
ALTER CORPUS books ATTACH DATASET tables.crm.account
```

```sql
-- Refused by the engine
ALTER CORPUS books RENAME TO ledger
```

## See also

[CREATE CORPUS](../commands/create-corpus.md) · [DROP CORPUS](../commands/drop-corpus.md) · [GRANT](../commands/grant.md)
