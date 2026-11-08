---
title: "BIND CORPUS"
description: "Bind a corpus to an ontology so extraction reads its documents."
---

# BIND CORPUS

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Binds a corpus to an ontology. The binding is what extraction runs: it pins a frozen version of the ontology and, unless told otherwise, starts a first run over the corpus's documents. A binding is named `<corpus>.<ontology>` in the statements that act on it.

## Syntax

```text
BIND CORPUS <corpus> TO ONTOLOGY <ontology> [ WITHOUT RUN ]
```

## Parameters

| Parameter | Description |
|---|---|
| `<corpus>` | The corpus. |
| `<ontology>` | The ontology. |
| `WITHOUT RUN` | Binds without the first run. Use it to set a window ([ALTER BINDING ... SET WINDOW](../commands/alter-binding.md)) or check the cost ([ESTIMATE RUN BINDING](../commands/run-binding.md)) before anything is extracted. |

## Usage notes

- A corpus has at most one binding. A second `BIND` is an error; use [REBIND CORPUS](../commands/rebind-corpus.md) to change the version.
- `CREATE CORPUS ... USING ONTOLOGY` binds as it creates, with a first run.

## Examples

```sql
BIND CORPUS books TO ONTOLOGY finance WITHOUT RUN;
ALTER BINDING books.finance SET WINDOW SINCE '2026-01-01';
ESTIMATE RUN BINDING books.finance LIMIT 50;
RUN BINDING books.finance LIMIT 50;
```

| result |
|---|
| corpus "books" bound to ontology "finance" (binding_id=8c2d...:finance); nothing extracted yet (RUN BINDING books.finance starts it) |

## Not supported

```sql
-- Refused by the engine
BIND CORPUS books TO finance
```

## See also

[CREATE CORPUS](../commands/create-corpus.md) · [UNBIND CORPUS](../commands/unbind-corpus.md) · [REBIND CORPUS](../commands/rebind-corpus.md) · [RUN BINDING](../commands/run-binding.md) · [ALTER BINDING](../commands/alter-binding.md)
