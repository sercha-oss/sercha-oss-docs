---
title: "ARRAY_AGG"
description: "The values of a group collected into a list."
---

# ARRAY_AGG

[Functions › Aggregate](../functions.md#aggregate)

Collects the values of a group into a list, one entry per row.

## Syntax

```text
ARRAY_AGG( <expression> )
```

## Arguments

| Argument | Description |
|---|---|
| `<expression>` | The values to collect. |

## Returns

A list of the values. NULLs are kept as entries. Without `GROUP BY` and with no matching rows, an empty list.

## Usage notes

- The list follows the order the rows were read in, which the query does not fix. Use [STRING_AGG](../functions/string_agg.md) when you need a stable order, or sort the list after reading it.
- Repeated values appear once per row.
- `ARRAY_AGG` always runs after the rows are read, never in the data store. Aggregate or filter first on large tables.

## Examples

The order keys of each customer:

```sql
SELECT o.customer, ARRAY_AGG(o.key) AS orders, COUNT(*) AS n
FROM Order o
GROUP BY o.customer
```

| customer | orders | n |
|---|---|---|
| C-1 | [O-10, O-14, O-9] | 3 |
| C-2 | [O-11] | 1 |

## Not supported

| Refused | Write instead |
|---|---|
| `ARRAY_AGG(DISTINCT x)` | `ARRAY_AGG` over a derived table of `SELECT DISTINCT` values |
| `ARRAY_AGG(x ORDER BY y)` | Sort the list after reading it, or use `STRING_AGG` |
| `ARRAY_AGG(x) FILTER (WHERE ...)` | Filter in `WHERE`, or in a derived table first |
| `json_agg`, `jsonb_agg` | `ARRAY_AGG` |
| `ARRAY_AGG(...) OVER (...)` | `ARRAY_AGG` with `GROUP BY` in a derived table, joined back |

```sql
-- Refused by the engine
SELECT o.customer, ARRAY_AGG(DISTINCT o.status) AS s FROM Order o GROUP BY o.customer
```

```sql
-- Refused by the engine
SELECT o.customer, ARRAY_AGG(o.key ORDER BY o.placed_at) AS s FROM Order o GROUP BY o.customer
```

```sql
-- Refused by the engine
SELECT o.customer, ARRAY_AGG(o.key) FILTER (WHERE o.amount > 0) AS s FROM Order o GROUP BY o.customer
```

```sql
-- Refused by the engine
SELECT o.customer, JSON_AGG(o.key) AS s FROM Order o GROUP BY o.customer
```

```sql
-- Refused by the engine
SELECT o.key, ARRAY_AGG(o.status) OVER (PARTITION BY o.customer) AS s FROM Order o
```

## See also

[STRING_AGG](../functions/string_agg.md) · [COUNT](../functions/count.md) · [GROUP BY](../clauses/group-by.md)
