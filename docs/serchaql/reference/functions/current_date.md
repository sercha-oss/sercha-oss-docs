---
title: "CURRENT_DATE"
description: "Today's date in UTC."
---

# CURRENT_DATE

[Functions › Date and time](../functions.md#date-and-time)

Returns today's date, in UTC.

## Syntax

```text
CURRENT_DATE
CURRENT_DATE()
```

## Returns

A date, such as `2026-11-08`. Never NULL.

## Usage notes

- The date is taken in UTC, not in the caller's time zone.
- There is no date arithmetic on it: `CURRENT_DATE - 30` and `CURRENT_DATE - INTERVAL '30 days'` do not work. Compare epoch seconds instead, as the examples show. See [EXTRACT](../functions/extract.md).
- It is the rewrite for `NOW()`, `CURRENT_TIMESTAMP` and `LOCALTIMESTAMP`, which are refused. There is no current time of day.

## Examples

Open tickets past their due date:

```sql
SELECT t.key, t.due_date
FROM Ticket t
WHERE t.status = 'open' AND t.due_date < CURRENT_DATE
```

| key | due_date |
|---|---|
| T-12 | 2026-11-01 |
| T-19 | 2026-10-28 |

Orders placed in the last 30 days:

```sql
SELECT o.key, o.placed_at
FROM Order o
WHERE EXTRACT(epoch FROM o.placed_at) >= EXTRACT(epoch FROM CURRENT_DATE) - 30 * 86400
```

Days until each invoice is due:

```sql
SELECT i.invoice_no,
       (EXTRACT(epoch FROM i.due_date) - EXTRACT(epoch FROM CURRENT_DATE)) / 86400 AS days_left
FROM data.invoices i
```

| invoice_no | days_left |
|---|---|
| INV-101 | 12 |
| INV-102 | -3 |

## Not supported

| Refused | Write instead |
|---|---|
| `NOW()`, `CURRENT_TIMESTAMP`, `LOCALTIMESTAMP` | `CURRENT_DATE` |
| `CURRENT_DATE - INTERVAL '7 days'` | `EXTRACT(epoch FROM CURRENT_DATE) - 7 * 86400`, compared with `EXTRACT(epoch FROM <column>)` |

```sql
-- Refused by the engine
SELECT o.key FROM Order o WHERE o.placed_at > NOW()
```

```sql
-- Refused by the engine
SELECT o.key FROM Order o WHERE o.placed_at > CURRENT_TIMESTAMP
```

```sql
-- Refused by the engine
SELECT o.key FROM Order o WHERE o.placed_at > CURRENT_DATE - INTERVAL '7 days'
```

## See also

[EXTRACT](../functions/extract.md) · [DATE_TRUNC](../functions/date_trunc.md) · [DATE_PART](../functions/date_part.md)
