---
title: "EXTRACT"
description: "One field of a date or timestamp; with epoch, the way to do date arithmetic."
---

# EXTRACT

[Functions › Date and time](../functions.md#date-and-time)

Returns one field of a date or timestamp as a number. `EXTRACT(<field> FROM x)` is the standard SQL spelling of [DATE_PART](../functions/date_part.md) and behaves the same. `EXTRACT(epoch FROM x)` gives seconds since 1970, which is how SerchaQL does date arithmetic: `INTERVAL` and subtracting dates are not available.

## Syntax

```text
EXTRACT( <field> FROM <date_or_timestamp> )
```

## Arguments

| Argument | Description |
|---|---|
| `<field>` | `year`, `quarter`, `month`, `week`, `day`, `dow`, `isodow`, `doy`, `hour`, `minute`, `second`, `epoch`, `decade` or `century`, written bare or quoted. See [DATE_PART](../functions/date_part.md) for what each returns. |
| `<date_or_timestamp>` | A date or timestamp, or text that reads as one. |

## Returns

An integer for every field except `second` and `epoch`, which return a float. NULL when the value is NULL.

## Usage notes

- `epoch` is seconds since 1970-01-01 00:00:00 UTC. A date reads as midnight UTC.
- Date arithmetic with epoch seconds:
  - Days between two dates: `(EXTRACT(epoch FROM b) - EXTRACT(epoch FROM a)) / 86400`.
  - Hours between two timestamps: divide by `3600`.
  - "Within the last N days": `EXTRACT(epoch FROM x) >= EXTRACT(epoch FROM CURRENT_DATE) - N * 86400`.
- `EXTRACT(epoch FROM <timestamp column>)` compared with a number literal using `<`, `<=`, `>` or `>=` is pushed to the data store as a filter on the column. Other uses run after the rows are read.
- An unknown field fails the query.

## Examples

Days from order to shipment:

```sql
SELECT o.key,
       (EXTRACT(epoch FROM o.shipped_at) - EXTRACT(epoch FROM o.placed_at)) / 86400 AS days_to_ship
FROM Order o
WHERE o.shipped_at IS NOT NULL
```

| key | days_to_ship |
|---|---|
| O-100 | 2 |
| O-101 | 0.5 |
| O-102 | 6.25 |

Average hours to close a ticket, per month opened:

```sql
SELECT DATE_TRUNC('month', t.opened_at) AS month,
       ROUND(AVG((EXTRACT(epoch FROM t.closed_at) - EXTRACT(epoch FROM t.opened_at)) / 3600), 1) AS avg_hours
FROM Ticket t
WHERE t.closed_at IS NOT NULL
GROUP BY DATE_TRUNC('month', t.opened_at)
```

| month | avg_hours |
|---|---|
| 2026-09-01 00:00:00 | 18.4 |
| 2026-10-01 00:00:00 | 11.2 |

Invoices paid late:

```sql
SELECT i.invoice_no, i.due_date, i.paid_date
FROM data.invoices i
WHERE EXTRACT(epoch FROM i.paid_date) > EXTRACT(epoch FROM i.due_date)
```

Orders in the last 7 days:

```sql
SELECT o.key FROM Order o
WHERE EXTRACT(epoch FROM o.placed_at) >= EXTRACT(epoch FROM CURRENT_DATE) - 7 * 86400
```

Fields by name:

```sql
SELECT o.key, EXTRACT(year FROM o.placed_at) AS year, EXTRACT(month FROM o.placed_at) AS month,
       EXTRACT(dow FROM o.placed_at) AS weekday
FROM Order o
```

| key | year | month | weekday |
|---|---|---|---|
| O-100 | 2026 | 10 | 3 |

## Not supported

| Refused | Write instead |
|---|---|
| `x - INTERVAL '1 day'`, `x + INTERVAL '...'` | `EXTRACT(epoch FROM x) - 86400` and compare epoch values |
| `DATEDIFF`, `DATE_DIFF`, `AGE` | Subtract `EXTRACT(epoch FROM ...)` values and divide by 86400 |

```sql
-- Refused by the engine
SELECT o.key FROM Order o WHERE o.placed_at > o.shipped_at - INTERVAL '1 day'
```

```sql
-- Refused by the engine
SELECT o.key, DATEDIFF('day', o.placed_at, o.shipped_at) AS days FROM Order o
```

```sql
-- Refused by the engine
SELECT o.key, AGE(o.shipped_at, o.placed_at) AS took FROM Order o
```

## See also

[DATE_PART](../functions/date_part.md) · [DATE_TRUNC](../functions/date_trunc.md) · [CURRENT_DATE](../functions/current_date.md) · [Operators](../clauses/operators.md)
