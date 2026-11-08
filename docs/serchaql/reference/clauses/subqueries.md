---
title: "Subqueries"
description: "A SELECT inside another, as a derived table or in a WHERE condition."
---

# Subqueries

[Query syntax](../query-syntax.md)

A `SELECT` written inside another statement. It can stand where a table goes (a derived table), or in a `WHERE` or `HAVING` condition with `IN`, `EXISTS` or a comparison.

## Syntax

```text
-- a derived table, in FROM or JOIN
SELECT ... FROM ( <select> ) [ AS ] <alias> ...
SELECT ... FROM <source> <a> JOIN ( <select> ) [ AS ] <alias> ON ...

-- in a condition
SELECT ... FROM <source> <a>
WHERE <a>.<column> [ NOT ] IN ( <select> )
   OR [ NOT ] EXISTS ( <select> )
   OR <a>.<column> { = | <> | < | <= | > | >= } ( <select> )
```

## Parameters

| Parameter | Description |
|---|---|
| `( <select> ) <alias>` | A derived table. Any `SELECT`, including one with `GROUP BY`, a window function or a set operation. The alias is required. |
| `<column> [ NOT ] IN ( <select> )` | True when the column's value is among the subquery's first column. See [IN](../clauses/in.md). |
| `[ NOT ] EXISTS ( <select> )` | True when the subquery returns at least one row. See [EXISTS](../clauses/exists.md). |
| `<column> <op> ( <select> )` | Compares the column with the single value the subquery returns. |

## Usage notes

- A subquery can read the outer query's columns through the outer alias: `WHERE r.from_key = c.key`. A subquery correlated only by `=` conditions runs once for the whole statement and is matched by key. Any other correlated subquery runs once per distinct outer value; over a dataset table that is refused past 50 outer rows, with the `JOIN` or CTE rewrite to use instead.
- An uncorrelated subquery runs once and its result is reused for every outer row.
- A comparison subquery must return at most one row. No row reads as NULL, so the comparison is unknown and the row is dropped.
- The left side of `IN ( <select> )` and of a comparison with a subquery must be a plain column. To compare an expression, compute it in a derived table first.
- To use a computed value as a column, join a derived table or a CTE rather than writing a subquery in the SELECT list.
- A derived table can read the statement's CTEs.

## Examples

A derived table, filtered outside:

```sql
SELECT t.customer, t.total
FROM (SELECT o.customer AS customer, SUM(o.amount) AS total FROM Order o GROUP BY o.customer) t
WHERE t.total > 10000
```

A joined derived table:

```sql
SELECT o.key, o.amount, a.average
FROM Order o
JOIN (SELECT x.customer AS customer, AVG(x.amount) AS average FROM Order x GROUP BY x.customer) a
  ON a.customer = o.customer
WHERE o.amount > a.average
```

`IN`, `EXISTS` and a comparison:

```sql
SELECT c.key FROM Customer c
WHERE c.key IN (SELECT o.customer FROM Order o WHERE o.status = 'held')
```

```sql
SELECT c.key FROM Customer c
WHERE EXISTS (SELECT r.to_key FROM placed r WHERE r.from_key = c.key)
```

```sql
SELECT o.key, o.amount FROM Order o
WHERE o.amount > (SELECT AVG(x.amount) FROM Order x)
```

| key | amount |
|---|---|
| PO-1017 | 4500 |
| PO-1001 | 1200 |

## Not supported

| Refused | Write instead |
|---|---|
| A subquery in the SELECT list or inside an expression | Join a derived table or a CTE |
| An expression on the left of `IN ( <select> )` or of a comparison with a subquery | Compute it in a derived table; compare a plain column |
| `= ANY ( ... )`, `> ALL ( ... )`, `SOME` | `IN ( <select> )`, or compare with `MAX` or `MIN` in the subquery |
| `EXISTS ( ... )` outside a condition | Use it directly as a `WHERE` condition |

```sql
-- Refused by the engine
SELECT o.key, (SELECT MAX(x.amount) FROM Order x) AS top FROM Order o
```

```sql
-- Refused by the engine
SELECT c.key FROM Customer c WHERE lower(c.key) IN (SELECT o.customer FROM Order o)
```

```sql
-- Refused by the engine
SELECT o.key FROM Order o WHERE o.amount > ALL (SELECT x.amount FROM Order x WHERE x.status = 'closed')
```

```sql
-- Refused by the engine
SELECT c.key, EXISTS (SELECT r.to_key FROM placed r) AS has_orders FROM Customer c
```

## See also

[FROM](../clauses/from.md) · [WITH](../clauses/with.md) · [IN](../clauses/in.md) · [EXISTS](../clauses/exists.md) · [JOIN](../clauses/join.md) · [WHERE](../clauses/where.md)
