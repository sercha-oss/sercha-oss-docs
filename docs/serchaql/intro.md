---
sidebar_position: 1
title: "What SerchaQL is"
description: "SQL over the model, landed tables, datasets, extracted entities and views: what you can read and how."
---

:::note
Every example on this page is parsed by the SerchaQL engine in a test, and every refused form is checked to still be refused. Agents get the same reference from `describe serchaql`.
:::

SerchaQL is SQL over everything Sercha holds: the model (entities and the
relations between them), the tables connectors land, cleaned tables, datasets,
extracted document entities and saved views. It reads like PostgreSQL. This
page lists what it accepts today. Every example on it is parsed by the engine
in a test, and every form under "Refused" is checked to still be refused, so
the page cannot drift from the code.

Two kinds of statement:

- **Reading**: one `SELECT` (plus `WITH`, set operations and a few read-only
  `SHOW` forms). This is what the `query` tool runs.
- **Defining**: `CREATE`, `ALTER`, `DROP`, `REFRESH`, `GRANT` and the rest.
  Admins run these (`sercha_define`, or a tenant file applied by an admin).

## What you can read

| Write | Reads | When |
|---|---|---|
| `FROM Order o` | A model entity, by its bare name | Questions about the things the organisation deals with. Start here when there is a model. |
| `JOIN placed r ON r.from_key = c.key` | A model relation: one row per link, `from_key` and `to_key` | Walking from one entity to another. |
| `FROM tables.<source>.<table> t` | A table a connector landed, as it arrived | Raw source rows; columns as the source names them. |
| `FROM clean.<source>.<table> t` | The same table after `NORMALISE` | Matching on names that differ only in case, punctuation or plurals. |
| `FROM data.<table> d` | A dataset table | Structured data written by a connector or an import. |
| `FROM data.<table> d AS OF '<UTC time>'` | A dataset as it was at a past time | Comparing now with before. Only `data.` tables; only past times. |
| `FROM corpus.Entity e` | An entity extracted from documents | Facts read out of documents. `e._doc` is the source document. |
| `FROM <view> v` | A saved view or materialized view, by name | Reuse a definition someone already wrote. |

```sql
SELECT o.key, o.title FROM Order o LIMIT 10
```

A model walk: customers and the orders they placed.

```sql
SELECT c.key AS customer, o.key AS order_key, o.title
FROM Customer c
JOIN placed r ON r.from_key = c.key
JOIN Order o ON o.key = r.to_key
LIMIT 20
```

Layer tables and datasets join like any table:

```sql
SELECT t.id, t.title, d.region
FROM tables.crm.account t
JOIN data.regions d ON d.account_id = t.id
```

Extracted entities follow their links with `VIA`, which writes the join for
you; `describe` prints the exact form for each link:

```sql
SELECT a.invoice_no, b.name FROM books.Invoice a JOIN books.Supplier b VIA a.supplier
```

`VIA PERSON` joins two tables on the same person, however each one names them.

Every extracted row has `_doc` (its source document) and `_source_key` (the
connector item it was made from). A dataset written from the same items
carries the same `_source_key`:

```sql
SELECT a._doc, a.total, r.status
FROM books.Invoice a
JOIN data.invoices r ON r._source_key = a._source_key
```

`AS OF` reads a dataset at a past time:

```sql
SELECT d.id, d.stage FROM data.deals d AS OF '2026-10-01 00:00:00'
```
