---
title: "DATE_TRUNC"
description: "A date or timestamp cut back to the start of its year, month, week or other unit."
---

# DATE_TRUNC

[Functions › Date and time](../functions.md#date-and-time)

Cuts a date or timestamp back to the start of a unit: the first day of its month, the Monday of its week, the top of its hour. The usual way to group rows by period.

## Syntax

```text
DATE_TRUNC( '<unit>', <date_or_timestamp> )
```

## Arguments

| Argument | Description |
|---|---|
| `'<unit>'` | One of `year`, `quarter`, `month`, `week`, `day`, `hour`, `minute`, in any case. |
| `<date_or_timestamp>` | A date or timestamp, or text that reads as one (`2026-03-14`, `2026-03-14 09:30:00`, `2026-03-14T09:30:00Z`). |

## Returns

Text. A date input gives a date (`2026-03-01`); a timestamp input gives a timestamp to the second (`2026-03-01 00:00:00`). NULL when either argument is NULL.

## Usage notes

- `week` starts on Monday.
- Any other unit, such as `second` or `decade`, fails the query. So does a value that does not read as a date or timestamp.
- Because the result is text in ISO form, it sorts and compares in time order.
- Runs after the rows are read; it is not pushed to the data store.

## Examples

Orders per month:

```sql
SELECT DATE_TRUNC('month', o.placed_at) AS month, COUNT(*) AS orders
FROM Order o
GROUP BY DATE_TRUNC('month', o.placed_at)
ORDER BY month
```

| month | orders |
|---|---|
| 2026-08-01 00:00:00 | 112 |
| 2026-09-01 00:00:00 | 131 |
| 2026-10-01 00:00:00 | 98 |

Tickets opened per week, on a date column:

```sql
SELECT DATE_TRUNC('week', t.opened_on) AS week_of, COUNT(*) AS opened
FROM Ticket t
GROUP BY DATE_TRUNC('week', t.opened_on)
ORDER BY week_of
```

| week_of | opened |
|---|---|
| 2026-10-19 | 14 |
| 2026-10-26 | 9 |

## See also

[DATE_PART](../functions/date_part.md) · [EXTRACT](../functions/extract.md) · [CURRENT_DATE](../functions/current_date.md) · [TRUNC](../functions/trunc.md) · [GROUP BY](../clauses/group-by.md)
