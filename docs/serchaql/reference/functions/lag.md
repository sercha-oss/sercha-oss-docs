---
title: "LAG"
description: "A value from a row before the current one in the partition."
---

# LAG

[Functions › Window › Other rows](../functions.md#window)

Returns the value of an expression from the row `<offset>` rows before the current row, in the window's order.

## Syntax

```text
LAG( <expression> [, <offset> [, <default> ] ] ) [ RESPECT NULLS ] OVER (
  [ PARTITION BY <expression> [, ...] ]
  [ ORDER BY <expression> [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] ] )
```

## Arguments

| Argument | Description |
|---|---|
| `<expression>` | The value to read from the earlier row. |
| `<offset>` | How many rows back. An integer literal; default `1`. A negative offset reads forward, like `LEAD`. |
| `<default>` | The value when there is no row that far back in the partition. Default NULL. It must have the type of `<expression>`; an integer and a decimal mix to a decimal. |

## Returns

The type of `<expression>`. NULL, or `<default>`, before the start of the partition.

## Usage notes

- The earlier row's value is returned as it is, NULL included. `IGNORE NULLS` is refused; `RESPECT NULLS` is accepted and changes nothing.
- A frame clause is accepted and has no effect.
- Use `LAG` inside an expression to compare a row with the one before: `o.amount - LAG(o.amount) OVER (...)`.
- On large tables it runs in the data store when the rest of the query does and `<offset>` is not negative.

## Examples

The change from each customer's previous order:

```sql
SELECT o.customer, o.key, o.amount,
       LAG(o.amount) OVER (PARTITION BY o.customer ORDER BY o.placed_at) AS previous,
       o.amount - LAG(o.amount, 1, 0) OVER (PARTITION BY o.customer ORDER BY o.placed_at) AS change
FROM Order o
```

| customer | key | amount | previous | change |
|---|---|---|---|---|
| C-1 | O-9 | 40 | NULL | 40 |
| C-1 | O-10 | 100 | 40 | 60 |
| C-1 | O-14 | 250 | 100 | 150 |
| C-2 | O-11 | 80 | NULL | 80 |

## Not supported

| Refused | Write instead |
|---|---|
| `IGNORE NULLS` | Filter the NULL rows out in a derived table first |
| A column or expression as `<offset>` | An integer literal |
| A `<default>` of another type | Cast one side: `CAST(x AS text)` |

```sql
-- Refused by the engine
SELECT o.key, LAG(o.amount) IGNORE NULLS OVER (ORDER BY o.placed_at) AS prev FROM Order o
```

```sql
-- Refused by the engine
SELECT o.key, LAG(o.amount, o.gap) OVER (ORDER BY o.placed_at) AS prev FROM Order o
```

## See also

[LEAD](../functions/lead.md) · [FIRST_VALUE](../functions/first_value.md) · [NTH_VALUE](../functions/nth_value.md) · [OVER](../clauses/over.md)
