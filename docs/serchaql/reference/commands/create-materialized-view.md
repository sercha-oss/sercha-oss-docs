---
title: "CREATE MATERIALIZED VIEW"
description: "Save a SELECT and store its result, read from the store until it is refreshed."
---

# CREATE MATERIALIZED VIEW

[Commands › Materialized views](../commands.md#materialized-views) · Admins only, through `sercha_define` or a tenant file

Saves a `SELECT` under a name and computes its result once. Reads of the name return the stored result. It is recomputed by [REFRESH MATERIALIZED VIEW](../commands/refresh-materialized-view.md), and by itself after the tables it reads change, unless [AUTO REFRESH](../commands/alter-materialized-view.md) is off.

## Syntax

```text
CREATE [ OR REPLACE ] MATERIALIZED VIEW <name> AS <select>
```

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | The view's name, read bare in queries. |
| `<select>` | One `SELECT`, or a `WITH ... SELECT`. Not a set operation. |

## Usage notes

- The first version is computed when the statement runs, as the creating admin. A body that fails, or a result over the caps (50,000 rows or 16 MiB by default), leaves no view behind.
- `CREATE OR REPLACE` keeps serving the old rows until the new ones are ready, and keeps the description, column meanings and the auto refresh setting.
- Views and materialized views share one set of names.
- Auto refresh is on for a new materialized view.
- `SHOW MATERIALIZED VIEWS` gives each one's `latest_version`, `computed_at`, `auto_refresh` and `refresh_error`.
- A materialized view may read other materialized views.
- Use it when the body is expensive and its result small: an aggregate, a deduplication, a ranking. A body that returns most of a large table belongs in a plain view.

## Examples

```sql
CREATE OR REPLACE MATERIALIZED VIEW customer_totals AS
SELECT o.customer, COUNT(*) AS orders, SUM(o.amount) AS spend
FROM Order o
GROUP BY o.customer;
```

| result |
|---|
| materialized view "customer_totals" created (id=3a9f..., version=1) |

A body with a CTE:

```sql
CREATE OR REPLACE MATERIALIZED VIEW top_customers AS
WITH t AS (
  SELECT o.customer AS customer, SUM(o.amount) AS spend FROM Order o GROUP BY o.customer
)
SELECT t.customer, t.spend FROM t ORDER BY t.spend DESC LIMIT 100;
```

## Not supported

| Refused | Write instead |
|---|---|
| A set operation as the body | A plain view, or a materialized view per branch |

```sql
-- Refused by the engine
CREATE MATERIALIZED VIEW parties AS
SELECT c.key FROM Customer c
UNION
SELECT s.key FROM Supplier s
```

## See also

[REFRESH MATERIALIZED VIEW](../commands/refresh-materialized-view.md) · [ALTER MATERIALIZED VIEW](../commands/alter-materialized-view.md) · [DROP MATERIALIZED VIEW](../commands/drop-materialized-view.md) · [CREATE VIEW](../commands/create-view.md) · [COMMENT ON](../commands/comment-on.md)
