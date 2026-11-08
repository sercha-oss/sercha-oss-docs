---
title: "CREATE ONTOLOGY"
description: "Create an ontology, the set of entities to extract from documents."
---

# CREATE ONTOLOGY

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Creates an empty ontology. An ontology holds the entities ([CREATE ENTITY](../commands/create-extracted-entity.md)), edges, record types and structures that extraction reads out of a corpus's documents. This is the older document-extraction layer; new work usually lands documents as tables and builds the model over them with [CREATE ENTITY](../commands/create-entity.md) and [CREATE RELATION](../commands/create-relation.md).

## Syntax

```text
CREATE ONTOLOGY <name>
```

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | The ontology's name. Entities in it are named `<name>.<Entity>`. |

## Usage notes

- A second ontology of the same name is an error.
- The ontology is a draft until a corpus is bound to it. [BIND CORPUS](../commands/bind-corpus.md) and [REBIND CORPUS](../commands/rebind-corpus.md) freeze the draft as a numbered version, which extraction then uses.
- Extracted rows are read from the corpus, not the ontology: `SELECT ... FROM <corpus>.<Entity>`.

## Examples

```sql
CREATE ONTOLOGY finance;
CREATE ENTITY finance.Invoice (
  invoice_no TEXT KEY EXTRACT 'The invoice number as printed',
  total NUMERIC EXTRACT 'The invoice total including tax'
) ROOT;
```

| result |
|---|
| ontology "finance" created (id=finance) |

## See also

[CREATE ENTITY (extraction)](../commands/create-extracted-entity.md) · [CREATE EDGE (ontology)](../commands/create-ontology-edge.md) · [CREATE CORPUS](../commands/create-corpus.md) · [BIND CORPUS](../commands/bind-corpus.md) · [DROP ONTOLOGY](../commands/drop-ontology.md)
