---
title: "DROP STRUCTURE"
description: "Remove a structure and its pack entities, unless a corpus is organised by it."
---

# DROP STRUCTURE

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Removes a structure and the pack entities its `AS ENTITY` levels declared.

## Syntax

```text
DROP STRUCTURE [ IF EXISTS ] <ontology>.<name> [ RESTRICT ]
```

## Parameters

| Parameter | Description |
|---|---|
| `IF EXISTS` | No error when there is no such structure. |
| `<ontology>.<name>` | The structure. Must be qualified. |
| `RESTRICT` | The only behaviour; accepted for clarity. |

## Usage notes

- A structure that any corpus is organised by is refused. Drop or re-create those corpora first.
- There is no `CASCADE`: a schema change never drops a corpus.

## Examples

```sql
DROP STRUCTURE IF EXISTS finance.filing
```

| result |
|---|
| structure finance.filing dropped (with pack entity(ies) Client) |

## Not supported

```sql
-- Refused by the engine
DROP STRUCTURE finance.filing CASCADE
```

## See also

[CREATE STRUCTURE](../commands/create-structure.md) · [DROP CORPUS](../commands/drop-corpus.md)
