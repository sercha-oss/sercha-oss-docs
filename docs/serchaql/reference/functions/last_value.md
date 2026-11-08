---
title: "LAST_VALUE"
description: "The value from the last row of the window frame."
---

# LAST_VALUE

[Functions › Window › Other rows](../functions.md#window)

Returns the value of an expression from the last row of the current row's window frame.

## Syntax

```text
LAST_VALUE( <expression> ) [ RESPECT NULLS ] OVER (
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

The type of `<expression>`. NULL when the frame is empty, or when the last row's value is NULL.

## Usage notes

- With an `ORDER BY` and no frame clause, the frame ends at the current row and the rows tied with it. `LAST_VALUE` then returns the current row's own value (or the last tied row's). To read the last row of the partition, write `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`, or use `FIRST_VALUE` with the order reversed.
- Without `ORDER BY` the frame is the whole partition, in the order the rows were read.
- A NULL value is returned as it is. `IGNORE NULLS` is refused.
- `LAST_VALUE` runs after the rows are read, not in the data store.

## Examples

Each customer's latest order next to every order:

```sql
SELECT o.customer, o.key,
       LAST_VALUE(o.key) OVER (PARTITION BY o.customer ORDER BY o.placed_at
                               ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS latest_order
FROM Order o
```

| customer | key | latest_order |
|---|---|---|
| C-1 | O-9 | O-14 |
| C-1 | O-10 | O-14 |
| C-1 | O-14 | O-14 |
| C-2 | O-11 | O-11 |

The same, with the default frame:

```sql
SELECT o.customer, o.key,
       LAST_VALUE(o.key) OVER (PARTITION BY o.customer ORDER BY o.placed_at) AS so_far
FROM Order o
```

| customer | key | so_far |
|---|---|---|
| C-1 | O-9 | O-9 |
| C-1 | O-10 | O-10 |
| C-1 | O-14 | O-14 |
| C-2 | O-11 | O-11 |

## Not supported

| Refused | Write instead |
|---|---|
| `IGNORE NULLS` | Filter the NULL rows out in a derived table first |
| A `GROUPS` frame, a frame `EXCLUDE` clause | A `ROWS` frame |

```sql
-- Refused by the engine
SELECT o.key, LAST_VALUE(o.status) IGNORE NULLS OVER (ORDER BY o.placed_at) AS s FROM Order o
```

```sql
-- Refused by the engine
SELECT o.key, LAST_VALUE(o.key) OVER (ORDER BY o.placed_at GROUPS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS k FROM Order o
```

## See also

[FIRST_VALUE](../functions/first_value.md) · [NTH_VALUE](../functions/nth_value.md) · [LEAD](../functions/lead.md) · [OVER](../clauses/over.md)
