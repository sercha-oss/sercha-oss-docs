---
title: "LIMIT"
description: "Return at most a number of rows, optionally after skipping some."
---

# LIMIT

[Query syntax](../query-syntax.md)

Caps the number of rows a `SELECT` returns. `OFFSET` skips rows first. `FETCH FIRST` is the standard spelling of `LIMIT`.

## Syntax

```text
SELECT ...
FROM <source> [ <alias> ]
[ WHERE ... ]
[ ORDER BY ... ]
{ LIMIT { <count> | ALL } [ OFFSET <skip> [ ROW | ROWS ] ]
| OFFSET <skip> [ ROW | ROWS ] [ LIMIT <count> ]
| [ OFFSET <skip> [ ROW | ROWS ] ] FETCH { FIRST | NEXT } [ <count> ] { ROW | ROWS } ONLY }
```

## Parameters

| Parameter | Description |
|---|---|
| `<count>` | How many rows to return. An integer literal. |
| `ALL` | No cap. Same as leaving `LIMIT` out. |
| `<skip>` | How many rows to skip before counting. An integer literal. |
| `FETCH FIRST <count> ROWS ONLY` | Same as `LIMIT <count>`. Without `<count>` it returns one row. |

## Usage notes

- `LIMIT` and `OFFSET` may come in either order.
- `LIMIT 0` is read as no cap, like `LIMIT ALL`. It does not return zero rows.
- Without `ORDER BY` the rows kept are not defined. Pair `LIMIT` with `ORDER BY` for a stable top-n or page.
- `LIMIT` applies after `DISTINCT` and `ORDER BY`.
- After a set operation, `LIMIT` belongs to the last branch only. To cap the whole result, wrap the set operation in a derived table. See [Set operators](../clauses/set-operators.md).
- The `query` tool returns at most 1000 rows whatever the `LIMIT`, and says when it cut the result. Use `export` for more.
- In the body of `CREATE TOOL`, `<count>` and `<skip>` may be parameters: `LIMIT :top`.

## Examples

The ten largest orders:

```sql
SELECT o.key, o.amount FROM Order o ORDER BY o.amount DESC LIMIT 10
```

The third page of twenty:

```sql
SELECT o.key, o.placed_at FROM Order o ORDER BY o.placed_at DESC, o.key LIMIT 20 OFFSET 40
```

The standard spelling:

```sql
SELECT o.key FROM Order o ORDER BY o.amount DESC OFFSET 5 ROWS FETCH FIRST 5 ROWS ONLY
```

## Not supported

| Refused | Write instead |
|---|---|
| A `LIMIT` or `OFFSET` that is not an integer literal | `LIMIT <n>` with a number |
| `FETCH FIRST ... WITH TIES` | `LIMIT <n>`, or `RANK()` in a derived table and keep `rank <= n` |
| `FOR UPDATE`, `FOR SHARE` | Leave it out: queries are read-only |

```sql
-- Refused by the engine
SELECT o.key FROM Order o LIMIT o.amount
```

```sql
-- Refused by the engine
SELECT o.key FROM Order o ORDER BY o.amount FETCH FIRST 5 ROWS WITH TIES
```

## See also

[ORDER BY](../clauses/order-by.md) · [SELECT](../commands/select.md) · [DISTINCT](../clauses/distinct.md)
