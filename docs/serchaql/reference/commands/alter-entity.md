---
title: "ALTER ENTITY"
description: "Change an extraction entity's columns, description, natural key or sensitivity."
---

# ALTER ENTITY

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Changes an entity of an ontology after it is created. Most forms change the ontology draft and reach extraction after the next [REBIND CORPUS](../commands/rebind-corpus.md) and [RUN BINDING](../commands/run-binding.md); `ALTER COLUMN ... SENSITIVE` applies at once.

## Syntax

```text
ALTER ENTITY <ontology>.<Entity> ADD COLUMN <column> <type> [ <column option> ... ]
ALTER ENTITY <ontology>.<Entity> DROP COLUMN <column>
ALTER ENTITY <ontology>.<Entity> ALTER COLUMN <column> { SET | DROP } SENSITIVE
ALTER ENTITY <ontology>.<Entity> SET DESCRIPTION '<text>'
ALTER ENTITY <ontology>.<Entity> SET EXTRACT PER CHILD [ ON | OFF ]
ALTER ENTITY <ontology>.<Entity> SET NATURAL KEY ( <column> [, ...] ) VALIDATE ON CORPUS <corpus>
ALTER ENTITY <ontology>.<Entity> DROP NATURAL KEY
```

## Parameters

| Parameter | Description |
|---|---|
| `ADD COLUMN` | Adds a column, written as in [CREATE ENTITY (extraction)](../commands/create-extracted-entity.md). Instances already extracted have no value for it until they are extracted again. |
| `DROP COLUMN` | Removes a column. Data extracted under older versions is kept. |
| `ALTER COLUMN ... SET SENSITIVE` | Masks the column for callers not cleared for sensitive values. Applies now, with no new version and no re-extraction. `DROP SENSITIVE` lifts it. |
| `SET DESCRIPTION '<text>'` | What the entity means, shown to the extraction model beside its name. A root's description is where to say which children it needs ("Its children are LineItem entities, one per row"). Applies to the next run. |
| `SET EXTRACT PER CHILD` | For a root only: extract each child entity in its own model call, each still reading the whole document. Useful when a document holds several unrelated tables. `OFF` turns it off; `ON` is the default. |
| `SET NATURAL KEY ( ... ) VALIDATE ON CORPUS <corpus>` | Declares the columns that identify one instance across documents, used to attach ledger records. The engine checks the corpus's extracted rows first and refuses the key when any two rows share it, or when there are no rows with every key column filled. |
| `DROP NATURAL KEY` | Removes the natural key. Ledger records already attached keep their stored keys. |

## Usage notes

- The name must be qualified: `ALTER ENTITY finance.Invoice ...`.
- `ADD COLUMN` and `DROP COLUMN` are refused on a pack entity declared by a structure's `AS ENTITY`; change the structure instead.
- A query-derived entity has no extracted rows, so `SET NATURAL KEY` is refused on it.
- `SET DESCRIPTION` replaces the `LAZY` marker, which is stored in the same place.

## Examples

```sql
ALTER ENTITY finance.Invoice ADD COLUMN due_on DATE EXTRACT 'The date payment is due';
ALTER ENTITY finance.Invoice ALTER COLUMN bank_account SET SENSITIVE;
ALTER ENTITY finance.Invoice SET DESCRIPTION 'A tax invoice from a supplier. Its children are LineItem entities, one per charged line.';
```

| result |
|---|
| entity finance.Invoice: column "due_on" added (never extracts; backfill explicit) |
| entity finance.Invoice: column "bank_account" is sensitive; applies now (no new version, no re-extraction) |
| entity finance.Invoice: description set (91 chars); applies to the next run |

```sql
ALTER ENTITY finance.Invoice SET NATURAL KEY (invoice_no, supplier) VALIDATE ON CORPUS books
```

| result |
|---|
| entity finance.Invoice: natural key (invoice_no, supplier) declared; validated 412 rows == 412 distinct keys in corpus books |

```sql
ALTER ENTITY finance.Invoice SET EXTRACT PER CHILD;
ALTER ENTITY finance.Invoice DROP COLUMN due_on;
ALTER ENTITY finance.Invoice DROP NATURAL KEY;
```

## Not supported

| Refused | Write instead |
|---|---|
| An unqualified name | `<ontology>.<Entity>` |
| `SET NATURAL KEY` without `VALIDATE ON CORPUS` | Name the corpus to check against |
| `ALTER COLUMN ... TYPE` or `RENAME` | `DROP COLUMN`, then `ADD COLUMN` |

```sql
-- Refused by the engine
ALTER ENTITY finance.Invoice SET NATURAL KEY (invoice_no)
```

```sql
-- Refused by the engine
ALTER ENTITY finance.Invoice ALTER COLUMN total TYPE INTEGER
```

## See also

[CREATE ENTITY (extraction)](../commands/create-extracted-entity.md) · [DROP ENTITY](../commands/drop-entity.md) · [REBIND CORPUS](../commands/rebind-corpus.md) · [RUN BINDING](../commands/run-binding.md)
