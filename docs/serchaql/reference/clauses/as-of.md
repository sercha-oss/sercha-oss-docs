---
title: "AS OF"
description: "Read a dataset table as it was at a past time."
---

# AS OF

[Query syntax](../query-syntax.md)

Reads a dataset table (`data.<table>`) as it stood at a past moment, so a query can compare now with before.

## Syntax

```text
SELECT ...
FROM data.<table> AS OF '<time>' [ [ AS ] <alias> ]
  [ { JOIN | LEFT JOIN } data.<table> AS OF '<time>' [ [ AS ] <alias> ] ON ... ]
...

-- the alias may also come first
FROM data.<table> [ AS ] <alias> AS OF '<time>'
```

## Parameters

| Parameter | Description |
|---|---|
| `data.<table>` | A dataset table, or a `tables.<source>.<table>` or `clean.<source>.<table>` name that points at one. |
| `'<time>'` | A string: `'2026-10-01'`, `'2026-10-01 08:00'`, `'2026-10-01 08:00:00'`, `'2026-10-01 08:00:00.250'`, `'2026-10-01T08:00:00'`, or RFC 3339 with a zone, `'2026-10-01T08:00:00+10:00'`. A time without a zone is UTC. |
| `<alias>` | Written before or after `AS OF`, with or without `AS`. `AS OF` is never read as an alias. |

## Usage notes

- The time must be in the past. A time that has not happened yet is refused when the statement is parsed. A local time written without a zone is read as UTC, so it can land ahead of now.
- Each table in a statement has its own `AS OF`. The same table can be read at two times in one query: join it to itself.
- Give `AS OF` once per table.

## Examples

A dataset as it was on 1 October:

```sql
SELECT d.id, d.status FROM data.invoices d AS OF '2026-10-01 00:00:00'
```

| id | status |
|---|---|
| INV-17 | sent |
| INV-21 | draft |

What changed since then:

```sql
SELECT now_d.id, before_d.status AS was, now_d.status AS is_now
FROM data.invoices now_d
JOIN data.invoices AS OF '2026-10-01' AS before_d ON before_d.id = now_d.id
WHERE now_d.status <> before_d.status
```

| id | was | is_now |
|---|---|---|
| INV-17 | sent | paid |

The alias first, and a time with a zone:

```sql
SELECT r.region, COUNT(*) AS accounts
FROM data.regions r AS OF '2026-09-30T17:00:00+10:00'
GROUP BY r.region
```

## Not supported

| Refused | Write instead |
|---|---|
| `AS OF` on a model entity, a relation, a view or an extracted entity | `AS OF` reads `data.<table>` only |
| A time in the future | A past time, in UTC unless it names a zone |
| `AS OF` given twice for one table | Give it once |
| A time that is not one of the accepted forms | `'YYYY-MM-DD HH:MM:SS'` |

```sql
-- Refused by the engine
SELECT o.key FROM Order o AS OF '2026-10-01'
```

```sql
-- Refused by the engine
SELECT d.id FROM data.invoices d AS OF '2999-01-01'
```

```sql
-- Refused by the engine
SELECT d.id FROM data.invoices AS OF '2026-09-01' d AS OF '2026-10-01'
```

```sql
-- Refused by the engine
SELECT d.id FROM data.invoices d AS OF 'last tuesday'
```

## See also

[FROM](../clauses/from.md) · [JOIN](../clauses/join.md) · [SELECT](../commands/select.md)
