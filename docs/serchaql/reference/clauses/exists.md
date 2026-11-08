---
title: "EXISTS"
description: "Test whether a subquery returns any row."
---

# EXISTS

[Operators and expressions](../operators-and-expressions.md)

True when the subquery returns at least one row. `NOT EXISTS` is true when it returns none. It is the usual way to ask "has a related row" or "has no related row".

## Syntax

```text
SELECT ...
FROM <source> <alias>
WHERE [ NOT ] EXISTS ( <select> )
...
```

## Parameters

| Parameter | Description |
|---|---|
| `<select>` | Any `SELECT`. Its columns are not read, only whether it returns a row. It usually reads the outer query's columns through the outer alias: `WHERE r.from_key = c.key`. |

## Usage notes

- `EXISTS` is never NULL: it is true or false. That makes `NOT EXISTS` the safe form of "not in", unaffected by NULLs in the other table.
- A subquery tied to the outer row only by `=` conditions runs once for the whole statement and is matched by key. Other correlations run once per distinct outer value; over a dataset table that is refused past 50 outer rows.
- An uncorrelated subquery runs once: `EXISTS` is then the same for every row.
- `EXISTS` is a condition. It goes in `WHERE`, combined with `AND`, `OR` and `NOT`, but not inside other expressions.

## Examples

Customers with at least one order:

```sql
SELECT c.key, c.name FROM Customer c
WHERE EXISTS (SELECT r.to_key FROM placed r WHERE r.from_key = c.key)
```

| key | name |
|---|---|
| acme | Acme Corp |
| globex | Globex |

Suppliers no invoice names:

```sql
SELECT s.key FROM Supplier s
WHERE NOT EXISTS (SELECT i.invoice_no FROM books.Invoice i WHERE i.supplier_name = s.name)
```

Combined with other conditions:

```sql
SELECT o.key FROM Order o
WHERE o.status = 'open'
  AND EXISTS (SELECT t.key FROM Ticket t WHERE t.order_key = o.key AND t.priority = 'high')
```

## Not supported

| Refused | Write instead |
|---|---|
| `EXISTS ( ... )` in the SELECT list or another expression | Use it as a `WHERE` condition; for a flag column, `LEFT JOIN` the related table and test `IS NOT NULL` |

```sql
-- Refused by the engine
SELECT c.key, EXISTS (SELECT r.to_key FROM placed r WHERE r.from_key = c.key) AS has_orders FROM Customer c
```

## See also

[IN](../clauses/in.md) · [Subqueries](../clauses/subqueries.md) · [WHERE](../clauses/where.md) · [JOIN](../clauses/join.md)
