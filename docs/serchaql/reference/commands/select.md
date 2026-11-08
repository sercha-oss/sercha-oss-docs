---
title: "SELECT"
description: "Read rows from the model, landed tables, datasets, extracted entities and views."
---

# SELECT

[Query syntax](../query-syntax.md) · Any caller; rows they are not granted never appear

Reads rows. Every read in SerchaQL is a `SELECT`. Rows the caller is not granted never appear.

## Syntax

```text
[ WITH [ RECURSIVE ] <cte_name> AS ( <select> ) [, ...] ]
SELECT [ DISTINCT ] <select_item> [, ...]
FROM <source> [ [ AS ] <alias> ]
  [ <join> ... ]
[ WHERE <condition> ]
[ GROUP BY <expression> [, ...] ]
[ HAVING <condition> ]
[ { UNION [ ALL ] | INTERSECT | EXCEPT } <select> ]
[ ORDER BY <expression> [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] ]
[ LIMIT <count> ] [ OFFSET <skip> ]
```

## Parameters

| Parameter | Description |
|---|---|
| `<select_item>` | An expression with an optional alias: `o.amount * 1.1 AS with_tax`. `*` selects every column of a single source. |
| `<source>` | What to read: a model entity by bare name (`Order`); a model relation by name (`placed`); a landed table, `tables.<source>.<table>`, or its normalised form, `clean.<source>.<table>`; a dataset, `data.<table>`, optionally `AS OF '<UTC time>'`; an extracted entity, `<corpus>.<Entity>`; a view or materialized view by name; a derived table `( <select> )` or a CTE name. See [FROM](../clauses/from.md). |
| `<join>` | See [JOIN](../clauses/join.md). |
| `<condition>` | A boolean expression. In `WHERE` it filters rows before grouping; in `HAVING` it filters groups. |

## Usage notes

- The engine reads only the columns and rows the statement needs. Aggregate in the query (`GROUP BY` with `COUNT`, `SUM`) rather than pulling rows and counting them yourself.
- The `query` tool returns at most 1000 rows and says when it cut the result. Use `export` for more.
- A CTE nothing reads is skipped.

## Examples

Count orders by status:

```sql
SELECT o.status, COUNT(*) AS orders
FROM Order o
GROUP BY o.status
ORDER BY orders DESC
```

| status | orders |
|---|---|
| open | 41 |
| closed | 18 |

The largest order per customer:

```sql
SELECT r.customer, r.key, r.amount
FROM (
  SELECT o.customer AS customer, o.key AS key, o.amount AS amount,
         ROW_NUMBER() OVER (PARTITION BY o.customer ORDER BY o.amount DESC) AS rn
  FROM Order o
) r
WHERE r.rn = 1
```

## Not supported

| Refused | Write instead |
|---|---|
| `SELECT` without `FROM` | Select from a table |
| `SELECT DISTINCT ON (x) ...` | `ROW_NUMBER() OVER (PARTITION BY x ORDER BY ...)` in a derived table, keep `rn = 1` |
| `SELECT t.* FROM ...` with a table prefix | Name the columns |

```sql
-- Refused by the engine
SELECT 1
```

```sql
-- Refused by the engine
SELECT DISTINCT ON (o.customer) o.key FROM Order o
```

## See also

[JOIN](../clauses/join.md) · [WHERE](../clauses/where.md) · [GROUP BY](../clauses/group-by.md) · [ORDER BY](../clauses/order-by.md) · [WITH](../clauses/with.md) · [UNION, INTERSECT, EXCEPT](../clauses/set-operators.md)
