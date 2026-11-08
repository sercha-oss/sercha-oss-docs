---
title: "SHOW MODEL"
description: "List the model's entities and relations, the kinds, their row counts, or which tables the model reads."
---

# SHOW MODEL

[Commands › Looking around](../commands.md#looking-around) · Any caller; rows they are not granted never appear

Lists what the model holds. `SHOW MODEL` gives one row per entity and relation; `KINDS` lists the entity kinds; `STATS` adds row counts; `COVERAGE` says which landed and cleaned tables the model reads.

## Syntax

```text
SHOW MODEL [ KINDS | STATS | COVERAGE ]
```

## Parameters

| Form | Result |
|---|---|
| `SHOW MODEL` | One row per entity, then one per relation: `name`; `is` (an entity's kind with its `OF <host> [BY <column>]`, or a relation's `<From> <verb> <To>`); `key` (`from_key, to_key` for a relation); `time` (the time columns joined by ` .. `); `stored` (`query`, `materialised`, `materialised, refreshed by key` or `no instances`; for a relation `query` or `inferred: <rule>`); `description`. |
| `KINDS` | The eight entity kinds: `kind`, `needs` (what the kind requires), `meaning`. |
| `STATS` | One row per entity and relation: `name`, `object`, `kind`, `of`, `from`, `to`, `verb`, `count`, `activity`, `today`, `counted_at`. The count columns are NULL until the object has been counted. |
| `COVERAGE` | One row per `tables.<source>.<table>` and `clean.<source>.<table>`: `table`, `rows` (always NULL: no cheap count is kept), `read_by` (the entities and relations whose bodies read it), `cleaned_as`, `status`. |

## Usage notes

- The MCP `query` tool runs every form. There, rows for entities and relations the caller may not read are left out, so no caller learns their names.
- `COVERAGE` statuses: `modelled` (read by the model, directly or through its clean table), `cleaned only` (normalised, but nothing reads either table), `not modelled`, and `left out` (marked with [ALTER TABLE ... SET MODEL IGNORE](../commands/alter-table-model-ignore.md)).
- `STATS` counts only what the caller can read; the counts of anything else stay NULL.

## Examples

```sql
SHOW MODEL
```

| name | is | key | time | stored | description |
|---|---|---|---|---|---|
| Customer | THING | key | | query | An account that places orders. |
| Order | ARTEFACT | key | | materialised | A purchase order. |
| Fulfilment | PROCESS | key | opened_at .. closed_at | query | Picking and shipping one order. |
| placed | Customer places Order | from_key, to_key | | query | The customer an order is raised against. |

```sql
SHOW MODEL KINDS
```

| kind | needs | meaning |
|---|---|---|
| THING | | Exists on its own and keeps its identity over time: a person, an organisation, a system. |
| ARTEFACT | | Information: one content however many copies or versions are kept (a ticket, a contract, a file). |
| QUALITY | `OF <host>` | A value borne by one host, with no identity of its own (a label, a status). |
| FUNCTION | `OF <host>` | What its host is for, realised when a process runs (a capability of a product). |
| DISPOSITION | `OF <host>` | How its host tends to behave under some condition (a rule, a defect). |
| ROLE | `OF <host>` | A status its host has for a while (reviewer, assignee). |
| PROCESS | `TIME <start>, <end>` | Unfolds over time from a start to an end, with participants (a change from opened to merged). |
| EVENT | `TIME <at>` | An instant that starts or ends a process (merged, released, an error raised). |

```sql
SHOW MODEL COVERAGE
```

| table | rows | read_by | cleaned_as | status |
|---|---|---|---|---|
| tables.crm.account | | Customer | clean.crm.account | modelled |
| tables.crm.legacy_note | | | | left out |
| tables.drive.file | | | | not modelled |

## Not supported

| Refused | Write instead |
|---|---|
| `SHOW MODEL` of one entity | `DESCRIBE <Entity>` |

```sql
-- Refused by the engine
SHOW MODEL Order
```

## See also

[CREATE ENTITY](../commands/create-entity.md) · [CREATE RELATION](../commands/create-relation.md) · [SHOW LINKS](../commands/show-links.md) · [DESCRIBE](../commands/describe.md) · [ALTER TABLE ... MODEL IGNORE](../commands/alter-table-model-ignore.md) · [SHOW](../commands/show.md)
