---
title: "Commands"
---

# Commands

Statements that define, change and inspect what Sercha holds, grouped by the object they act on. Most need an admin.

## Model entities

| Name | What it does |
|---|---|
| [CREATE ENTITY](commands/create-entity.md) | Declare an entity of the model, of one kind, with its records given by a query. |
| [DROP ENTITY](commands/drop-entity.md) | Remove a model entity, or an extracted entity from an ontology. |

## Relations

| Name | What it does |
|---|---|
| [CREATE RELATION](commands/create-relation.md) | Declare a kind of link between two model entities. |
| [REFRESH RELATION](commands/refresh-relation.md) | Judge an inferred relation's changed candidates again. |
| [DROP RELATION](commands/drop-relation.md) | Remove a relation from the model. |

## Tables

| Name | What it does |
|---|---|
| [ALTER TABLE ... RENAME TO](commands/alter-table-rename.md) | Give a stored table a layer name, tables.&lt;source>.&lt;table> or clean.&lt;source>.&lt;table>. |
| [ALTER TABLE ... NORMALISE](commands/alter-table-normalise.md) | Group a landed table's rows whose names differ only in case, punctuation or plurals into clean.&lt;source>.&lt;table>. |
| [REFRESH TABLE](commands/refresh-table.md) | Rebuild a cleaned table from its landed table, with the same rule. |
| [ALTER TABLE ... MODEL IGNORE](commands/alter-table-model-ignore.md) | Mark a landed or cleaned table as deliberately left out of the model. |

## Views

| Name | What it does |
|---|---|
| [CREATE VIEW](commands/create-view.md) | Save a SELECT under a name that queries read like a table. |
| [COMMENT ON](commands/comment-on.md) | Describe a view, a materialized view or one of its columns. |
| [DROP VIEW](commands/drop-view.md) | Remove a view. |

## Materialized views

| Name | What it does |
|---|---|
| [CREATE MATERIALIZED VIEW](commands/create-materialized-view.md) | Save a SELECT and store its result, read from the store until it is refreshed. |
| [REFRESH MATERIALIZED VIEW](commands/refresh-materialized-view.md) | Recompute a materialized view from its stored text. |
| [ALTER MATERIALIZED VIEW](commands/alter-materialized-view.md) | Turn a materialized view's automatic refresh on or off. |
| [DROP MATERIALIZED VIEW](commands/drop-materialized-view.md) | Remove a materialized view and its stored results. |

## Tools

| Name | What it does |
|---|---|
| [CREATE TOOL](commands/create-tool.md) | Save a parameterised SELECT as a named tool that agents call with typed arguments. |
| [CALL](commands/call.md) | Run a saved tool with arguments. |
| [DROP TOOL](commands/drop-tool.md) | Remove a saved tool. |
| [DETACH PRESET](commands/detach-preset.md) | Make a view preset's views, materialized views, tools and edges the tenant's own. |

## Edges

| Name | What it does |
|---|---|
| [CREATE EDGE](commands/create-edge.md) | Declare a named edge that links rows of two relations by a matching rule. |
| [PREVIEW EDGE](commands/preview-edge.md) | Resolve an edge and report what it would hold, without storing anything. |
| [REFRESH EDGES](commands/refresh-edges.md) | Resolve declared edges again and rewrite their pairs. |
| [DROP EDGE](commands/drop-edge.md) | Remove a named edge and its pairs, or an ontology edge. |

## People

| Name | What it does |
|---|---|
| [CREATE PEOPLE](commands/create-people.md) | Declare which dataset columns identify people, so each person's identities resolve into one person. |
| [REFRESH PEOPLE](commands/refresh-people.md) | Rebuild the people tables and resolve every source's people into unified people. |
| [DROP PEOPLE](commands/drop-people.md) | Remove a people declaration made with CREATE PEOPLE. |

## Access

| Name | What it does |
|---|---|
| [GRANT](commands/grant.md) | Give a user or group a privilege on a corpus, dataset, source, partition or container. |
| [REVOKE](commands/revoke.md) | Remove a privilege a user or group was granted. |

## Looking around

| Name | What it does |
|---|---|
| [SHOW MODEL](commands/show-model.md) | List the model's entities and relations, the kinds, their row counts, or which tables the model reads. |
| [SHOW LINKS](commands/show-links.md) | Everything one record of the model is linked to, with a count and a sample per link. |
| [SHOW LINEAGE](commands/show-lineage.md) | The rows a model record was made from, or the records built from one row. |
| [SHOW RAW](commands/show-raw.md) | The source item a landed row came from, as it last landed. |
| [SHOW RECORDS](commands/show-records.md) | Find records of any model entity by their key or title. |
| [SHOW](commands/show.md) | List the objects of one kind: corpora, tables, datasets, views, tools, edges, runs and more. |
| [DESCRIBE](commands/describe.md) | One object's definition: a model entity or relation, a view, an extracted entity, a tool or an edge. |
| [EXPLAIN](commands/explain.md) | Show how a SELECT would run, without running it. |

## Extracting entities from documents

| Name | What it does |
|---|---|
| [CREATE ONTOLOGY](commands/create-ontology.md) | Create an ontology, the set of entities to extract from documents. |
| [CREATE ENTITY (extraction)](commands/create-extracted-entity.md) | Declare an entity of an ontology, with the columns extraction reads out of each document. |
| [ALTER ENTITY](commands/alter-entity.md) | Change an extraction entity's columns, description, natural key or sensitivity. |
| [CREATE RECORD TYPE](commands/create-record-type.md) | Declare a kind of ledger record that people or agents write about extracted instances. |
| [CREATE EDGE (ontology)](commands/create-ontology-edge.md) | Declare an edge between two extraction entities, resolved by extraction. |
| [CREATE STRUCTURE](commands/create-structure.md) | Declare how a corpus's documents are organised into levels, by path or by an agent. |
| [CREATE CORPUS](commands/create-corpus.md) | Collect documents from source folders into a corpus, optionally partitioned and bound to an ontology. |
| [ALTER CORPUS](commands/alter-corpus.md) | Recompute a corpus's partition keys, or attach and detach dataset tables. |
| [BIND CORPUS](commands/bind-corpus.md) | Bind a corpus to an ontology so extraction reads its documents. |
| [ALTER BINDING](commands/alter-binding.md) | Tune a binding: an extraction hint, a document window, or pruning old generations. |
| [RUN BINDING](commands/run-binding.md) | Start an extraction run over a binding's documents, or estimate one. |
| [CANCEL RUN](commands/cancel-run.md) | Stop an extraction run that has not finished. |
| [REBIND CORPUS](commands/rebind-corpus.md) | Move a corpus's binding to a new or earlier frozen version of its ontology. |
| [UNBIND CORPUS](commands/unbind-corpus.md) | Remove a corpus's binding to an ontology. |
| [DROP RUN](commands/drop-run.md) | Delete a run with its graph, only its graph, or one graph node or edge. |
| [DROP CORPUS](commands/drop-corpus.md) | Remove a corpus with its bindings, extracted graph, grants and the documents only it claimed. |
| [DROP STRUCTURE](commands/drop-structure.md) | Remove a structure and its pack entities, unless a corpus is organised by it. |
| [DROP ONTOLOGY](commands/drop-ontology.md) | Remove an ontology and everything declared in it. |
