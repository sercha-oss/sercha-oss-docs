---
title: "CREATE CORPUS"
description: "Collect documents from source folders into a corpus, optionally partitioned and bound to an ontology."
---

# CREATE CORPUS

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Creates a corpus: a named set of documents claimed from one or more folders of connected sources. Bound to an ontology, a corpus is what extraction reads, and its entities are queried as `<corpus>.<Entity>`.

## Syntax

```text
CREATE CORPUS <name>
  ON <connector>.<source>.<path> [, ...]
  [ USING ONTOLOGY <ontology> ]
  [ PARTITION BY { FOLDER [ LEVEL <n> ] | GROUP "<field>" } ]
  [ ORGANISE BY STRUCTURE <ontology>.<structure> ]

<path> ::= <segment> [ .<segment> ... ]
```

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | The corpus name, used in queries (`FROM books.Invoice`) and grants. `plugins` is reserved. |
| `<connector>` | The source's connector type, such as `drive` or `sharepoint`. Matched without regard to case. |
| `<source>` | The source's name, matched exactly. Quote it when it has spaces: `"Company Drive"`. |
| `<path>` | The container path inside the source, one segment per folder. It must be a container authorised for the source, or a folder inside one. Quote a segment with spaces or dots. |
| `USING ONTOLOGY <ontology>` | Binds the corpus to the ontology as it is created, which starts an extraction run, as [BIND CORPUS](../commands/bind-corpus.md) does. |
| `PARTITION BY FOLDER [ LEVEL <n> ]` | Each document's partition key is its folder path down to depth `<n>` under the claimed container. `LEVEL` defaults to 1. |
| `PARTITION BY GROUP "<field>"` | Each document's partition key is the value of a label the document carries, for pushed documents with no folders. The field name must be quoted. |
| `ORGANISE BY STRUCTURE <ontology>.<structure>` | Each document's partition key is its place in the structure ([CREATE STRUCTURE](../commands/create-structure.md)). Needs `USING ONTOLOGY` naming the same ontology. After `PARTITION BY GROUP`, the group becomes the first segment of the key. |

## Usage notes

- A corpus may claim folders from several sources and connectors at once.
- Partition keys are what `GRANT ... ON CORPUS <name> PARTITION '<key>'` covers. See [GRANT](../commands/grant.md).
- A corpus's organisation is fixed when it is created: `ALTER CORPUS ... ORGANISE BY` is refused. [ALTER CORPUS ... REPARTITION](../commands/alter-corpus.md) recomputes folder keys.
- The creator receives grants on the new corpus; others need [GRANT](../commands/grant.md).

## Examples

```sql
CREATE CORPUS books
  ON drive."Company Drive"."Finance"."Invoices"
  USING ONTOLOGY finance
  PARTITION BY FOLDER LEVEL 2;
```

| result |
|---|
| corpus "books" created (id=8c2d...) with 1 target(s) |

Two sources, organised by a structure inside each client group:

```sql
CREATE CORPUS filings
  ON drive."Company Drive"."Clients", sharepoint.records."Shared Documents"."Clients"
  USING ONTOLOGY finance
  PARTITION BY GROUP "client"
  ORGANISE BY STRUCTURE finance.filing;
```

## Not supported

| Refused | Write instead |
|---|---|
| A target without a container path | `<connector>.<source>.<path>` |
| `LEVEL` with `GROUP`, or without `PARTITION BY FOLDER` | `PARTITION BY FOLDER LEVEL <n>` |
| `PARTITION BY FOLDER` with `ORGANISE BY STRUCTURE` | `PARTITION BY GROUP` with it, or a `KEY FROM source_path` level in the structure |
| `ORGANISE BY` before `PARTITION BY` | `PARTITION BY GROUP "<field>" ORGANISE BY STRUCTURE ...` |
| An unquoted `GROUP` field | `GROUP "client"` |

```sql
-- Refused by the engine
CREATE CORPUS books ON drive."Company Drive" USING ONTOLOGY finance
```

```sql
-- Refused by the engine
CREATE CORPUS books ON drive."Company Drive"."Finance" PARTITION BY FOLDER ORGANISE BY STRUCTURE finance.filing
```

```sql
-- Refused by the engine
CREATE CORPUS books ON drive."Company Drive"."Finance" PARTITION BY GROUP client
```

## See also

[ALTER CORPUS](../commands/alter-corpus.md) · [DROP CORPUS](../commands/drop-corpus.md) · [BIND CORPUS](../commands/bind-corpus.md) · [CREATE STRUCTURE](../commands/create-structure.md) · [GRANT](../commands/grant.md) · [RUN BINDING](../commands/run-binding.md)
