---
title: "JOIN"
description: "Combine rows from two tables."
---

# JOIN

[Query syntax](../query-syntax.md)

Combines each row of one table with the matching rows of another.

## Syntax

```text
SELECT ...
FROM <left> [ AS ] <l>
  { JOIN | LEFT JOIN } <right> [ AS ] <r>
    { ON <l>.<column> = <r>.<column> [ AND ... ]
    | USING ( <column> [, ...] )
    | VIA <l>.<link>
    | VIA PERSON ( <l>.<column> = <r>.<column> ) }
```

## Parameters

| Parameter | Description |
|---|---|
| `JOIN` | Keeps only rows that match on both sides. |
| `LEFT JOIN` | Keeps every row of `<left>`; columns of `<right>` are NULL where nothing matches. |
| `ON <l>.<column> = <r>.<column>` | The match. Column equalities only, joined by `AND`. |
| `USING ( <column> )` | Shorthand for `ON` when both sides name the column the same. |
| `VIA <l>.<link>` | Follows a declared link of an extracted entity. See [VIA](../clauses/via.md). |
| `VIA PERSON ( <l>.<column> = <r>.<column> )` | Matches rows whose two columns name the same person, however each side spells them. See [VIA](../clauses/via.md). |

## Usage notes

- To match on an expression such as `lower(name)`, compute it in a derived table and join on its output column.
- A model relation is joined like any table: `JOIN placed r ON r.from_key = c.key`.
- CTEs, views and derived tables can be joined to each other and to tables.

## Examples

Customers with no orders:

```sql
SELECT c.key
FROM Customer c
LEFT JOIN placed r ON r.from_key = c.key
WHERE r.to_key IS NULL
```

Match on a normalised name:

```sql
SELECT o.key, n.name
FROM Order o
JOIN (SELECT c.key AS key, LOWER(TRIM(c.name)) AS name FROM Customer c) n ON n.key = o.customer
```

## Not supported

| Refused | Write instead |
|---|---|
| `RIGHT JOIN` | Swap the tables and use `LEFT JOIN` |
| `FULL JOIN`, `CROSS JOIN`, `NATURAL JOIN` | Two `LEFT JOIN`s and a `UNION`; a join on a constant column; name the columns in `USING` |
| An expression in `ON` | Compute it in a derived table first |

```sql
-- Refused by the engine
SELECT a.x FROM Customer a RIGHT JOIN Order b ON a.key = b.customer
```

```sql
-- Refused by the engine
SELECT a.x FROM Customer a JOIN Order b ON lower(a.key) = b.customer
```

## See also

[SELECT](../commands/select.md) · [VIA](../clauses/via.md) · [WITH](../clauses/with.md) · [CREATE RELATION](../commands/create-relation.md)
