---
title: "ORDER BY"
description: "Sort the result rows."
---

# ORDER BY

[Query syntax](../query-syntax.md)

Sorts the result. Without `ORDER BY` the order of rows is not defined.

## Syntax

```text
SELECT ...
FROM <source> [ <alias> ]
[ WHERE ... ]
[ GROUP BY ... ]
[ HAVING ... ]
ORDER BY <key> [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...]
[ LIMIT <count> ] [ OFFSET <skip> ]

<key> ::= <expression> | <output_alias> | <position>
```

## Parameters

| Parameter | Description |
|---|---|
| `<expression>` | A column or an expression. It need not be in the SELECT list, except with `SELECT DISTINCT`. |
| `<output_alias>` | The name of a SELECT item: `ORDER BY total`. |
| `<position>` | A position in the SELECT list, counting from 1. |
| `ASC` / `DESC` | Ascending (the default) or descending. |
| `NULLS FIRST` / `NULLS LAST` | Put NULLs before or after every other value, in either direction. |

## Usage notes

- Without `NULLS FIRST` or `NULLS LAST`, a NULL sorts as the zero value of its type: an empty string for text, 0 for a number, false for a boolean, and before every date or timestamp. So a NULL number sorts between negative and positive numbers. Write `NULLS LAST` when NULLs should go to the end.
- With aggregates, `ORDER BY` can name a grouping key, an aggregate alias or an aggregate that is not selected (`ORDER BY SUM(o.amount) DESC`).
- `ORDER BY` runs after `DISTINCT` and before `LIMIT`.
- After a set operation, `ORDER BY` belongs to the last branch only. See [Set operators](../clauses/set-operators.md).
- `ORDER BY` inside `OVER (...)` orders the window, not the result. See [OVER](../clauses/over.md).

## Examples

```sql
SELECT o.customer, SUM(o.amount) AS total
FROM Order o
GROUP BY o.customer
ORDER BY total DESC NULLS LAST, o.customer
LIMIT 3
```

| customer | total |
|---|---|
| acme | 52300 |
| globex | 18800 |
| initech | 9100 |

Sort by a column that is not selected, and by position:

```sql
SELECT o.key, o.title FROM Order o ORDER BY o.placed_at DESC
```

```sql
SELECT o.status, COUNT(*) AS n FROM Order o GROUP BY o.status ORDER BY 2 DESC
```

## Not supported

| Refused | Write instead |
|---|---|
| `ORDER BY ... USING <operator>` | `ASC` or `DESC` |
| With `SELECT DISTINCT`, a key that is not selected | Add the key to the SELECT list |
| An aggregate in `ORDER BY` with no `GROUP BY` | Group the query, or select the aggregate |

```sql
-- Refused by the engine
SELECT DISTINCT o.status FROM Order o ORDER BY o.amount
```

```sql
-- Refused by the engine
SELECT o.key FROM Order o ORDER BY o.amount USING >
```

```sql
-- Refused by the engine
SELECT o.key FROM Order o ORDER BY COUNT(*)
```

## See also

[SELECT](../commands/select.md) · [LIMIT](../clauses/limit.md) · [DISTINCT](../clauses/distinct.md) · [OVER](../clauses/over.md) · [UNION, INTERSECT, EXCEPT](../clauses/set-operators.md)
