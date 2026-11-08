---
title: "SHOW"
description: "List the objects of one kind: corpora, tables, datasets, views, tools, edges, runs and more."
---

# SHOW

[Commands › Looking around](../commands.md#looking-around) · Any caller; rows they are not granted never appear

Lists objects of one kind, one row per object. Any signed-in caller may run a listing, and it names only what the caller may read: a corpus, and anything bound to it, appears only when the caller may read that corpus. `SHOW AUDIT` is the exception: it is for admins only.

## Syntax

```text
SHOW { CORPUSES | CORPORA | CORPUS }
SHOW { TABLES | TABLE }
SHOW { DATASETS | DATASET }
SHOW { ENTITIES | ENTITY } { IN | ON } [ CORPUS ] <corpus>
SHOW { ENTITIES | ENTITY } { IN | ON } ONTOLOGY <ontology>
SHOW { ONTOLOGIES | ONTOLOGY }
SHOW ONTOLOGY <ontology>
SHOW { VIEWS | VIEW }
SHOW MATERIALIZED VIEWS
SHOW TOOLS
SHOW EDGES
SHOW PEOPLE
SHOW KINDS
SHOW { BINDINGS | BINDING } [ ON CORPUS <corpus> ]
SHOW { STRUCTURES | STRUCTURE } [ ON ONTOLOGY <ontology> ]
SHOW { RUNS | RUN } [ ON BINDING <corpus>.<ontology> ]
SHOW DAG ON BINDING <corpus>.<ontology>
SHOW HINTS ON BINDING <corpus>.<ontology>
SHOW AUDIT [ FOR USER <id or email> ] [ FOR SESSION '<id>' ] [ SINCE '<time>' ] [ ERRORS ] [ DENIED ] [ LIMIT <n> ]
```

The model forms have pages of their own: [SHOW MODEL](../commands/show-model.md), [SHOW LINKS](../commands/show-links.md), [SHOW LINEAGE](../commands/show-lineage.md), [SHOW RAW](../commands/show-raw.md) and [SHOW RECORDS](../commands/show-records.md).

## Parameters

| Form | Lists |
|---|---|
| `SHOW CORPUSES` | The corpora: `id`, `name`, `created_at`, `archived`. |
| `SHOW TABLES` | Every name a query can read: `table`, `kind` (`entity`, `dataset`, `tables`, `clean`, `view`), `description`. |
| `SHOW DATASETS` | The dataset tables, `data.<table>`: `dataset`, `description`, `columns`, `column_comments`, `attached_to`, `origin`, `keys` and more. |
| `SHOW ENTITIES IN <corpus>` | The extracted entities of a corpus: `entity`, `description`, `is_root`, `parent`, `row_count`, `edges`. `IN ONTOLOGY <ontology>` lists an ontology's entities instead. |
| `SHOW ONTOLOGIES` | The ontologies: `id`, `name`, `description`, `created_at`. `SHOW ONTOLOGY <name>` lists that ontology's entities, as `SHOW ENTITIES IN ONTOLOGY` does. |
| `SHOW VIEWS` | Views and materialized views: `name`, `owner`, `created_at`, `description`, `kind`, `managed_by`. A model entity's or relation's rows are a view, so they appear here too. |
| `SHOW MATERIALIZED VIEWS` | Materialized views only, with `latest_version`, `computed_at`, `auto_refresh` and `refresh_error`. |
| `SHOW TOOLS` | Saved tools: `name`, `description`, `parameters`, `managed_by`, `created_by`, `updated_at`. |
| `SHOW EDGES` | Declared edges between tables: `name`, `from`, `verb`, `to`, `rules`, `declared_by`, `rows_in`. |
| `SHOW PEOPLE` | The people declarations per source: `source`, `declared_by`, `table`, `keys`, `ref`, `tag`, `people_table`. |
| `SHOW KINDS` | The kinds of key a person is known by (`email`, `github_login` and others), which a people declaration tags its columns with: `kind`, `one_per_person`, `description`. |
| `SHOW BINDINGS` | Which ontology is bound to which corpus: `corpus_id`, `ontology_id`, `created_at`. `ON CORPUS` narrows to one corpus. |
| `SHOW STRUCTURES` | One row per level of each structure: `ontology`, `structure`, `position`, `level`, `kind`, `min_confidence`, `definition`, `cleanup`. |
| `SHOW RUNS` | Extraction runs: `id`, `status`, `trigger_kind`, `created_at`, `ended_at`, `error`. `ON BINDING` narrows to one binding. |
| `SHOW DAG ON BINDING` | The steps a binding's run executes. |
| `SHOW HINTS ON BINDING` | The hints set on a binding's steps: `invocation_key`, `hint`, `set_by`. |
| `SHOW AUDIT` | The activity log of MCP tool calls and SerchaQL statements: `occurred_at`, `user_id`, `tool`, `outcome`, `error_text`, `duration_ms`, `rows_returned`, `query_text` and more. Admin only. |

## Usage notes

- The MCP `query` tool does not run these listings. It runs `SELECT` and the read-only model forms: [SHOW MODEL](../commands/show-model.md), [SHOW LINKS](../commands/show-links.md), [SHOW LINEAGE](../commands/show-lineage.md) and [SHOW RAW](../commands/show-raw.md). Over MCP, the `catalogue` tool answers what these listings answer.
- `SHOW ENTITIES` needs `IN <corpus>` or `IN ONTOLOGY <ontology>`.
- `SHOW TOOLS` lists every tool to every caller, as the MCP tool list does. What a call returns is still only the caller's rows.
- `SHOW AUDIT` clauses come in any order. `SINCE` takes an RFC 3339 time, a date (`'2026-10-01'`) or a look-back (`'24h'`, `'7d'`). `ERRORS` keeps failed and refused calls; `DENIED` keeps only requests refused at the MCP edge (a bad token, scope, seat or admin check). Without `LIMIT` it returns 100 rows. Without `FOR SESSION` the newest calls come first; with it, the session's calls come in the order they were made.
- `SHOW LINEAGE OF '<_id>'` parses but is not implemented; use `SHOW LINEAGE OF <Entity> '<key>'` ([SHOW LINEAGE](../commands/show-lineage.md)).

## Examples

```sql
SHOW TABLES
```

| table | kind | description |
|---|---|---|
| data.invoices | dataset | Invoices exported nightly. |
| tables.crm.account | tables | names data.crm_account |
| clean.crm.account | clean | names data.clean_crm_account |
| books.Invoice | entity | An invoice extracted from a document. |
| open_orders | view | Orders not yet closed. |

```sql
SHOW ENTITIES IN books
```

```sql
SHOW RUNS ON BINDING books.finance
```

```sql
SHOW AUDIT FOR USER 'ops@example.com' SINCE '24h' ERRORS LIMIT 20
```

## Not supported

| Refused | Write instead |
|---|---|
| `SHOW ENTITIES` with no corpus | `SHOW ENTITIES IN <corpus>` |
| `SHOW PIPELINES` | Search pipelines were removed; `SHOW BINDINGS` and `SHOW RUNS` show extraction |

```sql
-- Refused by the engine
SHOW ENTITIES
```

```sql
-- Refused by the engine
SHOW PIPELINES
```

## See also

[SHOW MODEL](../commands/show-model.md) · [SHOW LINKS](../commands/show-links.md) · [SHOW LINEAGE](../commands/show-lineage.md) · [SHOW RAW](../commands/show-raw.md) · [SHOW RECORDS](../commands/show-records.md) · [DESCRIBE](../commands/describe.md)
