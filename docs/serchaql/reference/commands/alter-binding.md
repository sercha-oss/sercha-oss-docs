---
title: "ALTER BINDING"
description: "Tune a binding: an extraction hint, a document window, or pruning old generations."
---

# ALTER BINDING

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Changes how a binding extracts. A binding is named `<corpus>.<ontology>`.

## Syntax

```text
ALTER BINDING <corpus>.<ontology> SET HINT ON <op> WHERE ROOT = <Root>[.<Child>] AS '<hint>'
ALTER BINDING <corpus>.<ontology> SET WINDOW [ SINCE '<date>' ] [ OBJECTS ( '<object>' [, ...] ) ]
ALTER BINDING <corpus>.<ontology> DROP WINDOW
ALTER BINDING <corpus>.<ontology> PRUNE GENERATIONS
```

## Parameters

| Parameter | Description |
|---|---|
| `SET HINT ON <op>` | Adds instructions to one extraction step's prompt. `<op>` is `extract_internals` (reading entities out of a document) or `materialise_external_edges` (linking across documents); other steps are refused. |
| `WHERE ROOT = <Root>` | The root entity whose documents the hint applies to. |
| `.<Child>` | For a root set to `EXTRACT PER CHILD` ([ALTER ENTITY](../commands/alter-entity.md)), the one child call the hint applies to. |
| `AS '<hint>'` | The instructions. |
| `SET WINDOW SINCE '<date>'` | Only documents whose source changed on or after this date are extracted. A date (`2026-01-01`) or an RFC 3339 time. |
| `SET WINDOW OBJECTS ( ... )` | Only documents made from these connector objects (such as `'lin_issue'`) are extracted. |
| `DROP WINDOW` | Clears the window: every document is extracted. |
| `PRUNE GENERATIONS` | Removes the graph left by superseded runs, keeping the current generation. Reports sealed runs, superseded runs and nodes trimmed. |

## Usage notes

- A hint makes a new pipeline version; it applies from the next [RUN BINDING](../commands/run-binding.md).
- `SET WINDOW` replaces the whole window: give `SINCE` and `OBJECTS` together to keep both. It needs at least one of them.
- The window applies to every later run. [ESTIMATE RUN BINDING](../commands/run-binding.md) shows what it lets through.

## Examples

```sql
ALTER BINDING books.finance SET HINT ON extract_internals WHERE ROOT = Invoice
  AS 'Totals are in the last table of the document. Ignore remittance slips.'
```

| result |
|---|
| hint set on books.finance (invocation=extract_internals:Invoice, pipeline_version=2c41...); run extraction with RUN BINDING to apply |

```sql
ALTER BINDING books.finance SET WINDOW SINCE '2026-01-01' OBJECTS ('invoice', 'credit_note');
ALTER BINDING books.finance DROP WINDOW;
ALTER BINDING books.finance PRUNE GENERATIONS;
```

## Not supported

```sql
-- Refused by the engine
ALTER BINDING books.finance SET WINDOW
```

```sql
-- Refused by the engine
ALTER BINDING books SET HINT ON extract_internals WHERE ROOT = Invoice AS 'x'
```

## See also

[BIND CORPUS](../commands/bind-corpus.md) · [RUN BINDING](../commands/run-binding.md) · [REBIND CORPUS](../commands/rebind-corpus.md) · [DROP RUN](../commands/drop-run.md)
