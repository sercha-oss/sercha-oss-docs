---
title: "CREATE VIEW"
description: "Save a SELECT under a name that queries read like a table."
---

# CREATE VIEW

[Commands › Views](../commands.md#views) · Admins only, through `sercha_define` or a tenant file

Saves a `SELECT` under a name. A query reads the view by name, and the body runs each time it is read, so a view is always current.

## Syntax

```text
CREATE [ OR REPLACE ] VIEW <name> AS <select>
```

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | The view's name, read bare in queries: `FROM open_orders o`. |
| `<select>` | A `SELECT`, a `WITH ... SELECT`, or a set operation. The text is stored exactly as written. |

## Usage notes

- Views and materialized views share one set of names: a view cannot take a materialized view's name.
- `CREATE VIEW` of a name that exists is refused; `CREATE OR REPLACE VIEW` replaces the body. The description and column meanings set with [COMMENT ON](../commands/comment-on.md) survive the replace.
- A view a view preset keeps cannot be replaced or dropped by hand.
- A non-admin sees and reads a view only when they can read every table its body reads, at any depth; to anyone else the name is not found.
- A model entity's or relation's records are a view under its name, made by [CREATE ENTITY](../commands/create-entity.md) and [CREATE RELATION](../commands/create-relation.md). Change those with their own statements.
- Use [CREATE MATERIALIZED VIEW](../commands/create-materialized-view.md) when the body is expensive and its result small.

## Examples

```sql
CREATE OR REPLACE VIEW open_orders AS
SELECT o.key, o.customer, o.amount
FROM Order o
WHERE o.status = 'open';
```

| result |
|---|
| view "open_orders" created (id=7c1e...) |

Read it:

```sql
SELECT v.customer, SUM(v.amount) AS open_amount
FROM open_orders v
GROUP BY v.customer
ORDER BY open_amount DESC
```

## Not supported

| Refused | Write instead |
|---|---|
| A body that is not a query | A `SELECT` |
| `CREATE VIEW` without `AS` | `CREATE VIEW <name> AS <select>` |

```sql
-- Refused by the engine
CREATE VIEW all_tables AS SHOW TABLES
```

```sql
-- Refused by the engine
CREATE VIEW open_orders SELECT o.key FROM Order o
```

## See also

[CREATE MATERIALIZED VIEW](../commands/create-materialized-view.md) · [DROP VIEW](../commands/drop-view.md) · [COMMENT ON](../commands/comment-on.md) · [DESCRIBE](../commands/describe.md) · [SELECT](../commands/select.md)
