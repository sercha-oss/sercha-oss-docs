---
title: "FIRST_VALUE"
description: "The value from the first row of the window frame."
---

# FIRST_VALUE

[Functions › Window › Other rows](../functions.md#window)

Returns the value of an expression from the first row of the current row's window frame.

## Syntax

```text
FIRST_VALUE( <expression> ) [ RESPECT NULLS ] OVER (
  [ PARTITION BY <expression> [, ...] ]
  [ ORDER BY <expression> [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] ]
  [ <frame> ] )
```

```text
<frame> ::= { ROWS | RANGE } { <start> | BETWEEN <start> AND <end> }
<start>, <end> ::= UNBOUNDED PRECEDING | <n> PRECEDING | CURRENT ROW | <n> FOLLOWING | UNBOUNDED FOLLOWING
```

## Arguments

| Argument | Description |
|---|---|
| `<expression>` | The value to read. |

## Returns

The type of `<expression>`. NULL when the frame is empty, or when the first row's value is NULL.

## Usage notes

- Without a frame clause, the frame runs from the start of the partition to the current row (and the rows tied with it) when the window has an `ORDER BY`, and is the whole partition when it has none. Either way the first row is the first row of the partition.
- With `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` the first row moves with the current row.
- `RANGE` frames take only `UNBOUNDED PRECEDING`, `CURRENT ROW` and `UNBOUNDED FOLLOWING` bounds.
- A NULL value is returned as it is. `IGNORE NULLS` is refused.
- `FIRST_VALUE` runs after the rows are read, not in the data store.

## Examples

Each customer's first order next to every order:

```sql
SELECT o.customer, o.key, o.placed_at,
       FIRST_VALUE(o.key) OVER (PARTITION BY o.customer ORDER BY o.placed_at) AS first_order
FROM Order o
```

| customer | key | placed_at | first_order |
|---|---|---|---|
| C-1 | O-9 | 2026-01-04 | O-9 |
| C-1 | O-10 | 2026-06-20 | O-9 |
| C-1 | O-14 | 2026-10-12 | O-9 |
| C-2 | O-11 | 2026-03-18 | O-11 |

## Not supported

| Refused | Write instead |
|---|---|
| `IGNORE NULLS` | Filter the NULL rows out in a derived table first |
| `RANGE` with a numeric offset, `GROUPS` frames | A `ROWS` frame |

```sql
-- Refused by the engine
SELECT o.key, FIRST_VALUE(o.status) IGNORE NULLS OVER (ORDER BY o.placed_at) AS s FROM Order o
```

```sql
-- Refused by the engine
SELECT o.key, FIRST_VALUE(o.key) OVER (ORDER BY o.amount RANGE BETWEEN 50 PRECEDING AND CURRENT ROW) AS k FROM Order o
```

## See also

[LAST_VALUE](../functions/last_value.md) · [NTH_VALUE](../functions/nth_value.md) · [LAG](../functions/lag.md) · [OVER](../clauses/over.md)
