---
title: "DROP EDGE"
description: "Remove a named edge and its pairs, or an ontology edge."
---

# DROP EDGE

[Commands › Edges](../commands.md#edges) · Admins only, through `sercha_define` or a tenant file

Removes an edge. An unqualified name is a named edge between relations; a qualified name `<ontology>.<name>` is an ontology edge.

## Syntax

```text
DROP EDGE [ IF EXISTS ] <name>
DROP EDGE [ IF EXISTS ] <ontology>.<name> [ CASCADE | RESTRICT ]
```

## Parameters

| Parameter | Description |
|---|---|
| `IF EXISTS` | No error when there is no such edge. |
| `<name>` | A named edge made by [CREATE EDGE](../commands/create-edge.md). Its definition and its `data.edge_<name>` table are removed. |
| `<ontology>.<name>` | An ontology edge made by [CREATE EDGE (ontology)](../commands/create-ontology-edge.md). Only the declaration is removed; graph edges already extracted stay until the next run. |
| `CASCADE`, `RESTRICT` | Accepted on an ontology edge and ignored. |

## Usage notes

- Dropping an edge a view preset ships marks it dropped, so the preset does not bring it back.
- A bridge preset's edge comes with its connectors and cannot be dropped this way.
- `DROP GRAPH EDGE '<id>'` removes one extracted graph edge instance, not an edge declaration. See [DROP RUN](../commands/drop-run.md).

## Examples

```sql
DROP EDGE IF EXISTS order_customer
```

| result |
|---|
| edge order_customer dropped |

An ontology edge:

```sql
DROP EDGE finance.billed_by
```

## See also

[CREATE EDGE](../commands/create-edge.md) · [CREATE EDGE (ontology)](../commands/create-ontology-edge.md) · [REFRESH EDGES](../commands/refresh-edges.md)
