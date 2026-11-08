---
title: "LEAD"
description: "A value from a row after the current one in the partition."
---

# LEAD

[Functions › Window › Other rows](../functions.md#window)

Returns the value of an expression from the row `<offset>` rows after the current row, in the window's order.

## Syntax

```text
LEAD( <expression> [, <offset> [, <default> ] ] ) [ RESPECT NULLS ] OVER (
  [ PARTITION BY <expression> [, ...] ]
  [ ORDER BY <expression> [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] ] )
```

## Arguments

| Argument | Description |
|---|---|
| `<expression>` | The value to read from the later row. |
| `<offset>` | How many rows ahead. An integer literal; default `1`. A negative offset reads back, like `LAG`. |
| `<default>` | The value when there is no row that far ahead in the partition. Default NULL. It must have the type of `<expression>`; an integer and a decimal mix to a decimal. |

## Returns

The type of `<expression>`. NULL, or `<default>`, past the end of the partition.

## Usage notes

- The later row's value is returned as it is, NULL included. `IGNORE NULLS` is refused.
- A frame clause is accepted and has no effect.
- On large tables it runs in the data store when the rest of the query does and `<offset>` is not negative.

## Examples

Each customer's next order and its status:

```sql
SELECT o.customer, o.key, o.placed_at,
       LEAD(o.placed_at) OVER (PARTITION BY o.customer ORDER BY o.placed_at) AS next_order,
       LEAD(o.status, 1, 'none') OVER (PARTITION BY o.customer ORDER BY o.placed_at) AS next_status
FROM Order o
```

| customer | key | placed_at | next_order | next_status |
|---|---|---|---|---|
| C-1 | O-9 | 2026-01-04 | 2026-06-20 | closed |
| C-1 | O-10 | 2026-06-20 | 2026-10-12 | open |
| C-1 | O-14 | 2026-10-12 | NULL | none |
| C-2 | O-11 | 2026-03-18 | NULL | none |

## Not supported

| Refused | Write instead |
|---|---|
| `IGNORE NULLS` | Filter the NULL rows out in a derived table first |
| A column or expression as `<offset>` | An integer literal |

```sql
-- Refused by the engine
SELECT o.key, LEAD(o.amount) IGNORE NULLS OVER (ORDER BY o.placed_at) AS nxt FROM Order o
```

```sql
-- Refused by the engine
SELECT o.key, LEAD(o.amount, o.gap) OVER (ORDER BY o.placed_at) AS nxt FROM Order o
```

## See also

[LAG](../functions/lag.md) · [LAST_VALUE](../functions/last_value.md) · [NTH_VALUE](../functions/nth_value.md) · [OVER](../clauses/over.md)
