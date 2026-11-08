---
title: "DESCRIBE"
description: "One object's definition: a model entity or relation, a view, an extracted entity, a tool or an edge."
---

# DESCRIBE

[Commands › Looking around](../commands.md#looking-around) · Any caller; rows they are not granted never appear

Describes one object: what it is, its columns and how to read it. What comes back depends on what the name is.

## Syntax

```text
DESCRIBE <name>
DESCRIBE [ ENTITY ] <corpus>.<Entity>
DESCRIBE CORPUS <corpus>
DESCRIBE ONTOLOGY <ontology>
DESCRIBE TOOL <tool>
DESCRIBE EDGE <edge>
DESCRIBE plugins
DESCRIBE plugins.<table>
```

## Parameters

| Form | Describes |
|---|---|
| `DESCRIBE <name>` | Tried in this order: a model entity or relation (what its kind means, its key, time columns, how it is stored, its columns, what it is made from, every relation in and out with a ready walk, sample rows); a view or materialized view (its description, columns with meanings, the tables it reads, freshness, definition and an example query); a corpus or ontology (its entities, as `SHOW ENTITIES IN` lists them). |
| `DESCRIBE <corpus>.<Entity>` | An extracted entity: one row per column with `column_name`, `type`, `required`, `is_key`, `enum_values`, `description`. `ENTITY` may be written before the name. |
| `DESCRIBE CORPUS <corpus>`, `DESCRIBE ONTOLOGY <ontology>` | The entities of a corpus or ontology, as `SHOW ENTITIES IN` lists them. |
| `DESCRIBE TOOL <tool>` | A saved tool: `name`, `description`, `parameters`, `body`, `example` (a ready `CALL`), `managed_by`. |
| `DESCRIBE EDGE <edge>` | A declared edge, as `property` and `value` rows. |
| `DESCRIBE plugins`, `DESCRIBE plugins.<table>` | The installed plugin tables, or one table's contract. |

## Usage notes

- Model entities, relations and views come back as `property` and `value` rows, in sections.
- A name the caller may not read is not found, as a missing one is.
- The SerchaQL statement takes names of one or two parts. Over MCP, the `describe` tool also describes `tables.<source>.<table>`, `clean.<source>.<table>` and `data.<table>`, and `describe serchaql` returns the language reference.
- The MCP `query` tool does not run `DESCRIBE`; use the `describe` tool.
- `DESCRIBE TOOL`, `DESCRIBE EDGE`, `DESCRIBE CORPUS` and `DESCRIBE ONTOLOGY` need a name after the keyword; `DESCRIBE tool` alone describes a view called `tool`.

## Examples

A model entity:

```sql
DESCRIBE Order
```

| property | value |
|---|---|
| entity | Order |
| is | ARTEFACT: Information: one content however many copies or versions are kept (a ticket, a contract, a file). |
| description | A purchase order. |
| key | key |

An extracted entity:

```sql
DESCRIBE books.Invoice
```

| column_name | type | required | is_key | enum_values | description |
|---|---|---|---|---|---|
| invoice_no | string | true | true | | The invoice number as printed. |
| total | number | false | false | | The stated total, tax included. |

A saved tool:

```sql
DESCRIBE TOOL customer_orders
```

## Not supported

| Refused | Write instead |
|---|---|
| A three-part name, as `tables.<source>.<table>` | The MCP `describe` tool, or `SELECT ... LIMIT 5` |

```sql
-- Refused by the engine
DESCRIBE tables.drive.file
```

## See also

[SHOW](../commands/show.md) · [SHOW MODEL](../commands/show-model.md) · [CREATE ENTITY](../commands/create-entity.md) · [CREATE VIEW](../commands/create-view.md) · [CREATE TOOL](../commands/create-tool.md) · [COMMENT ON](../commands/comment-on.md)
