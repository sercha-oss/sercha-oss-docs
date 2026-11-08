---
title: "CASE"
description: "Choose a value by testing conditions in order."
---

# CASE

[Operators and expressions](../operators-and-expressions.md)

Returns the result of the first `WHEN` whose condition holds, or the `ELSE` value when none does. It works anywhere an expression does.

## Syntax

```text
SELECT CASE
         WHEN <condition> THEN <result>
         [ WHEN <condition> THEN <result> ... ]
         [ ELSE <default> ]
       END [ AS <alias> ]
FROM <source> [ <alias> ]
...

-- simple form: compare one value with each WHEN
CASE <value>
  WHEN <match> THEN <result>
  [ WHEN <match> THEN <result> ... ]
  [ ELSE <default> ]
END
```

## Parameters

| Parameter | Description |
|---|---|
| `<condition>` | A boolean expression. A NULL condition counts as false. |
| `<value>`, `<match>` | In the simple form, `<value>` is compared with each `<match>` by `=`. A NULL `<value>` matches no `WHEN`, not even `WHEN NULL`. |
| `<result>` | The value returned when its `WHEN` holds. |
| `<default>` | The value when no `WHEN` holds. Without `ELSE`, NULL. |

## Usage notes

- The `WHEN`s are tested in order and the first that holds wins. Later results are not evaluated.
- Inside an aggregate, `CASE` counts or sums a subset: `SUM(CASE WHEN o.status = 'open' THEN o.amount ELSE 0 END)`. This replaces `FILTER (WHERE ...)`, which is refused.
- `CASE` with a single `WHEN ... THEN ... ELSE` replaces `IF` and `IIF` from other dialects.
- To test for NULL, use `WHEN x IS NULL`, not the simple form.

## Examples

Band orders by size:

```sql
SELECT o.key, o.amount,
       CASE WHEN o.amount >= 10000 THEN 'large'
            WHEN o.amount >= 1000  THEN 'medium'
            ELSE 'small' END AS band
FROM Order o
```

| key | amount | band |
|---|---|---|
| PO-1001 | 1200 | medium |
| PO-1017 | 45000 | large |
| PO-1002 | 310 | small |

The simple form:

```sql
SELECT o.key, CASE o.status WHEN 'open' THEN 1 WHEN 'held' THEN 2 ELSE 3 END AS sort_rank
FROM Order o
ORDER BY sort_rank
```

Conditional aggregates, one row per customer:

```sql
SELECT o.customer,
       COUNT(CASE WHEN o.status = 'open' THEN 1 END) AS open_orders,
       SUM(CASE WHEN o.status = 'closed' THEN o.amount ELSE 0 END) AS closed_total
FROM Order o
GROUP BY o.customer
```

## Not supported

| Refused | Write instead |
|---|---|
| `CASE` with no `WHEN` | At least one `WHEN ... THEN ...` |
| `IF(...)`, `IIF(...)` | `CASE WHEN ... THEN ... ELSE ... END` |
| `COUNT(*) FILTER (WHERE ...)` | `COUNT(CASE WHEN ... THEN 1 END)` |

```sql
-- Refused by the engine
SELECT CASE ELSE 1 END FROM Order o
```

```sql
-- Refused by the engine
SELECT COUNT(*) FILTER (WHERE o.status = 'open') FROM Order o
```

```sql
-- Refused by the engine
SELECT iif(o.amount > 1000, 'big', 'small') FROM Order o
```

## See also

[COALESCE](../functions/coalesce.md) · [NULLIF](../functions/nullif.md) · [Operators](../clauses/operators.md) · [SUM](../functions/sum.md) · [COUNT](../functions/count.md)
