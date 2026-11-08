---
title: "GROUP BY"
description: "Collapse rows that share values into one row per group."
---

# GROUP BY

[Query syntax](../query-syntax.md)

Collapses the rows that share the same grouping values into one row, so aggregates such as `COUNT` and `SUM` are computed per group.

## Syntax

```text
SELECT <group_expression>, ..., <aggregate>( ... ) [, ...]
FROM <source> [ <alias> ]
[ WHERE <condition> ]
GROUP BY { <expression> | <position> | <output_alias> } [, ...]
[ HAVING <condition> ]
[ ORDER BY ... ]
```

## Parameters

| Parameter | Description |
|---|---|
| `<expression>` | A column (`o.status`) or an expression over columns (`lower(o.status)`, `date_trunc('month', o.placed_at)`). |
| `<position>` | A position in the SELECT list, counting from 1. `GROUP BY 1` groups by the first item. |
| `<output_alias>` | The alias of a SELECT item that is not an aggregate: `GROUP BY month` for `date_trunc('month', o.placed_at) AS month`. |

## Usage notes

- Every SELECT item must be a grouping key, an aggregate, or an expression over them. A plain column that is neither fails with `column "..." must appear in the GROUP BY clause or be used in an aggregate function`.
- An expression in the SELECT list that is written the same way as a grouping key reads that key.
- NULL values form one group.
- Aggregates without `GROUP BY` return exactly one row, also when no rows match: `COUNT(*)` is then 0 and `SUM` is NULL.
- `COUNT(DISTINCT x)` counts distinct values. `DISTINCT` inside other aggregates is refused.
- The engine groups in the data store when it can, so only one row per group comes back. Prefer grouping in the query to fetching rows and counting them yourself.
- A window function cannot sit in the same SELECT as `GROUP BY`. Group in a derived table, then apply the window outside. See [OVER](../clauses/over.md).

## Examples

Orders and spend per status:

```sql
SELECT o.status, COUNT(*) AS orders, SUM(o.amount) AS total
FROM Order o
GROUP BY o.status
ORDER BY total DESC
```

| status | orders | total |
|---|---|---|
| open | 41 | 52300 |
| closed | 18 | 9100 |

Group by an expression, named by its alias:

```sql
SELECT date_trunc('month', o.placed_at) AS month, COUNT(DISTINCT o.customer) AS customers
FROM Order o
GROUP BY month
ORDER BY month
```

Group by position:

```sql
SELECT split_part(t.path, '/', 1) AS top_folder, COUNT(*) AS files
FROM tables.drive.file t
GROUP BY 1
```

## Not supported

| Refused | Write instead |
|---|---|
| `GROUP BY ROLLUP`, `CUBE`, `GROUPING SETS` | One `GROUP BY` query per level, joined with `UNION ALL` |
| An aggregate in `GROUP BY` | Group by the plain columns; aggregate in the SELECT list |
| `SELECT *` with `GROUP BY` | List the grouped columns and the aggregates |
| `SUM(DISTINCT x)` and other non-`COUNT` distinct aggregates | `SUM(d.x)` over `(SELECT DISTINCT ... ) d` |

```sql
-- Refused by the engine
SELECT o.status, o.region, COUNT(*) FROM Order o GROUP BY ROLLUP (o.status, o.region)
```

```sql
-- Refused by the engine
SELECT o.status, o.key FROM Order o GROUP BY o.status
```

```sql
-- Refused by the engine
SELECT SUM(DISTINCT o.amount) FROM Order o
```

## See also

[SELECT](../commands/select.md) · [HAVING](../clauses/having.md) · [COUNT](../functions/count.md) · [SUM](../functions/sum.md) · [AVG](../functions/avg.md) · [STRING_AGG](../functions/string_agg.md) · [DISTINCT](../clauses/distinct.md)
