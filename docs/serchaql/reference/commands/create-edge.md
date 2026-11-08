---
title: "CREATE EDGE"
description: "Declare a named edge that links rows of two relations by a matching rule."
---

# CREATE EDGE

[Commands › Edges](../commands.md#edges) · Admins only, through `sercha_define` or a tenant file

Declares a named edge between two relations: dataset tables, views or extracted entities. The engine resolves the rule over both sides' rows and stores one row per linked pair. Queries follow the edge with [JOIN ... VIA](../clauses/via.md).

## Syntax

```text
CREATE [ OR REPLACE ] EDGE <name>
  ON <relation> [ WHERE <filter> [ AND ... ] ]
  <VERB>
  <relation> [ WHERE <filter> [ AND ... ] ]
  LINK BY <rule> [ { , | AND | OR } <rule> ... ]
  [ RESOLVE { EXACT | FUZZY } ]

<relation> ::= data.<table> | <corpus>.<Entity> | <view>
<filter>   ::= <column> = <literal>
             | <column> <> <literal>
             | <column> IN ( <literal> [, ...] )
             | <column> IS NOT NULL
<rule>     ::= <left column> = <right column>
             | <left column> MENTIONS <right column>
             | <left column> LISTS <right column>
```

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | The edge's name: a lower case identifier, at most 63 characters. Unqualified. A dotted name such as `finance.cites` is an ontology edge instead; see [CREATE EDGE (ontology)](../commands/create-ontology-edge.md). |
| `OR REPLACE` | Replaces an edge of the same name. Without it, an existing name is an error. The name of a shipped bridge preset's edge is always refused. |
| `<relation>` | One side of the edge. `data.<table>` is a dataset table. `<corpus>.<Entity>` (two parts) is an extracted entity. A single name is a view, a preset view or one of your own. |
| `WHERE <filter>` | Restricts that side to the rows it matches. Only simple comparisons on that side's own columns, joined by `AND`. |
| `<VERB>` | Any single word describing how the left reads to the right, such as `PLACED_BY` or `MENTIONS`. It is stored upper case and shown by `SHOW EDGES`; it does not change how rows match. |
| `<left column> = <right column>` | Links rows whose values are equal after normalising: lower case, surrounding quotes and trailing `.:;,!?` removed, runs of spaces collapsed. |
| `<left column> MENTIONS <right column>` | Links a left row to every right row whose normalised value appears as a token in the left text. At most 200 right rows per left row per rule. |
| `<left column> LISTS <right column>` | Reads the left value as a comma separated list and links each item to the right rows equal to it. |
| `RESOLVE EXACT` | The default. Only rule matches are stored. |
| `RESOLVE FUZZY` | Also proposes close but not equal pairs for left rows no rule linked: up to 3 per left row, scored on the `=` rules' columns, with a similarity of at least 0.8. A proposal is stored with `method = 'inferred'` and a `confidence` below 1 (at most 0.9). |

## Usage notes

- Several rules are alternatives: a pair is stored when any rule matches. A pair found by more than one rule is stored once, with every rule listed in `matched_by`.
- The pairs land in the dataset table `data.edge_<name>` (also readable as `edges.<name>`), with columns `left_key`, `right_key`, `matched_by`, `evidence`, `method` and `confidence`. `left_key` and `right_key` hold `_source_key` for a dataset side and `_id` for an entity or view side. A view used as a side needs a column named `_id`.
- An entity or view side is read as the person who declared the edge, so the edge links only what its author can read.
- Each side is read up to 500,000 rows.
- The edge is resolved when it is created, again after a sync of a source it reads, and on [REFRESH EDGES](../commands/refresh-edges.md).
- Try the rule first with [PREVIEW EDGE](../commands/preview-edge.md); it stores nothing.
- `SHOW EDGES` lists every edge, and `DESCRIBE EDGE <name>` shows one with its `JOIN ... VIA` form and pair count.

## Examples

Link orders to the customers they were placed by:

```sql
CREATE EDGE order_customer
  ON data.orders PLACED_BY data.customers
  LINK BY customer_no = account_no;
```

| result |
|---|
| edge order_customer created: 1482 pair(s) in data.edge_order_customer; follow it with JOIN ... VIA order_customer |

Follow it with `VIA`, which the engine rewrites into a join through the edge's table:

```text
SELECT o.order_no, c.name
FROM data.orders o
JOIN data.customers c VIA order_customer
```

The same join written out, reading the pairs directly:

```sql
SELECT o.order_no, c.name, e.matched_by
FROM data.orders o
JOIN data.edge_order_customer e ON e.left_key = o._source_key
JOIN data.customers c ON c._source_key = e.right_key
```

Notes that mention an invoice number, open tickets only, with close matches proposed:

```sql
CREATE OR REPLACE EDGE ticket_invoice
  ON data.tickets WHERE status IN ('open', 'pending') REFERS_TO books.Invoice
  LINK BY body MENTIONS invoice_no, subject = invoice_no
  RESOLVE FUZZY;
```

A product's tag list naming categories:

```sql
CREATE EDGE product_category
  ON data.products IN_CATEGORY data.categories
  LINK BY tags LISTS label;
```

## Not supported

| Refused | Write instead |
|---|---|
| A `tables.<source>.<table>` or `clean.<source>.<table>` side | Read the landed rows through a dataset table (`data.<table>`), a view or a model relation ([CREATE RELATION](../commands/create-relation.md)) |
| An expression or `OR` inside a side's `WHERE` | Filter in a view and use the view as the side |
| `RESOLVE SEMANTIC` | `RESOLVE FUZZY` |

```sql
-- Refused by the engine
CREATE EDGE file_account ON tables.drive.file OWNED_BY data.customers LINK BY owner = account_no
```

```sql
-- Refused by the engine
CREATE EDGE order_customer ON data.orders PLACED_BY data.customers LINK BY customer_no = account_no RESOLVE SEMANTIC
```

## See also

[PREVIEW EDGE](../commands/preview-edge.md) · [REFRESH EDGES](../commands/refresh-edges.md) · [DROP EDGE](../commands/drop-edge.md) · [VIA](../clauses/via.md) · [CREATE EDGE (ontology)](../commands/create-ontology-edge.md) · [SHOW](../commands/show.md)
