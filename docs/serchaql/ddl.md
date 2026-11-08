---
sidebar_position: 3
title: "Defining"
description: "The admin statements: the model, views, materialized views, tools, named edges, people, access and document extraction."
---

:::note
Every example on this page is parsed by the SerchaQL engine in a test, and every refused form is checked to still be refused. Agents get the same reference from `describe serchaql`.
:::

## Defining the model (admin)

The model names what the organisation's data is about. An entity is a kind of
thing, built by a `SELECT`; a relation is a kind of link between two entities,
built by a `SELECT` returning `from_key` and `to_key`. Both are then queried by
bare name. Kinds: `THING`, `ARTEFACT`, `QUALITY`, `FUNCTION`, `DISPOSITION`,
`ROLE`, `PROCESS`, `EVENT`.

```sql
CREATE OR REPLACE ENTITY Customer THING KEY key
  DESCRIPTION 'An organisation that buys from us, one row per account number.'
  AS SELECT t.account_no AS key, MIN(t.name) AS name, MIN(t.region) AS region
     FROM clean.crm.account t
     GROUP BY t.account_no;
```

```sql
CREATE OR REPLACE ENTITY Order EVENT KEY key TITLE title TIME placed_at
  DESCRIPTION 'A purchase order a customer placed.'
  AS SELECT p.po_no AS key, p.po_no AS title, p.account_no AS customer, p.total AS amount, p.po_date AS placed_at
     FROM tables.drive.purchase_order p;
```

```sql
CREATE OR REPLACE RELATION placed (Customer places Order)
  DESCRIPTION 'The customer whose account a purchase order is raised against.'
  AS SELECT o.customer AS from_key, o.key AS to_key FROM Order o;
```

A relation can be judged instead of computed: `INFER FROM` gives candidate
pairs with an `evidence` column, and a model decides each pair against the
`JUDGE` rule. `REFRESH RELATION <name>` judges again.

```sql
CREATE OR REPLACE RELATION about (Ticket concerns Product)
  DESCRIPTION 'The product a support ticket is about.'
  INFER FROM (
    SELECT t.key AS from_key, p.key AS to_key, CONCAT('Ticket: ', t.title, '. Product: ', p.name) AS evidence
    FROM Ticket t JOIN Product p ON p.area = t.area
  )
  JUDGE 'The ticket reports a problem with, or asks how to use, this product.';
```

Other model statements:

- `DROP ENTITY [IF EXISTS] <Name>`, `DROP RELATION [IF EXISTS] <name>`.
- `ALTER TABLE <layer name> RENAME TO tables.<source>.<table>`: give a landed
  table its layer name.
- `ALTER TABLE <layer name> SET MODEL IGNORE` / `DROP MODEL IGNORE`: leave a
  table out of model coverage.
- `ALTER TABLE tables.<source>.<table> NORMALISE <col> BY CASE, PUNCTUATION, PLURAL [, ALSO <col>] [KEEP <col>, ...]`
  builds `clean.<source>.<table>`; `DROP NORMALISE` removes it; `REFRESH TABLE clean.<source>.<table>` rebuilds it.

```sql
ALTER TABLE tables.crm.account NORMALISE name BY CASE, PUNCTUATION, PLURAL KEEP account_no;
```

## Views, materialized views and tools (admin)

A **view** is a saved `SELECT`, run each time it is read. A **materialized
view** stores its result and is read from the store; `REFRESH MATERIALIZED
VIEW` recompiles its text and runs it again. Use a materialized view for a
step many queries share or one that is slow to compute.

```sql
CREATE OR REPLACE VIEW open_orders AS
SELECT o.key, o.customer, o.amount FROM Order o WHERE o.closed_at IS NULL;
```

```sql
CREATE OR REPLACE MATERIALIZED VIEW customer_totals AS
SELECT o.customer AS customer, COUNT(*) AS orders, SUM(o.amount) AS total
FROM Order o GROUP BY o.customer;
REFRESH MATERIALIZED VIEW customer_totals;
ALTER MATERIALIZED VIEW customer_totals SET AUTO REFRESH ON;
COMMENT ON MATERIALIZED VIEW customer_totals IS 'Orders and spend per customer.';
COMMENT ON COLUMN customer_totals.total IS 'Sum of order amounts, in dollars.';
```

A **tool** is a saved query with typed parameters, used as `:name` in the
body. It appears to agents as an MCP tool of its own, described by its
`COMMENT`s. `CALL` runs one.

```sql
CREATE OR REPLACE TOOL customer_orders (
  customer TEXT COMMENT 'The customer account number.',
  top INTEGER DEFAULT 10 COMMENT 'How many orders to return.'
) COMMENT 'A customer''s most recent orders with their amounts.'
AS SELECT o.key, o.amount, o.placed_at
   FROM Order o
   WHERE o.customer = :customer
   ORDER BY o.placed_at DESC
   LIMIT :top;
```

```sql
CALL customer_orders(customer => 'acme', top => 5);
```

Also: `DROP VIEW`, `DROP MATERIALIZED VIEW`, `DROP TOOL` (each with
`IF EXISTS`), `DETACH PRESET <name>` (take over a preset's views and tools so
the tenant can change them).

## Named edges and people (admin)

A **named edge** links rows of two datasets, views or extracted entities (not `tables.` layer names) by a rule: equal values (`=`),
one column mentioning the other (`MENTIONS`), or a list column naming the
other (`LISTS`). `RESOLVE FUZZY` proposes close matches. `PREVIEW EDGE` shows a
sample before it is stored, `REFRESH EDGES` re-resolves.

```sql
CREATE EDGE order_customer ON data.purchase_orders PLACED_BY data.accounts LINK BY account_no = account_no RESOLVE EXACT;
CREATE EDGE note_mentions_order ON data.notes MENTIONS data.purchase_orders LINK BY body MENTIONS po_no RESOLVE FUZZY;
```

**People** gather each person's identities across sources into one person:

```sql
CREATE PEOPLE staff FROM data.directory KEY (email KIND email) TAG internal;
REFRESH PEOPLE;
```

## Access (admin)

```sql
GRANT SELECT ON DATASET data.regions TO USER 'analyst@example.com';
GRANT SELECT ON CORPUS books TO GROUP 'finance';
REVOKE SELECT ON CORPUS books FROM GROUP 'finance';
```

Privileges: `SELECT`, `USE`, `WRITE`. Objects: `CORPUS`, `DATASET`, `SOURCE`,
a corpus `PARTITION`. Model entities and relations are read with the grants
on the tables they are made from.

## Extracting entities from documents (admin)

This is the older layer, still supported: an ontology declares the entities to
read out of documents, a corpus collects the documents, and a binding runs
extraction. New work usually lands documents as tables and builds the model
over them instead.

```sql
CREATE ONTOLOGY books;
CREATE ENTITY books.Invoice (
  invoice_no TEXT KEY EXTRACT 'The invoice number as printed',
  supplier TEXT EXTRACT 'The supplier name',
  total NUMERIC EXTRACT 'The invoice total including tax'
) ROOT SINGULAR PER DOC;
CREATE CORPUS books ON drive."Finance"."Invoices" USING ONTOLOGY books PARTITION BY FOLDER;
BIND CORPUS books TO ONTOLOGY books;
```

The rest of this layer: `ALTER ENTITY ... ADD COLUMN | DROP COLUMN | SET
DESCRIPTION | SET NATURAL KEY | ALTER COLUMN ... SET SENSITIVE`; `CREATE RECORD
TYPE`; `CREATE EDGE <ontology>.<name> ON ... LINK BY ... RESOLVE`; `CREATE
STRUCTURE`; `ALTER CORPUS ... ADD PATH | REPARTITION | ATTACH DATASET | DETACH
DATASET`; `UNBIND` and `REBIND CORPUS`; `ALTER BINDING ... SET HINT | SET WINDOW
| DROP WINDOW | PRUNE GENERATIONS`; `RUN BINDING ... [ESTIMATE]`; `CANCEL RUN`;
`DROP RUN`, `DROP GRAPH ON RUN`, `DROP NODE`, `DROP GRAPH EDGE`. A `REBIND`
hides the corpus's rows until the next run completes.
