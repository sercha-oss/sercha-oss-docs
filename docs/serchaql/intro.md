---
title: SerchaQL
sidebar_label: Overview
sidebar_position: 1
---

SerchaQL is how you ask Sercha a question. It is SQL, and it reads like PostgreSQL. Sercha holds your organisation's data as tables: the things your business deals with, the systems connected to it, the documents it keeps. You read them with `SELECT`.

```sql
SELECT c.key AS customer, COUNT(*) AS orders, SUM(o.amount) AS spend
FROM Customer c
JOIN placed r ON r.from_key = c.key
JOIN Order o ON o.key = r.to_key
GROUP BY c.key
ORDER BY spend DESC
LIMIT 10
```

Every query runs as you. Rows you have not been granted never appear in a result.

## What you can read

| Write | What it is |
|---|---|
| `FROM Order o` | An entity of your organisation's model: a kind of thing it deals with, by name. |
| `JOIN placed r ON r.from_key = c.key` | A relation of the model: one row per link between two entities. |
| `FROM tables.crm.account t` | A table a connected system landed, as it arrived. |
| `FROM clean.crm.account t` | The same table with names normalised for matching. |
| `FROM data.regions d` | A dataset. Add `AS OF '<time>'` to read it as it was. |
| `FROM books.Invoice i` | An entity read out of documents, with `i._doc` naming the document. |
| `FROM open_orders v` | A saved view, by name. |

To see what your organisation has, an agent calls `catalogue` and `describe`; in SQL, `SHOW MODEL` lists the entities and relations.

## Where to run it

- **From an agent:** the `query` tool over MCP runs one `SELECT` and returns the rows with what each column means.
- **From code:** `POST /api/v1/query` with `{"serchaql": "SELECT ..."}`. See the [API](/api/sercha-api).
- **Admins** define the model, views and tools with the statements under [Commands](reference/commands.md), through `sercha_define` or a tenant file.

## Next

- [Query syntax](reference/query-syntax.md): the parts of a query, in the order you write them.
- [Functions](reference/functions.md): text, number, date, conditional, aggregate and window functions.
- [Commands](reference/commands.md): defining the model, views, tools and access, grouped by object.
