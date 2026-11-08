---
title: "DETACH PRESET"
description: "Make a view preset's views, materialized views, tools and edges the tenant's own."
---

# DETACH PRESET

[Commands › Tools](../commands.md#tools) · Admins only, through `sercha_define` or a tenant file

Takes over what a view preset made. Its views, materialized views, tools and edges become the tenant's own, in place: nothing is computed again or dropped, and the preset no longer creates, replaces or drops any of them. The tenant then changes them as its own SerchaQL.

## Syntax

```text
DETACH PRESET <id>
```

## Parameters

| Parameter | Description |
|---|---|
| `<id>` | The preset's id, as `managed_by` shows it in `SHOW VIEWS` and `SHOW TOOLS`. An id with characters other than letters, digits and `_` is written in double quotes. |

## Usage notes

- The result says how many views, materialized views, tools and edges changed hands.
- Before detaching, a preset's objects cannot be dropped or re-described by hand; a tool can only be overridden with `CREATE OR REPLACE TOOL`.

## Examples

```sql
DETACH PRESET crm
```

| result |
|---|
| preset crm detached: 6 views, 2 materialized views, 3 tools and 1 edges are now the tenant's own |

## Not supported

| Refused | Write instead |
|---|---|
| `DETACH` without `PRESET` | `DETACH PRESET <id>` |

```sql
-- Refused by the engine
DETACH crm
```

## See also

[CREATE VIEW](../commands/create-view.md) · [CREATE TOOL](../commands/create-tool.md) · [DROP TOOL](../commands/drop-tool.md) · [DROP VIEW](../commands/drop-view.md) · [SHOW](../commands/show.md)
