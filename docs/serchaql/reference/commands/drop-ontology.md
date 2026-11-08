---
title: "DROP ONTOLOGY"
description: "Remove an ontology and everything declared in it."
---

# DROP ONTOLOGY

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Removes an ontology with its entities, edges and their properties.

## Syntax

```text
DROP ONTOLOGY [ IF EXISTS ] <name> [ CASCADE | RESTRICT ]
```

## Parameters

| Parameter | Description |
|---|---|
| `IF EXISTS` | No error when there is no such ontology. |
| `<name>` | The ontology. |
| `CASCADE`, `RESTRICT` | Accepted and ignored. The ontology's entities and edges are always removed with it. |

## Usage notes

- `RESTRICT` does not stop the drop when the ontology has entities. Check with `SHOW` first.
- Unbind any corpus from the ontology first ([UNBIND CORPUS](../commands/unbind-corpus.md)).
- To remove one entity, use `DROP ENTITY <ontology>.<Entity>`, which does refuse when edges depend on it unless you add `CASCADE`. See [DROP ENTITY](../commands/drop-entity.md).

## Examples

```sql
DROP ONTOLOGY IF EXISTS finance
```

| result |
|---|
| ontology "finance" dropped |

## See also

[CREATE ONTOLOGY](../commands/create-ontology.md) · [DROP ENTITY](../commands/drop-entity.md) · [UNBIND CORPUS](../commands/unbind-corpus.md)
