---
title: "UNION, INTERSECT, EXCEPT"
description: "Combine the rows of two SELECTs."
---

# UNION, INTERSECT, EXCEPT

[Query syntax](../query-syntax.md)

Combines the results of two or more `SELECT`s that return the same number of columns.

## Syntax

```text
SELECT <a1>, <a2> FROM <source1> [ <alias> ] [ WHERE ... ]
{ UNION [ ALL ] | INTERSECT | EXCEPT }
SELECT <b1>, <b2> FROM <source2> [ <alias> ] [ WHERE ... ]
[ { UNION [ ALL ] | INTERSECT | EXCEPT } SELECT ... ]
```

## Parameters

| Parameter | Description |
|---|---|
| `UNION` | Rows of both sides, each distinct row once. |
| `UNION ALL` | Every row of both sides, duplicates kept. Cheaper than `UNION`. |
| `INTERSECT` | Distinct rows of the left side that also appear on the right. |
| `EXCEPT` | Distinct rows of the left side that do not appear on the right. |

## Usage notes

- Both sides must return the same number of columns. Output column names come from the first `SELECT`.
- Operators chain from left to right: `a UNION b EXCEPT c` is `(a UNION b) EXCEPT c`. Parentheses around a branch are not accepted.
- An `ORDER BY` or `LIMIT` written after the last `SELECT` belongs to that `SELECT` only, not to the combined result. To sort or cap the whole result, wrap the set operation in a derived table and order outside.
- Rows compare by every column; NULLs compare equal to each other.
- A set operation can be a derived table, a view body and a recursive CTE body. As a plain CTE body, wrap it in a derived table. See [WITH](../clauses/with.md).
- The branches run side by side.

## Examples

Everyone the business deals with:

```sql
SELECT c.key AS party, 'customer' AS kind FROM Customer c
UNION ALL
SELECT s.key AS party, 'supplier' AS kind FROM Supplier s
```

| party | kind |
|---|---|
| acme | customer |
| globex | customer |
| initech | supplier |

Customers that are also suppliers, and customers with no order:

```sql
SELECT c.key FROM Customer c
INTERSECT
SELECT s.key FROM Supplier s
```

```sql
SELECT c.key FROM Customer c
EXCEPT
SELECT r.from_key FROM placed r
```

Sort and cap the combined result:

```sql
SELECT u.party, u.since
FROM (
  SELECT c.key AS party, c.created_at AS since FROM Customer c
  UNION
  SELECT s.key AS party, s.created_at AS since FROM Supplier s
) u
ORDER BY u.since DESC
LIMIT 10
```

## Not supported

| Refused | Write instead |
|---|---|
| `INTERSECT ALL`, `EXCEPT ALL` | `INTERSECT`, `EXCEPT` |
| A parenthesised branch: `(SELECT ...) UNION (SELECT ...)` | Leave out the parentheses; wrap the whole set operation in a derived table to order it |

```sql
-- Refused by the engine
SELECT c.key FROM Customer c INTERSECT ALL SELECT s.key FROM Supplier s
```

```sql
-- Refused by the engine
(SELECT c.key FROM Customer c) UNION (SELECT s.key FROM Supplier s)
```

## See also

[SELECT](../commands/select.md) · [WITH](../clauses/with.md) · [Subqueries](../clauses/subqueries.md) · [DISTINCT](../clauses/distinct.md)
