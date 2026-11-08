---
title: "DISTINCT"
description: "Remove duplicate result rows."
---

# DISTINCT

[Query syntax](../query-syntax.md)

Removes duplicate rows from the result. Two rows are duplicates when every selected column is equal; NULLs count as equal to each other here.

## Syntax

```text
SELECT [ DISTINCT | ALL ] <select_item> [, ...]
FROM <source> [ <alias> ]
...

COUNT( DISTINCT <expression> )
```

## Parameters

| Parameter | Description |
|---|---|
| `DISTINCT` | Keep one row of each set of duplicates. |
| `ALL` | Keep every row. This is the default. |
| `COUNT( DISTINCT <expression> )` | Count the distinct non-NULL values of `<expression>`. See [COUNT](../functions/count.md). |

## Usage notes

- `DISTINCT` runs after the SELECT list is computed and before `ORDER BY` and `LIMIT`.
- With `DISTINCT`, every `ORDER BY` key must be in the SELECT list.
- `DISTINCT` inside an aggregate works for `COUNT` only.
- `GROUP BY` on the same columns gives the same rows and lets you add counts.

## Examples

The statuses in use:

```sql
SELECT DISTINCT o.status FROM Order o ORDER BY o.status
```

| status |
|---|
| closed |
| held |
| open |

Distinct pairs, and a distinct count:

```sql
SELECT DISTINCT o.customer, o.status FROM Order o
```

```sql
SELECT o.status, COUNT(DISTINCT o.customer) AS customers FROM Order o GROUP BY o.status
```

One row per customer, keeping the latest order, in place of `DISTINCT ON`:

```sql
SELECT r.customer, r.key, r.placed_at
FROM (
  SELECT o.customer AS customer, o.key AS key, o.placed_at AS placed_at,
         ROW_NUMBER() OVER (PARTITION BY o.customer ORDER BY o.placed_at DESC) AS rn
  FROM Order o
) r
WHERE r.rn = 1
```

## Not supported

| Refused | Write instead |
|---|---|
| `SELECT DISTINCT ON ( ... )` | `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` in a derived table, keep `rn = 1` |
| `SUM(DISTINCT x)`, `AVG(DISTINCT x)` and the like | Aggregate over a derived table of distinct values |
| `COUNT(DISTINCT x) OVER (...)` | `COUNT(DISTINCT x)` with `GROUP BY` in a derived table, joined back |

```sql
-- Refused by the engine
SELECT DISTINCT ON (o.customer) o.customer, o.key FROM Order o
```

```sql
-- Refused by the engine
SELECT AVG(DISTINCT o.amount) FROM Order o
```

## See also

[SELECT](../commands/select.md) · [GROUP BY](../clauses/group-by.md) · [COUNT](../functions/count.md) · [ROW_NUMBER](../functions/row_number.md) · [UNION, INTERSECT, EXCEPT](../clauses/set-operators.md)
