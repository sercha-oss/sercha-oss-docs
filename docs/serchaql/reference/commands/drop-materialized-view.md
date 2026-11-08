---
title: "DROP MATERIALIZED VIEW"
description: "Remove a materialized view and its stored results."
---

# DROP MATERIALIZED VIEW

[Commands › Materialized views](../commands.md#materialized-views) · Admins only, through `sercha_define` or a tenant file

Removes a materialized view and every stored version of its result.

## Syntax

```text
DROP MATERIALIZED VIEW [ IF EXISTS ] <name>
```

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | A materialized view. |
| `IF EXISTS` | Succeed with a message when there is no such materialized view. |

## Usage notes

- A materialized view a view preset keeps cannot be dropped by hand. [DETACH PRESET](../commands/detach-preset.md) makes it the tenant's own first.

## Examples

```sql
DROP MATERIALIZED VIEW IF EXISTS customer_totals
```

| result |
|---|
| materialized view "customer_totals" dropped |

## Not supported

| Refused | Write instead |
|---|---|
| `DROP MATERIALIZED` without `VIEW` | `DROP MATERIALIZED VIEW <name>` |

```sql
-- Refused by the engine
DROP MATERIALIZED customer_totals
```

## See also

[CREATE MATERIALIZED VIEW](../commands/create-materialized-view.md) · [DROP VIEW](../commands/drop-view.md) · [SHOW](../commands/show.md)
