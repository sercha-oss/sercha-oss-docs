---
title: "CREATE STRUCTURE"
description: "Declare how a corpus's documents are organised into levels, by path or by an agent."
---

# CREATE STRUCTURE

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Declares a structure in an ontology: an ordered list of levels that places each document of a corpus, for example client, then document type, then the document itself. A corpus uses it with `ORGANISE BY STRUCTURE` in [CREATE CORPUS](../commands/create-corpus.md). Each document's place becomes its partition key, so a partition grant can cover one client or one document type.

## Syntax

```text
CREATE STRUCTURE <ontology>.<name> (
    <level> [, ...]
  )
  [ WITH CLEANUP [ DUPLICATES { ON | OFF } ]
                 [ SUPERSESSION { BY <property> | OFF } ]
                 [ ARCHIVE HIDDEN ] ]

<level> ::= <name> KEY FROM source_path LEVEL <n> [ AS ENTITY <Entity> ( <columns> ) ]
          | <name> AGENT '<definition>' [ MIN CONFIDENCE <number> ] [ AS ENTITY <Entity> ( <columns> ) ]
          | <name> CHOICE ( <choice> [, ...] ) [ HINT '<text>' ] [ MIN CONFIDENCE <number> ]
                   [ AS ENTITY <Entity> ( <columns> ) ]
          | <name> LEAF

<choice> ::= '<value>' [ DESC '<description>' ] [ ( <choice> [, ...] ) ]
```

## Parameters

| Parameter | Description |
|---|---|
| `<ontology>.<name>` | The ontology and the structure's name. Structures share the ontology's names with entities. |
| `KEY FROM source_path LEVEL <n>` | The level's value is the folder at depth `<n>` of the document's path in its source. `source_path` is the only source. |
| `AGENT '<definition>'` | An agent reads the document and names its group at this level, guided by the definition. |
| `CHOICE ( ... )` | An agent picks one value from a closed list. Nested lists make deeper levels from one declaration. `DESC` describes a value to the agent. |
| `HINT '<text>'` | For a `CHOICE` level, how to choose between the values. |
| `MIN CONFIDENCE <number>` | Below this confidence, a judged placement goes to review instead of being applied. Between 0 (exclusive) and 1. Default 0.6. |
| `LEAF` | The document itself. Required, and must be the last level. |
| `AS ENTITY <Entity> ( <columns> )` | The groups at this level become rows of a pack entity with these columns. Not on `LEAF`, and no `KEY ( ... )` list: a pack row is identified by its group. |
| `WITH CLEANUP` | Turns on cleanup of the organised corpus. `DUPLICATES ON` (the default) flags duplicate documents. `SUPERSESSION BY <property>` flags documents replaced by a newer one, judged by that property; `SUPERSESSION OFF` turns it off. `ARCHIVE HIDDEN` is the only archive mode. |

## Usage notes

- A structure needs at least one non-leaf level and exactly one `LEAF`, last. Level names must be unique.
- `KEY` levels are read from the path before any agent runs, so they must come before every `AGENT` and `CHOICE` level.
- Columns of a pack entity are changed by dropping and creating the structure again; `ALTER ENTITY` refuses them.

## Examples

```sql
CREATE STRUCTURE finance.filing (
  client KEY FROM source_path LEVEL 1 AS ENTITY Client (
    name TEXT EXTRACT 'The client name'
  ),
  doc_type CHOICE (
    'financials' DESC 'Statutory and management accounts' (
      'profit-and-loss',
      'balance-sheet'
    ),
    'tax',
    'correspondence'
  ) HINT 'Decide by what the document is, not by its file name.' MIN CONFIDENCE 0.7,
  document LEAF
) WITH CLEANUP DUPLICATES ON SUPERSESSION BY issued_on;
```

An agent-judged level:

```sql
CREATE STRUCTURE finance.by_matter (
  matter AGENT 'The legal matter or engagement the document belongs to' MIN CONFIDENCE 0.8,
  document LEAF
);
```

## Not supported

| Refused | Write instead |
|---|---|
| `KEY FROM` anything but `source_path` | `KEY FROM source_path LEVEL <n>`, or an `AGENT` level |
| `ARCHIVE VISIBLE` | `ARCHIVE HIDDEN` |
| `AS ENTITY` on `LEAF` | Extract the document level with entities |
| An empty `CHOICE ()` | List at least one value |

```sql
-- Refused by the engine
CREATE STRUCTURE finance.filing (client KEY FROM title LEVEL 1, document LEAF)
```

```sql
-- Refused by the engine
CREATE STRUCTURE finance.filing (client KEY FROM source_path LEVEL 1, document LEAF) WITH CLEANUP ARCHIVE VISIBLE
```

## See also

[CREATE CORPUS](../commands/create-corpus.md) · [DROP STRUCTURE](../commands/drop-structure.md) · [CREATE ONTOLOGY](../commands/create-ontology.md) · [GRANT](../commands/grant.md)
