---
title: "ALTER MATERIALIZED VIEW"
description: "Turn a materialized view's automatic refresh on or off."
---

# ALTER MATERIALIZED VIEW

[Commands › Materialized views](../commands.md#materialized-views) · Admins only, through `sercha_define` or a tenant file

Opts a materialized view in or out of refreshing itself after the tables it reads change.

## Syntax

```text
ALTER MATERIALIZED VIEW <name> SET AUTO REFRESH { ON | OFF }
```

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | A materialized view. |
| `ON` | Refresh after the tables it reads change. The default for a new materialized view. |
| `OFF` | Refresh only on `REFRESH MATERIALIZED VIEW`. |

## Usage notes

- The setting survives `CREATE OR REPLACE MATERIALIZED VIEW`.
- On a plain view the statement is refused: a plain view reads its tables each time it is queried.
- `SHOW MATERIALIZED VIEWS` shows the setting as `auto_refresh`.

## Examples

```sql
ALTER MATERIALIZED VIEW customer_totals SET AUTO REFRESH OFF
```

| result |
|---|
| materialized view "customer_totals" no longer refreshes itself; REFRESH MATERIALIZED VIEW customer_totals recomputes it |

## Not supported

| Refused | Write instead |
|---|---|
| A schedule or any value but `ON` and `OFF` | `ON`, or `OFF` and refresh it yourself |

```sql
-- Refused by the engine
ALTER MATERIALIZED VIEW customer_totals SET AUTO REFRESH DAILY
```

## See also

[CREATE MATERIALIZED VIEW](../commands/create-materialized-view.md) · [REFRESH MATERIALIZED VIEW](../commands/refresh-materialized-view.md) · [SHOW](../commands/show.md)
