---
title: "REFRESH EDGES"
description: "Resolve declared edges again and rewrite their pairs."
---

# REFRESH EDGES

[Commands › Edges](../commands.md#edges) · Admins only, through `sercha_define` or a tenant file

Resolves every declared edge, or one named edge, against the current rows of both sides and rewrites its `data.edge_<name>` table.

## Syntax

```text
REFRESH EDGES [ <name> ]
```

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | The edge to resolve. Leave it out to resolve every declared edge. |

## Usage notes

- Returns one row per edge resolved, with columns `edge` and `pairs`.
- Edges are also resolved in the background after a sync of a source one of their sides reads, so you rarely need this. Use it after changing a view an edge reads, or after an extraction run changed an entity side.
- A table whose pairs did not change is not rewritten.
- When some edges fail, the ones that resolved are still rewritten and the statement reports the failures.
- Ontology edges (`<ontology>.<name>`) are resolved by extraction, not by this statement.

## Examples

```sql
REFRESH EDGES order_customer
```

| edge | pairs |
|---|---|
| order_customer | 1490 |

```sql
REFRESH EDGES
```

## See also

[CREATE EDGE](../commands/create-edge.md) · [PREVIEW EDGE](../commands/preview-edge.md) · [DROP EDGE](../commands/drop-edge.md)
