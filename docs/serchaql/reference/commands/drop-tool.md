---
title: "DROP TOOL"
description: "Remove a saved tool."
---

# DROP TOOL

[Commands › Tools](../commands.md#tools) · Admins only, through `sercha_define` or a tenant file

Removes a saved tool. It leaves the MCP tool list at once.

## Syntax

```text
DROP TOOL [ IF EXISTS ] <name>
```

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | A saved tool. |
| `IF EXISTS` | Succeed with a message when there is no such tool. |

## Usage notes

- A tool a view preset keeps cannot be dropped by hand: the server drops it when the preset's sources go. Replace it with `CREATE OR REPLACE TOOL` (an override), or make it the tenant's own with [DETACH PRESET](../commands/detach-preset.md).
- Dropping an override hands the tool back to its preset, which writes its own definition at its next reconcile.

## Examples

```sql
DROP TOOL IF EXISTS customer_orders
```

| result |
|---|
| tool "customer_orders" dropped |

## Not supported

| Refused | Write instead |
|---|---|
| Arguments after the name | The name alone |

```sql
-- Refused by the engine
DROP TOOL customer_orders(customer)
```

## See also

[CREATE TOOL](../commands/create-tool.md) · [CALL](../commands/call.md) · [DETACH PRESET](../commands/detach-preset.md) · [SHOW](../commands/show.md)
