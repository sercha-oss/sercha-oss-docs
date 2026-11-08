---
title: "REBIND CORPUS"
description: "Move a corpus's binding to a new or earlier frozen version of its ontology."
---

# REBIND CORPUS

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Points a corpus's binding at another version of its ontology. Without a version, the ontology's current draft is frozen as a new version first, which is how edits made since the last freeze (new entities, changed columns, new edges) reach extraction.

## Syntax

```text
REBIND CORPUS <corpus> TO <ontology> [ @ { <version> | latest } ]
```

## Parameters

| Parameter | Description |
|---|---|
| `<corpus>` | The corpus. |
| `<ontology>` | The ontology. Note there is no `ONTOLOGY` keyword here, unlike `BIND`. |
| `@<version>` | An existing frozen version by number, for example to roll back. |
| `@latest` | The newest version already frozen. It does not freeze the draft. |

## Usage notes

- **A REBIND hides the corpus's rows until the next run completes.** Queries over `<corpus>.<Entity>` return nothing between the rebind and the end of the next [RUN BINDING](../commands/run-binding.md), and there is no rollback in between. Run the binding straight after, and rebind when an empty result is acceptable.
- The statement does not start a run.

## Examples

```sql
REBIND CORPUS books TO finance;
RUN BINDING books.finance;
```

| result |
|---|
| corpus "books" rebound to ontology "finance" version=4 pipeline_version=1b9e...; run extraction with RUN BINDING to apply |

Roll back to version 3:

```sql
REBIND CORPUS books TO finance@3
```

## Not supported

```sql
-- Refused by the engine
REBIND CORPUS books TO ONTOLOGY finance
```

## See also

[BIND CORPUS](../commands/bind-corpus.md) · [RUN BINDING](../commands/run-binding.md) · [ALTER ENTITY](../commands/alter-entity.md) · [CREATE ENTITY (extraction)](../commands/create-extracted-entity.md)
