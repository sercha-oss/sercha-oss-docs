---
title: "RUN BINDING"
description: "Start an extraction run over a binding's documents, or estimate one."
---

# RUN BINDING

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Queues an extraction run for a binding: the ontology's entities are read out of the corpus's documents. `ESTIMATE RUN BINDING` reports what the run would read and a rough token count, and runs nothing.

## Syntax

```text
[ ESTIMATE ] RUN BINDING <corpus>.<ontology>
  [ WHERE document_id = '<id>' ]
  [ EXTRACT ( <Entity>.<column> [, ...] ) ]
  [ LIMIT <n> ]
```

## Parameters

| Parameter | Description |
|---|---|
| `ESTIMATE` | Report the run's scope and cost instead of running it. |
| `<corpus>.<ontology>` | The binding. |
| `WHERE document_id = '<id>'` | Run one document only. |
| `EXTRACT ( ... )` | Accepted, but not acted on yet: the whole run happens and the result says so. |
| `LIMIT <n>` | At most `<n>` documents within the window, the most recently changed first. Not with `WHERE document_id`. |

## Usage notes

- The run is queued; the result gives its id. Follow it with `SHOW RUNS`, stop it with [CANCEL RUN](../commands/cancel-run.md).
- Only documents inside the binding's window ([ALTER BINDING ... SET WINDOW](../commands/alter-binding.md)) are extracted.
- Start small on a large source: `LIMIT 20`, check the rows, then a full run.
- `ESTIMATE` returns `documents`, `in_window`, `window`, `avg_chars`, `est_input_tokens`, `est_output_tokens` and `basis`. It reads the content of up to 200 documents and extrapolates past that, assuming two model passes per document, about 3,000 prompt tokens and 550 output tokens a document, and 4 characters a token.

## Examples

```sql
RUN BINDING books.finance LIMIT 20
```

| result |
|---|
| run 5e7a... queued (corpus=books, ontology=finance, trigger=manual), 20 of 640 documents in the window, the most recently changed |

```sql
ESTIMATE RUN BINDING books.finance
```

| documents | in_window | window | avg_chars | est_input_tokens | est_output_tokens | basis |
|---|---|---|---|---|---|---|
| 640 | 640 | changed since 2026-01-01 | 1800 | 2496000 | 352000 | content read for 200 of 640 documents; ... |

One document:

```sql
RUN BINDING books.finance WHERE document_id = 'doc_8f21c0'
```

## Not supported

```sql
-- Refused by the engine
RUN BINDING books.finance WHERE document_id = 'doc_8f21c0' LIMIT 5
```

```sql
-- Refused by the engine
RUN BINDING books.finance LIMIT 0
```

## See also

[BIND CORPUS](../commands/bind-corpus.md) · [ALTER BINDING](../commands/alter-binding.md) · [CANCEL RUN](../commands/cancel-run.md) · [DROP RUN](../commands/drop-run.md) · [REBIND CORPUS](../commands/rebind-corpus.md)
