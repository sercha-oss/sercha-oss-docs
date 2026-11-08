---
title: "EXPLAIN"
description: "Show how a SELECT would run, without running it."
---

# EXPLAIN

[Commands › Looking around](../commands.md#looking-around) · Any caller; rows they are not granted never appear

Returns the plan for a `SELECT`: which parts the engine sends to the data store as one SQL query, and which parts it computes in memory. The query does not run.

## Syntax

```text
EXPLAIN [ ANALYZE ] <select>
```

## Parameters

| Parameter | Description |
|---|---|
| `<select>` | A `SELECT`, a `WITH ... SELECT`, or a set operation. |
| `ANALYZE` | Accepted. It returns the same plan as `EXPLAIN`: the query is not run and no row counts or timings are added. |

## Usage notes

- The result is one row with one column, `plan`: a JSON tree of operators. A part sent to the data store is an `op` of `pushed_query` with the `sql` it runs and the `tables` it reads. A `stays_in_go` list, when present, says why a part is computed in memory instead.
- The plan is built under the caller's column policy, so it never names a column the caller may not read. Names resolve as they do for `SELECT`: a name the caller cannot read is not found.
- Use it to check that a filter or aggregate reaches the data store before running a query over a large table.

## Examples

```sql
EXPLAIN
SELECT o.status, COUNT(*) AS orders
FROM Order o
WHERE o.placed_at >= DATE '2026-01-01'
GROUP BY o.status
```

| plan |
|---|
| `{"op":"pushed_query","tables":["data.orders"],"sql":"SELECT ... GROUP BY ...","out_schema":[...]}` |

```sql
EXPLAIN ANALYZE
SELECT c.key, COUNT(*) AS orders
FROM Customer c
JOIN placed r ON r.from_key = c.key
GROUP BY c.key
```

## Not supported

| Refused | Write instead |
|---|---|
| `EXPLAIN` of anything but a query | `EXPLAIN` a `SELECT` |

```sql
-- Refused by the engine
EXPLAIN CREATE VIEW open_orders AS SELECT o.key FROM Order o
```

## See also

[SELECT](../commands/select.md) · [WITH](../clauses/with.md) · [UNION, INTERSECT, EXCEPT](../clauses/set-operators.md) · [Subqueries](../clauses/subqueries.md)
