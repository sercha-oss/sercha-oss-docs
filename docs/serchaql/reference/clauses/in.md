---
title: "IN"
description: "Test whether a value is one of a list, or among a subquery's values."
---

# IN

[Operators and expressions](../operators-and-expressions.md)

Tests whether a value equals any value in a list or in the first column of a subquery. `NOT IN` is the opposite.

## Syntax

```text
SELECT ...
FROM <source> [ <alias> ]
WHERE <expression> [ NOT ] IN ( <value> [, ...] )
   OR <column> [ NOT ] IN ( <select> )
...
```

## Parameters

| Parameter | Description |
|---|---|
| `<expression>` | The value to test. Any expression for a list. |
| `<value>` | A list item: a literal or an expression. |
| `<column>` | For a subquery, a plain column of the outer query. |
| `<select>` | A `SELECT` whose first column holds the values to match. It may read the outer query's columns. |

## Usage notes

NULL follows SQL's rules, which matter most for `NOT IN`:

| Case | `IN` | `NOT IN` |
|---|---|---|
| The value is among the values | true | false |
| The value is not among them, and none is NULL | false | true |
| The value is not among a subquery's values, and one is NULL | NULL | NULL |
| The value is NULL | NULL | NULL |
| The subquery returns no rows, whatever the value | false | true |

- A row is kept only when the result is true, so a NULL value is dropped by both `IN` and `NOT IN`, except by `NOT IN` over a subquery that returns no rows.
- When a `NOT IN` subquery returns a NULL (or an empty text value, which reads as NULL), `NOT IN` keeps no rows. The result then carries a notice that says so. Use `NOT EXISTS`, or add `WHERE <column> IS NOT NULL` inside the subquery.
- Do not put `NULL` in a list to match NULLs. Test with `IS NULL` instead: `WHERE o.region IN ('AU', 'NZ') OR o.region IS NULL`.
- A plain column with a list of literals is pushed into the read of the table.
- In the body of `CREATE TOOL`, the list may be a `TEXT[]` parameter: `WHERE o.status IN :statuses`.

## Examples

```sql
SELECT o.key, o.status FROM Order o WHERE o.status IN ('open', 'held')
```

| key | status |
|---|---|
| PO-1001 | open |
| PO-1017 | held |

Customers with no held order, written safely with a NULL guard:

```sql
SELECT c.key FROM Customer c
WHERE c.key NOT IN (SELECT o.customer FROM Order o WHERE o.status = 'held' AND o.customer IS NOT NULL)
```

`IN` over an expression:

```sql
SELECT t.path FROM tables.drive.file t
WHERE lower(split_part(t.path, '.', -1)) IN ('xlsx', 'csv')
```

## Not supported

| Refused | Write instead |
|---|---|
| An expression on the left of `IN ( <select> )` | Compute it in the subquery, or compare a plain column |
| `IN ( <select> )` inside a larger expression, such as in the SELECT list | Use it directly as a `WHERE` condition |
| `= ANY ( ... )` | `IN ( ... )` |

```sql
-- Refused by the engine
SELECT t.id FROM tables.crm.account t WHERE lower(t.name) IN (SELECT c.name FROM Customer c)
```

```sql
-- Refused by the engine
SELECT o.key, CASE WHEN o.customer IN (SELECT c.key FROM Customer c) THEN 1 ELSE 0 END AS known FROM Order o
```

```sql
-- Refused by the engine
SELECT o.key FROM Order o WHERE o.status = ANY ('open', 'held')
```

## See also

[EXISTS](../clauses/exists.md) · [Subqueries](../clauses/subqueries.md) · [Operators](../clauses/operators.md) · [IS NULL](../clauses/is-null.md) · [WHERE](../clauses/where.md)
