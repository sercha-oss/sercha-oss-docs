---
title: "WHERE"
description: "Keep only the rows that meet a condition."
---

# WHERE

[Query syntax](../query-syntax.md)

Filters the rows of the `FROM` source and its joins before any grouping. A row is kept only when the condition is true; false and NULL both drop it.

## Syntax

```text
SELECT ...
FROM <source> [ <alias> ]
  [ <join> ... ]
WHERE <condition>
[ GROUP BY ... ]
...
```

## Parameters

| Parameter | Description |
|---|---|
| `<condition>` | A boolean expression: comparisons, `AND`, `OR`, `NOT`, `IN`, `EXISTS`, `BETWEEN`, `LIKE`, `IS NULL`, a boolean column, or a function that returns a boolean such as `regexp_like`. See [Operators](../clauses/operators.md). |

## Usage notes

- A comparison with NULL is unknown, so `o.status <> 'closed'` does not keep rows whose status is NULL. Add `OR o.status IS NULL` to keep them.
- In a text, date or timestamp column an empty string is NULL.
- A plain column compared with a literal (`o.status = 'open'`, `o.amount > 100`, `o.region IN ('AU', 'NZ')`) is pushed into the read of the table, so only matching rows are read. Expressions are pushed too when the data store can evaluate them the same way; otherwise they run after the rows are read.
- An unquoted number compared with a text column compares as a number: `t.code = 7` matches `'7'` and `'07'`.
- `WHERE` runs before `GROUP BY`. To filter on an aggregate, use [HAVING](../clauses/having.md). To filter on a window function, compute it in a derived table and filter outside.
- A subquery can appear as `IN (SELECT ...)`, `EXISTS (SELECT ...)` or `<column> <op> (SELECT ...)`. See [Subqueries](../clauses/subqueries.md).

## Examples

```sql
SELECT o.key, o.amount
FROM Order o
WHERE o.status IN ('open', 'held')
  AND o.amount >= 1000
  AND (o.title ILIKE '%refund%' OR o.closed_at IS NULL)
```

| key | amount |
|---|---|
| PO-1001 | 1200 |
| PO-1017 | 4500 |

A condition over an expression:

```sql
SELECT t.path FROM tables.drive.file t
WHERE lower(split_part(t.path, '/', 1)) = 'finance' AND length(t.name) > 20
```

Rows whose value is not in another table:

```sql
SELECT c.key FROM Customer c
WHERE NOT EXISTS (SELECT r.to_key FROM placed r WHERE r.from_key = c.key)
```

## Not supported

| Refused | Write instead |
|---|---|
| An aggregate in `WHERE` | Filter on it in `HAVING` |
| A window function in `WHERE` | Compute it in a derived table and filter outside |

```sql
-- Refused by the engine
SELECT o.customer FROM Order o WHERE COUNT(*) > 5 GROUP BY o.customer
```

```sql
-- Refused by the engine
SELECT o.key FROM Order o WHERE ROW_NUMBER() OVER (ORDER BY o.amount DESC) <= 3
```

## See also

[SELECT](../commands/select.md) · [HAVING](../clauses/having.md) · [Operators](../clauses/operators.md) · [IN](../clauses/in.md) · [EXISTS](../clauses/exists.md) · [LIKE](../clauses/like.md) · [BETWEEN](../clauses/between.md) · [IS NULL](../clauses/is-null.md)
