---
title: "NTH_VALUE"
description: "The value from the nth row of the window frame."
---

# NTH_VALUE

[Functions › Window › Other rows](../functions.md#window)

Returns the value of an expression from the `<n>`th row of the current row's window frame, counting from 1.

## Syntax

```text
NTH_VALUE( <expression>, <n> ) [ RESPECT NULLS ] OVER (
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
| `<n>` | Which row of the frame. A positive integer literal. |

## Returns

The type of `<expression>`. NULL when the frame has fewer than `<n>` rows.

## Usage notes

- With an `ORDER BY` and no frame clause, the frame grows from the start of the partition to the current row, so rows before the `<n>`th get NULL. Write `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` to give every row the answer.
- `NTH_VALUE(x, 1)` is `FIRST_VALUE(x)`.
- `NTH_VALUE` runs after the rows are read, not in the data store.

## Examples

Each customer's second order:

```sql
SELECT o.customer, o.key,
       NTH_VALUE(o.key, 2) OVER (PARTITION BY o.customer ORDER BY o.placed_at
                                 ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS second_order
FROM Order o
```

| customer | key | second_order |
|---|---|---|
| C-1 | O-9 | O-10 |
| C-1 | O-10 | O-10 |
| C-1 | O-14 | O-10 |
| C-2 | O-11 | NULL |

## Not supported

| Refused | Write instead |
|---|---|
| `FROM FIRST` / `FROM LAST` | Reverse the window `ORDER BY` |
| `IGNORE NULLS` | Filter the NULL rows out in a derived table first |
| A column or expression as `<n>` | An integer literal |

```sql
-- Refused by the engine
SELECT o.key, NTH_VALUE(o.key, 2) FROM LAST OVER (ORDER BY o.placed_at) AS k FROM Order o
```

```sql
-- Refused by the engine
SELECT o.key, NTH_VALUE(o.key, o.n) OVER (ORDER BY o.placed_at) AS k FROM Order o
```

## See also

[FIRST_VALUE](../functions/first_value.md) · [LAST_VALUE](../functions/last_value.md) · [ROW_NUMBER](../functions/row_number.md) · [OVER](../clauses/over.md)
