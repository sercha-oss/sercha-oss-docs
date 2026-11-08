---
title: "WITH"
description: "Name a query step once and read it by name; walk a hierarchy with WITH RECURSIVE."
---

# WITH

[Query syntax](../query-syntax.md)

Defines one or more common table expressions (CTEs): named `SELECT`s that the rest of the statement reads like tables. `WITH RECURSIVE` defines a CTE that reads itself, for walking a chain or a tree.

## Syntax

```text
WITH <cte_name> AS ( <select> ) [, <cte_name> AS ( <select> ) ...]
SELECT ...
FROM <cte_name> [ <alias> ]
  [ JOIN <cte_name> [ <alias> ] ON ... ]
...

WITH RECURSIVE <cte_name> AS (
  <anchor_select>
  UNION [ ALL ]
  <recursive_select>          -- reads <cte_name>
)
SELECT ... FROM <cte_name> ...
```

## Parameters

| Parameter | Description |
|---|---|
| `<cte_name>` | The name the statement reads the CTE by. It hides a model entity, relation or view of the same name. |
| `<select>` | Any `SELECT`. It may read CTEs defined before it in the same `WITH`. |
| `<anchor_select>` | The starting rows of a recursive CTE. A plain `SELECT`. |
| `<recursive_select>` | A `SELECT` that reads `<cte_name>` and returns the next rows. It runs again on the rows it last produced until it produces none. |
| `UNION` / `UNION ALL` | `UNION` drops rows already produced, which also stops a walk that loops. `UNION ALL` keeps every row. |

## Usage notes

- A CTE nothing reads is skipped, so naming a shared step costs nothing.
- A CTE can be read in `FROM`, joined, and read from inside a derived table or a subquery.
- `WITH` comes once, at the start of the statement. It also works at the start of a set operation, and in the body of a view, materialized view or tool.
- Outside `RECURSIVE`, a CTE body that is itself a set operation must be wrapped in a derived table: `WITH x AS (SELECT u.a FROM ( ... UNION ALL ... ) u)`.
- Use `WITH RECURSIVE` only for real recursion. Under `RECURSIVE`, give each CTE an anchor and a recursive term joined by `UNION` or `UNION ALL`.
- In a recursive CTE, the output column names come from the anchor.
- A recursive CTE stops after 1000 steps, without an error, even if the last step still produced rows.

## Examples

Name a step and read it by name:

```sql
WITH totals AS (
  SELECT o.customer AS customer, SUM(o.amount) AS total FROM Order o GROUP BY o.customer
)
SELECT t.customer, t.total
FROM totals t
WHERE t.total > 1000
ORDER BY t.total DESC
```

| customer | total |
|---|---|
| acme | 52300 |
| globex | 18800 |

A CTE whose body is a union, wrapped in a derived table:

```sql
WITH everyone AS (
  SELECT u.k FROM (
    SELECT c.key AS k FROM Customer c
    UNION ALL
    SELECT s.key AS k FROM Supplier s
  ) u
)
SELECT e.k FROM everyone e
```

Walk a product's parent chain:

```sql
WITH RECURSIVE chain AS (
  SELECT p.key AS key, p.parent AS parent, 1 AS depth FROM Product p WHERE p.key = 'widget-pro'
  UNION ALL
  SELECT q.key, q.parent, c.depth + 1 FROM Product q JOIN chain c ON q.key = c.parent
)
SELECT chain.key, chain.depth FROM chain ORDER BY chain.depth
```

| key | depth |
|---|---|
| widget-pro | 1 |
| widget | 2 |
| hardware | 3 |

## Not supported

| Refused | Write instead |
|---|---|
| A set operation directly as a CTE body, outside `RECURSIVE` | Wrap it in a derived table |
| `INTERSECT` or `EXCEPT` in a recursive CTE | `UNION` or `UNION ALL` |

```sql
-- Refused by the engine
WITH u AS (SELECT c.key AS k FROM Customer c UNION ALL SELECT s.key AS k FROM Supplier s)
SELECT u.k FROM u
```

```sql
-- Refused by the engine
WITH RECURSIVE chain AS (
  SELECT p.key AS key FROM Product p
  EXCEPT
  SELECT q.key FROM Product q JOIN chain c ON q.parent = c.key
)
SELECT chain.key FROM chain
```

## See also

[SELECT](../commands/select.md) · [Subqueries](../clauses/subqueries.md) · [UNION, INTERSECT, EXCEPT](../clauses/set-operators.md) · [FROM](../clauses/from.md) · [JOIN](../clauses/join.md)
