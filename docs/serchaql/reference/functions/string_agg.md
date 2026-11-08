---
title: "STRING_AGG"
description: "The values of a group joined into one string with a separator."
---

# STRING_AGG

[Functions › Aggregate](../functions.md#aggregate)

Joins the non-NULL values of a group into one string, with a separator between them.

## Syntax

```text
STRING_AGG( <expression>, '<separator>' )
```

## Arguments

| Argument | Description |
|---|---|
| `<expression>` | The values to join. Numbers and other types are turned into text. |
| `'<separator>'` | A string literal put between values, such as `', '`. It cannot be a column. |

## Returns

Text. NULL when the group has no non-NULL value.

## Usage notes

- The values are joined in ascending text order, not in the order the rows were read. The result is the same from run to run.
- NULLs are skipped. An empty text value is treated as NULL.
- Repeated values appear once per row. For each value once, aggregate over a derived table of `SELECT DISTINCT` values.
- On large tables it runs in the data store when `<expression>` is a text, integer or boolean column; otherwise it runs after the rows are read.

## Examples

The orders of each customer as one line:

```sql
SELECT o.customer, STRING_AGG(o.key, ', ') AS orders
FROM Order o
GROUP BY o.customer
```

| customer | orders |
|---|---|
| C-1 | O-10, O-14, O-9 |
| C-2 | O-11 |

Each status once per customer:

```sql
SELECT d.customer, STRING_AGG(d.status, ' / ') AS statuses
FROM (SELECT DISTINCT o.customer AS customer, o.status AS status FROM Order o) d
GROUP BY d.customer
```

| customer | statuses |
|---|---|
| C-1 | closed / open |
| C-2 | open |

## Not supported

| Refused | Write instead |
|---|---|
| `STRING_AGG(DISTINCT x, ', ')` | `STRING_AGG` over a derived table of `SELECT DISTINCT` values |
| `STRING_AGG(x, ', ' ORDER BY y)`, `WITHIN GROUP (ORDER BY y)` | Nothing needed: values are always joined in ascending order |
| A column as the separator | A string literal |
| `STRING_AGG(...) OVER (...)` | `STRING_AGG` with `GROUP BY` in a derived table, joined back |

```sql
-- Refused by the engine
SELECT o.customer, STRING_AGG(DISTINCT o.status, ', ') AS s FROM Order o GROUP BY o.customer
```

```sql
-- Refused by the engine
SELECT o.customer, STRING_AGG(o.key, ', ' ORDER BY o.placed_at) AS s FROM Order o GROUP BY o.customer
```

```sql
-- Refused by the engine
SELECT o.customer, STRING_AGG(o.key, ', ') WITHIN GROUP (ORDER BY o.key) AS s FROM Order o GROUP BY o.customer
```

```sql
-- Refused by the engine
SELECT o.customer, STRING_AGG(o.key, o.separator) AS s FROM Order o GROUP BY o.customer
```

```sql
-- Refused by the engine
SELECT o.key, STRING_AGG(o.status, ', ') OVER (PARTITION BY o.customer) AS s FROM Order o
```

## See also

[ARRAY_AGG](../functions/array_agg.md) · [CONCAT_WS](../functions/concat_ws.md) · [COUNT](../functions/count.md) · [GROUP BY](../clauses/group-by.md)
