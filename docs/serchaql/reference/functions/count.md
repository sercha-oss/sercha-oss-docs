---
title: "COUNT"
description: "The number of rows, non-NULL values or distinct values in a group."
---

# COUNT

[Functions › Aggregate](../functions.md#aggregate)

Counts the rows of a group, the non-NULL values of an expression, or its distinct non-NULL values.

## Syntax

```text
COUNT( * )
COUNT( [ ALL ] <expression> )
COUNT( DISTINCT <expression> )
```

## Arguments

| Argument | Description |
|---|---|
| `*` | Count every row, NULL or not. |
| `<expression>` | A column or an expression. Rows where it is NULL are not counted. |
| `DISTINCT` | Count each distinct non-NULL value once. |

## Returns

An integer. Never NULL: a group with nothing to count gives `0`.

## Usage notes

- `COUNT` is the only aggregate that takes `DISTINCT`.
- An empty text value is treated as NULL, so `COUNT(x)` does not count it.
- Without `GROUP BY` the query returns one row, even when no row matches: `COUNT(*)` is then `0`.
- `COUNT` divided by `COUNT` is integer division and drops the fraction. Multiply one side by `1.0` first.
- Count only the rows that meet a condition with a `CASE` inside: `COUNT(CASE WHEN <condition> THEN 1 END)`.
- `COUNT(*)` and `COUNT(<expression>)` also work as window functions with `OVER (...)`. See [OVER](../clauses/over.md).
- On large tables `COUNT` runs in the data store, `COUNT(DISTINCT ...)` included.

## Examples

Orders and distinct customers per status, and the share of orders per customer:

```sql
SELECT o.status,
       COUNT(*) AS orders,
       COUNT(DISTINCT o.customer) AS customers,
       COUNT(*) * 1.0 / COUNT(DISTINCT o.customer) AS orders_per_customer
FROM Order o
GROUP BY o.status
ORDER BY orders DESC
```

| status | orders | customers | orders_per_customer |
|---|---|---|---|
| open | 40 | 16 | 2.5 |
| closed | 18 | 12 | 1.5 |

Count only some rows of each group:

```sql
SELECT t.status,
       COUNT(*) AS tickets,
       COUNT(CASE WHEN t.priority = 'high' THEN 1 END) AS high
FROM Ticket t
GROUP BY t.status
```

| status | tickets | high |
|---|---|---|
| open | 25 | 7 |
| resolved | 112 | 9 |

Distinct pairs of values, by counting one combined expression:

```sql
SELECT COUNT(DISTINCT o.customer || '|' || o.status) AS customer_statuses FROM Order o
```

## Not supported

| Refused | Write instead |
|---|---|
| `COUNT(DISTINCT a, b)` | `COUNT(DISTINCT a \|\| '\|' \|\| b)` |
| `COUNT(x) FILTER (WHERE ...)` | `COUNT(CASE WHEN ... THEN 1 END)` |
| `COUNT(DISTINCT x) OVER (...)` | `COUNT(DISTINCT x)` with `GROUP BY` in a derived table, joined back |

```sql
-- Refused by the engine
SELECT COUNT(DISTINCT o.customer, o.status) AS n FROM Order o
```

```sql
-- Refused by the engine
SELECT o.status, COUNT(*) FILTER (WHERE o.amount > 100) AS big FROM Order o GROUP BY o.status
```

```sql
-- Refused by the engine
SELECT o.key, COUNT(DISTINCT o.status) OVER (PARTITION BY o.customer) AS n FROM Order o
```

## See also

[SUM](../functions/sum.md) · [AVG](../functions/avg.md) · [GROUP BY](../clauses/group-by.md) · [HAVING](../clauses/having.md) · [DISTINCT](../clauses/distinct.md) · [OVER](../clauses/over.md)
