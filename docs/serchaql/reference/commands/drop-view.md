---
title: "DROP VIEW"
description: "Remove a view."
---

# DROP VIEW

[Commands › Views](../commands.md#views) · Admins only, through `sercha_define` or a tenant file

Removes a view.

## Syntax

```text
DROP VIEW [ IF EXISTS ] <name>
```

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | A view. |
| `IF EXISTS` | Succeed with a message when there is no such view. |

## Usage notes

- A view a view preset keeps cannot be dropped by hand. [DETACH PRESET](../commands/detach-preset.md) makes it the tenant's own first.
- A materialized view is dropped with [DROP MATERIALIZED VIEW](../commands/drop-materialized-view.md).
- A model entity's or relation's view goes with [DROP ENTITY](../commands/drop-entity.md) or [DROP RELATION](../commands/drop-relation.md).

## Examples

```sql
DROP VIEW IF EXISTS open_orders
```

| result |
|---|
| view "open_orders" dropped |

## Not supported

| Refused | Write instead |
|---|---|
| Several views in one statement | One `DROP VIEW` per view |

```sql
-- Refused by the engine
DROP VIEW open_orders, closed_orders
```

## See also

[CREATE VIEW](../commands/create-view.md) · [DROP MATERIALIZED VIEW](../commands/drop-materialized-view.md) · [SHOW](../commands/show.md)
