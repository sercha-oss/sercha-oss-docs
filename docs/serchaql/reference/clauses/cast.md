---
title: "CAST"
description: "Convert a value to another type."
---

# CAST

[Operators and expressions](../operators-and-expressions.md)

Converts a value to another type. `CAST(x AS type)` and `x::type` are the same.

## Syntax

```text
SELECT CAST( <expression> AS <type> ) [ AS <alias> ],
       <expression>::<type>
FROM <source> [ <alias> ]
...

<type> ::= integer | int | int4 | int8 | bigint | smallint
         | numeric | decimal | real | float | float4 | float8 | double [ precision ]
         | text | varchar | char | character [ varying ] | string
         | boolean | bool
         | date
         | timestamp | timestamptz | timestamp { with | without } time zone

-- typed literals
DATE '<yyyy-mm-dd>'
TIMESTAMP '<yyyy-mm-dd hh:mm:ss>'
```

## Parameters

| Parameter | Description |
|---|---|
| `<expression>` | Any expression. |
| `<type>` | One of the names above, in any case. A size or precision such as `varchar(20)` or `numeric(10,2)` is accepted and ignored. |

## Usage notes

The engine has six value types, and every type name maps onto one:

| Type names | Result |
|---|---|
| `integer`, `int`, `int4`, `int8`, `bigint`, `smallint` | A 64-bit integer. Text is trimmed, then read as an integer. A number with a fraction is rounded half to even: `2.5` becomes 2, `3.5` becomes 4. `true` is 1 and `false` 0. |
| `numeric`, `decimal`, `real`, `float`, `float4`, `float8`, `double` | A floating-point number. `numeric(10,2)` does not round: use [ROUND](../functions/round.md). |
| `text`, `varchar`, `char`, `character varying`, `string` | Text. A number prints without trailing zeros; a boolean prints as `true` or `false`. |
| `boolean`, `bool` | A boolean. Accepts `true`, `t`, `yes`, `y`, `on`, `1` and `false`, `f`, `no`, `n`, `off`, `0`, in any case. |
| `date` | A date, `YYYY-MM-DD`. Reads a date or a timestamp written `YYYY-MM-DD`, `YYYY-MM-DD HH:MM:SS` or ISO 8601, and keeps the date part. |
| `timestamp`, `timestamptz` | The value's text, unchanged. Comparisons with a timestamp column read text in any accepted date or timestamp form, so this is enough to compare. |

- A value that cannot be converted is an error that stops the query, not NULL. Filter the bad rows first, or test them with `regexp_like`.
- NULL stays NULL in every cast.
- `::` binds tighter than any operator: `-x::integer` is `-(x::integer)`, and `a + b::text` casts only `b`.
- `DATE '2026-10-01'` is the text `'2026-10-01'`. `TIMESTAMP '...'` is a cast to `timestamp`.
- There is no interval type. For date arithmetic, subtract `extract(epoch FROM ...)` values (seconds), or compare dates directly.

## Examples

```sql
SELECT o.key,
       CAST(o.amount AS integer) AS whole_dollars,
       o.quantity::text || ' units' AS label,
       o.placed_at::date AS day
FROM Order o
```

| key | whole_dollars | label | day |
|---|---|---|---|
| PO-1001 | 1200 | 3 units | 2026-09-14 |
| PO-1002 | 310 | 1 units | 2026-09-20 |

Text to numbers, for sorting and arithmetic:

```sql
SELECT t.id, CAST(t.employee_count AS bigint) AS employees
FROM tables.crm.account t
WHERE regexp_like(t.employee_count, '^[0-9]+$')
ORDER BY employees DESC
```

Exact division of two integers:

```sql
SELECT o.customer, CAST(SUM(o.quantity) AS double precision) / COUNT(*) AS average_quantity
FROM Order o
GROUP BY o.customer
```

## Not supported

| Refused | Write instead |
|---|---|
| Any other type: `json`, `interval`, `uuid`, `bytea`, arrays | One of the types above |
| `INTERVAL '7 days'` | Compare dates directly, or subtract `extract(epoch FROM ...)` values |
| `TRY_CAST`, `to_number`, `to_date`, `to_timestamp`, `to_char` | `CAST`, after filtering the values that would fail |

```sql
-- Refused by the engine
SELECT CAST(t.payload AS json) FROM tables.crm.account t
```

```sql
-- Refused by the engine
SELECT o.key FROM Order o WHERE o.placed_at > current_date - INTERVAL '7 days'
```

```sql
-- Refused by the engine
SELECT to_date(o.placed_on, 'YYYY-MM-DD') FROM Order o
```

## See also

[Operators](../clauses/operators.md) · [EXTRACT](../functions/extract.md) · [DATE_TRUNC](../functions/date_trunc.md) · [ROUND](../functions/round.md) · [COALESCE](../functions/coalesce.md)
