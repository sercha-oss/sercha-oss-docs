---
title: "DROP CORPUS"
description: "Remove a corpus with its bindings, extracted graph, grants and the documents only it claimed."
---

# DROP CORPUS

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Removes a corpus. Its bindings, memberships, extracted graph, corpus grants and partition grants go with it, and so do documents no other corpus claims.

## Syntax

```text
DROP CORPUS [ IF EXISTS ] <name> [ CASCADE | RESTRICT ]
```

## Parameters

| Parameter | Description |
|---|---|
| `IF EXISTS` | No error when there is no such corpus. |
| `<name>` | The corpus. |
| `CASCADE`, `RESTRICT` | Accepted and ignored. The drop always removes everything listed above. |

## Usage notes

- Documents still claimed by another corpus are kept, and so are pushed documents.
- When the document purge fails partway, the corpus is kept so the drop can be repeated to finish it.

## Examples

```sql
DROP CORPUS IF EXISTS books
```

| result |
|---|
| corpus "books" dropped |

## See also

[CREATE CORPUS](../commands/create-corpus.md) · [UNBIND CORPUS](../commands/unbind-corpus.md) · [DROP STRUCTURE](../commands/drop-structure.md)
