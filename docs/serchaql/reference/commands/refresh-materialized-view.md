---
title: "REFRESH MATERIALIZED VIEW"
description: "Recompute a materialized view from its stored text."
---

# REFRESH MATERIALIZED VIEW

[Commands › Materialized views](../commands.md#materialized-views) · Admins only, through `sercha_define` or a tenant file

Recomputes a materialized view. The body is compiled again from its stored text, so the entities, relations and views it reads are read as they are defined now, not as they were when the view was created.

## Syntax

```text
REFRESH MATERIALIZED VIEW <name>
```

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | A materialized view. |

## Usage notes

- When the stored text no longer compiles (a table it read was dropped), the refresh falls back to the plan stored at creation and says so.
- A result identical to the current one is kept: the statement reports the view `unchanged`, and the views reading it have nothing new to refresh.
- A failed refresh keeps the last good rows and records the error, shown as `refresh_error` in `SHOW MATERIALIZED VIEWS` and in `DESCRIBE`.
- The newest few versions are kept; older ones are removed.
- With auto refresh on (the default), a materialized view refreshes itself after the tables it reads change. Run this statement to recompute at once, or when auto refresh is off.

## Examples

```sql
REFRESH MATERIALIZED VIEW customer_totals
```

| result |
|---|
| materialized view "customer_totals" refreshed (id=3a9f..., version=4) |

## Not supported

| Refused | Write instead |
|---|---|
| `REFRESH VIEW` | A plain view is always current; nothing to refresh |

```sql
-- Refused by the engine
REFRESH VIEW open_orders
```

## See also

[CREATE MATERIALIZED VIEW](../commands/create-materialized-view.md) · [ALTER MATERIALIZED VIEW](../commands/alter-materialized-view.md) · [DROP MATERIALIZED VIEW](../commands/drop-materialized-view.md) · [SHOW](../commands/show.md)
