---
title: "FROM"
description: "Name the table a SELECT reads."
---

# FROM

[Query syntax](../query-syntax.md)

Names the table a `SELECT` reads, and the alias its columns are read through. Every `SELECT` needs one.

## Syntax

```text
SELECT ...
FROM <source> [ [ AS ] <alias> ]
  [ <join> ... ]
[ WHERE ... ]
...

<source> ::=
    <Entity>                       -- a model entity
  | <relation>                     -- a model relation
  | <view>                         -- a view or materialized view
  | <cte_name>                     -- a CTE of this statement
  | tables.<source>.<table>        -- a landed table
  | clean.<source>.<table>         -- a normalised table
  | data.<table> [ AS OF '<time>' ] -- a dataset table
  | <corpus>.<Entity>              -- an extracted entity
  | ( <select> )                   -- a derived table; the alias is required
```

## Parameters

| Parameter | Description |
|---|---|
| `<Entity>` | A model entity by its bare name, as `CREATE ENTITY` made it: `Order`, `Customer`. One row per instance. |
| `<relation>` | A model relation by its bare name, as `CREATE RELATION` made it: `placed`. One row per link, with `from_key` and `to_key`. |
| `<view>` | A view or materialized view by its bare name. A materialized view reads its stored result. |
| `<cte_name>` | A name defined in this statement's `WITH`. See [WITH](../clauses/with.md). |
| `tables.<source>.<table>` | A table a connector landed, with columns as the source names them. |
| `clean.<source>.<table>` | The same table after `ALTER TABLE ... NORMALISE`. See [ALTER TABLE NORMALISE](../commands/alter-table-normalise.md). |
| `data.<table>` | A dataset table, written by a connector or an import. `AS OF` reads it at a past time. See [AS OF](../clauses/as-of.md). |
| `<corpus>.<Entity>` | An entity extracted from the documents of a corpus: `books.Invoice`. Every row has `_doc` and `_source_key`. |
| `( <select> )` | A derived table: any `SELECT`, including a set operation. See [Subqueries](../clauses/subqueries.md). |
| `<alias>` | The name the query reads the source's columns through: `o.amount`. Written bare or after `AS`. |

## Usage notes

- A bare name is looked up in this order: a CTE of the statement, then a corpus, then a materialized view, then a view. Model entities and relations are kept as views under their names, so a CTE with the same name as an entity hides the entity.
- A `tables.` or `clean.` name is a catalogue entry that points at a stored table. A name that is not in the catalogue fails with `no such table; SHOW TABLES lists them`.
- Without an alias, a `tables.` or `clean.` table is read through its last part: `tables.drive.file` reads as `file`. A joined bare name without an alias is read through that name.
- Write an alias on every source and qualify every column. It keeps the query readable when you add a join later.
- Only one source follows `FROM`. Add more with [JOIN](../clauses/join.md).
- Rows the caller is not granted never appear, whatever the source.

## Examples

A model entity:

```sql
SELECT o.key, o.status, o.amount FROM Order o LIMIT 10
```

| key | status | amount |
|---|---|---|
| PO-1001 | open | 1200 |
| PO-1002 | closed | 310 |

A model relation, walked from customers to their orders:

```sql
SELECT c.key AS customer, r.to_key AS order_key
FROM Customer c
JOIN placed r ON r.from_key = c.key
```

A landed table and its normalised form:

```sql
SELECT t.id, t.name FROM tables.crm.account t WHERE t.region = 'APAC'
```

```sql
SELECT t.name, COUNT(*) AS rows_with_name FROM clean.crm.account t GROUP BY t.name
```

A dataset table and an extracted entity:

```sql
SELECT d.account_id, d.region FROM data.regions d
```

```sql
SELECT a._doc, a.invoice_no, a.total FROM books.Invoice a WHERE a.total > 10000
```

A derived table:

```sql
SELECT big.customer, big.orders
FROM (SELECT o.customer AS customer, COUNT(*) AS orders FROM Order o GROUP BY o.customer) big
WHERE big.orders > 10
```

## Not supported

| Refused | Write instead |
|---|---|
| `FROM a, b` | `FROM a JOIN b ON ...` |
| A derived table without an alias | `FROM ( <select> ) d` |
| `SELECT` without `FROM` | Select from a table |
| `tables.<source>` with no table | `tables.<source>.<table>` |

```sql
-- Refused by the engine
SELECT o.key, c.name FROM Order o, Customer c
```

```sql
-- Refused by the engine
SELECT x.k FROM (SELECT o.key AS k FROM Order o)
```

```sql
-- Refused by the engine
SELECT t.id FROM tables.crm t
```

## See also

[SELECT](../commands/select.md) · [JOIN](../clauses/join.md) · [AS OF](../clauses/as-of.md) · [WITH](../clauses/with.md) · [Subqueries](../clauses/subqueries.md) · [CREATE ENTITY](../commands/create-entity.md) · [CREATE VIEW](../commands/create-view.md)
