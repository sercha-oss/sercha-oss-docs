---
title: "DROP RUN"
description: "Delete a run with its graph, only its graph, or one graph node or edge."
---

# DROP RUN

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Deletes extracted data by run or by id. `DROP RUN` deletes a run and the graph it wrote; `DROP GRAPH ON RUN` deletes only the graph and keeps the run; `DROP NODE` and `DROP GRAPH EDGE` delete one graph instance.

## Syntax

```text
DROP RUN [ IF EXISTS ] <run_id> [ FORCE ]
DROP GRAPH ON RUN <run_id> [ FORCE ]
DROP NODE <node_id>
DROP GRAPH EDGE <edge_id>
```

## Parameters

| Parameter | Description |
|---|---|
| `<run_id>`, `<node_id>`, `<edge_id>` | Ids, written bare or quoted. Quote an id with dashes. |
| `IF EXISTS` | No error when there is no such run. |
| `FORCE` | Allows dropping the current generation (see below). |

## Usage notes

- The newest sealed extraction run of a pipeline is the current generation: it owns the live rows for its documents. Dropping it, or its graph, is refused without `FORCE`. To redo extraction, run the binding again instead; ids are deterministic, so a new run restores the rows.
- Older, superseded runs own no live rows and drop freely. [ALTER BINDING ... PRUNE GENERATIONS](../commands/alter-binding.md) clears them in bulk.
- The graph's edges are deleted before its nodes, then the run itself.
- `DROP NODE` and `DROP GRAPH EDGE` succeed even when the id does not exist.
- `DROP GRAPH EDGE` removes one extracted edge instance. To remove an edge declaration, use [DROP EDGE](../commands/drop-edge.md).

## Examples

```sql
DROP RUN IF EXISTS '1f0c9a2e-7b3d-4e55-a1c8-62d9f4b0e317'
```

| result |
|---|
| run "1f0c9a2e-7b3d-4e55-a1c8-62d9f4b0e317" dropped |

```sql
DROP GRAPH ON RUN '1f0c9a2e-7b3d-4e55-a1c8-62d9f4b0e317' FORCE;
DROP NODE 'node_4b2e91';
DROP GRAPH EDGE 'edge_77ac03';
```

## Not supported

```sql
-- Refused by the engine
DROP GRAPH '1f0c9a2e-7b3d-4e55-a1c8-62d9f4b0e317'
```

## See also

[RUN BINDING](../commands/run-binding.md) · [CANCEL RUN](../commands/cancel-run.md) · [ALTER BINDING](../commands/alter-binding.md) · [DROP EDGE](../commands/drop-edge.md)
