---
title: "HAVING"
description: "Keep only the groups that meet a condition."
---

# HAVING

[Query syntax](../query-syntax.md)

Filters the groups that `GROUP BY` makes. Where `WHERE` tests each row before grouping, `HAVING` tests each group after it, so it can use aggregates.

## Syntax

```text
SELECT <group_expression>, ..., <aggregate>( ... ) [ AS <alias> ] [, ...]
FROM <source> [ <alias> ]
[ WHERE <condition> ]
[ GROUP BY <expression> [, ...] ]
HAVING <condition>
[ ORDER BY ... ]
```

## Parameters

| Parameter | Description |
|---|---|
| `<condition>` | A boolean expression over grouping keys and aggregates. An aggregate may be written out (`COUNT(*) > 5`) or named by its SELECT alias (`orders > 5`). |

## Usage notes

- An aggregate in `HAVING` need not appear in the SELECT list: `HAVING SUM(o.amount) > 1000` works when only `COUNT(*)` is selected.
- `HAVING` without `GROUP BY` treats all rows as one group, so the query returns one row or none.
- Put conditions on plain columns in `WHERE` instead: rows are then dropped before grouping, which reads less.

## Examples

Customers with more than five orders:

```sql
SELECT o.customer, COUNT(*) AS orders
FROM Order o
GROUP BY o.customer
HAVING COUNT(*) > 5
ORDER BY orders DESC
```

| customer | orders |
|---|---|
| acme | 14 |
| globex | 7 |

By alias, with an aggregate that is not selected:

```sql
SELECT o.customer, COUNT(*) AS orders
FROM Order o
WHERE o.status = 'open'
GROUP BY o.customer
HAVING orders >= 3 AND SUM(o.amount) > 10000
```

## See also

[GROUP BY](../clauses/group-by.md) · [WHERE](../clauses/where.md) · [COUNT](../functions/count.md) · [SUM](../functions/sum.md)
