---
title: "UNBIND CORPUS"
description: "Remove a corpus's binding to an ontology."
---

# UNBIND CORPUS

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Removes the binding between a corpus and an ontology. Extraction no longer runs for it.

## Syntax

```text
UNBIND CORPUS <corpus> FROM ONTOLOGY <ontology>
```

## Parameters

| Parameter | Description |
|---|---|
| `<corpus>` | The corpus. |
| `<ontology>` | The ontology it is bound to. |

## Usage notes

- The corpus and the ontology both stay. Bind again with [BIND CORPUS](../commands/bind-corpus.md).

## Examples

```sql
UNBIND CORPUS books FROM ONTOLOGY finance
```

| result |
|---|
| corpus "books" unbound from ontology "finance" |

## Not supported

```sql
-- Refused by the engine
UNBIND CORPUS books TO ONTOLOGY finance
```

## See also

[BIND CORPUS](../commands/bind-corpus.md) · [REBIND CORPUS](../commands/rebind-corpus.md) · [DROP CORPUS](../commands/drop-corpus.md)
