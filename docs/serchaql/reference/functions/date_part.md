---
title: "DATE_PART"
description: "One field of a date or timestamp, such as the year, month or epoch seconds."
---

# DATE_PART

[Functions › Date and time](../functions.md#date-and-time)

Returns one field of a date or timestamp as a number. `DATE_PART('<field>', x)` and `EXTRACT(<field> FROM x)` are the same function.

## Syntax

```text
DATE_PART( '<field>', <date_or_timestamp> )
```

## Arguments

| Argument | Description |
|---|---|
| `'<field>'` | The field to return, in any case. See the table below. |
| `<date_or_timestamp>` | A date or timestamp, or text that reads as one. |

| Field | Value |
|---|---|
| `year` | The year, such as `2026`. |
| `quarter` | 1 to 4. |
| `month` | 1 to 12. |
| `week` | The ISO week number, 1 to 53. |
| `day` | The day of the month, 1 to 31. |
| `dow` | The day of the week, 0 (Sunday) to 6 (Saturday). |
| `isodow` | The day of the week, 1 (Monday) to 7 (Sunday). |
| `doy` | The day of the year, 1 to 366. |
| `hour` | 0 to 23. |
| `minute` | 0 to 59. |
| `second` | The seconds, with any fraction: `30.5`. |
| `epoch` | Seconds since 1970-01-01 00:00:00 UTC, with any fraction. |
| `decade` | The year divided by 10, rounded down: `202` for 2026. |
| `century` | `21` for 2026. |

`years`, `months`, `days`, `hours`, `minutes` and `seconds` are accepted for the singular forms.

## Returns

An integer for every field except `second` and `epoch`, which return a float. When `'<field>'` is not a literal the result is a float. NULL when either argument is NULL.

## Usage notes

- A date reads as midnight UTC. A timestamp without a time zone reads as UTC.
- An unknown field fails the query. So does a value that does not read as a date or timestamp.
- For date arithmetic, subtract `epoch` values and divide: 86400 seconds to a day. See [EXTRACT](../functions/extract.md).
- Runs after the rows are read, except as in [EXTRACT](../functions/extract.md): an `epoch` comparison with a number is pushed as a filter.

## Examples

Revenue by year and quarter:

```sql
SELECT DATE_PART('year', o.placed_at) AS year,
       DATE_PART('quarter', o.placed_at) AS quarter,
       SUM(o.total) AS revenue
FROM Order o
GROUP BY DATE_PART('year', o.placed_at), DATE_PART('quarter', o.placed_at)
ORDER BY year, quarter
```

| year | quarter | revenue |
|---|---|---|
| 2026 | 2 | 48210 |
| 2026 | 3 | 52944.5 |

Orders placed at weekends:

```sql
SELECT o.key, o.placed_at
FROM Order o
WHERE DATE_PART('isodow', o.placed_at) >= 6
```

## See also

[EXTRACT](../functions/extract.md) · [DATE_TRUNC](../functions/date_trunc.md) · [CURRENT_DATE](../functions/current_date.md)
