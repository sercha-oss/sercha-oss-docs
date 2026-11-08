---
title: "Query syntax"
---

# Query syntax

The parts of a query, in the order you write them.

| Name | What it does |
|---|---|
| [SELECT](commands/select.md) | Read rows from the model, landed tables, datasets, extracted entities and views. |
| [WITH](clauses/with.md) | Name a query step once and read it by name; walk a hierarchy with WITH RECURSIVE. |
| [FROM](clauses/from.md) | Name the table a SELECT reads. |
| [JOIN](clauses/join.md) | Combine rows from two tables. |
| [VIA](clauses/via.md) | Join along a declared link, or on the same person, without writing the join keys. |
| [AS OF](clauses/as-of.md) | Read a dataset table as it was at a past time. |
| [WHERE](clauses/where.md) | Keep only the rows that meet a condition. |
| [GROUP BY](clauses/group-by.md) | Collapse rows that share values into one row per group. |
| [HAVING](clauses/having.md) | Keep only the groups that meet a condition. |
| [OVER](clauses/over.md) | The window a window function reads: its partition, order and frame. |
| [UNION, INTERSECT, EXCEPT](clauses/set-operators.md) | Combine the rows of two SELECTs. |
| [ORDER BY](clauses/order-by.md) | Sort the result rows. |
| [LIMIT](clauses/limit.md) | Return at most a number of rows, optionally after skipping some. |
| [DISTINCT](clauses/distinct.md) | Remove duplicate result rows. |
| [Subqueries](clauses/subqueries.md) | A SELECT inside another, as a derived table or in a WHERE condition. |
