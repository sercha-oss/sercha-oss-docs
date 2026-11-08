---
title: "CREATE EDGE (ontology)"
description: "Declare an edge between two extraction entities, resolved by extraction."
---

# CREATE EDGE (ontology)

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Declares an edge between two entities of an ontology. Extraction writes the edge between instances: inside one document (an internal edge) or across documents by matching a field to the target's key (an external edge). Queries follow it with [VIA](../clauses/via.md). A qualified name `<ontology>.<name>` makes an ontology edge; an unqualified name makes a named edge between relations ([CREATE EDGE](../commands/create-edge.md)).

## Syntax

```text
CREATE EDGE <ontology>.<name>
  ON <ontology>.<Source> [ IN <corpus> ]
  <VERB>
  <ontology>.<Target> [ IN <corpus> ]
  [ LINK BY <field> RESOLVE { EXACT | FUZZY } [ WITHIN <ontology>.<Entity> ] ]
```

## Parameters

| Parameter | Description |
|---|---|
| `<ontology>.<name>` | The edge's address. `DROP EDGE <ontology>.<name>` removes it. |
| `<ontology>.<Source>`, `<ontology>.<Target>` | The two entities. Both must be qualified and must exist when the statement runs. |
| `IN <corpus>` | Which corpus holds that end's instances, for an edge between entities extracted in different corpora. Pins the entity to that corpus; an entity already pinned to another corpus is refused. |
| `<VERB>` | Any word, such as `CITES` or `BILLED_BY`. |
| `LINK BY <field>` | Makes the edge external: the source's `<field>` value is matched against the target's key. Leave out `LINK BY` and `RESOLVE` for an internal edge, decided by the document's structure. |
| `RESOLVE EXACT` | Links on equal values. |
| `RESOLVE FUZZY` | Links on close values. Needs `WITHIN`. |
| `WITHIN <ontology>.<Entity>` | The scope a fuzzy match searches. |

## Usage notes

- The edge reaches extraction after [REBIND CORPUS](../commands/rebind-corpus.md) and a [RUN BINDING](../commands/run-binding.md). Edges added to entities already extracted need a full re-extraction; to link values the entities already carry without one, use a named edge ([CREATE EDGE](../commands/create-edge.md)), which accepts two corpus entities.
- `UNDER` in [CREATE ENTITY (extraction)](../commands/create-extracted-entity.md) creates the internal `part_of` edge for you.

## Examples

An external edge: each invoice names its supplier.

```sql
CREATE EDGE finance.billed_by
  ON finance.Invoice BILLED_BY finance.Supplier
  LINK BY supplier RESOLVE EXACT;
```

| result |
|---|
| edge finance.billed_by created (id=...) |

Follow it:

```sql
SELECT a.invoice_no, b.name FROM books.Invoice a JOIN books.Supplier b VIA a.billed_by
```

A fuzzy edge across two corpora:

```sql
CREATE EDGE finance.refers_to
  ON finance.Note IN notes REFERS_TO finance.Invoice IN books
  LINK BY invoice_ref RESOLVE FUZZY WITHIN finance.Invoice;
```

## Not supported

| Refused | Write instead |
|---|---|
| `RESOLVE` without `LINK BY` | Both, or neither for an internal edge |
| `RESOLVE SEMANTIC` | `RESOLVE FUZZY` |
| An unqualified end | `<ontology>.<Entity>` |

```sql
-- Refused by the engine
CREATE EDGE finance.billed_by ON finance.Invoice BILLED_BY finance.Supplier RESOLVE EXACT
```

```sql
-- Refused by the engine
CREATE EDGE finance.billed_by ON finance.Invoice BILLED_BY finance.Supplier LINK BY supplier RESOLVE SEMANTIC
```

## See also

[CREATE ENTITY (extraction)](../commands/create-extracted-entity.md) · [DROP EDGE](../commands/drop-edge.md) · [CREATE EDGE](../commands/create-edge.md) · [VIA](../clauses/via.md) · [REBIND CORPUS](../commands/rebind-corpus.md)
