---
title: "CREATE ENTITY (extraction)"
description: "Declare an entity of an ontology, with the columns extraction reads out of each document."
---

# CREATE ENTITY (extraction)

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Declares an entity in an ontology: its columns, what each column means to the extraction model, and how many instances a document holds. A qualified name `<ontology>.<Entity>` makes an extraction entity; a bare name makes a model entity instead ([CREATE ENTITY](../commands/create-entity.md)).

## Syntax

```text
{ CREATE ENTITY | CREATE TABLE } <ontology>.<Entity> (
    <column> <type> [ <column option> ... ] [, ...]
    [, KEY ( <column> [, ...] ) ]
  )
  [ <modifier> ... ]
  [ DERIVED FROM ( <select> ) [ INTO CORPUS <corpus> ] ]

<type>          ::= TEXT | VARCHAR | STRING
                  | INTEGER | INT | BIGINT | SMALLINT
                  | FLOAT | REAL | NUMERIC | DECIMAL
                  | BOOLEAN | BOOL
                  | DATE
<column option> ::= KEY
                  | NOT NULL
                  | EXTRACT '<what to read>'
                  | SENSITIVE
                  | CHECK ( <column> IN ( '<value>' [, ...] ) )
<modifier>      ::= ROOT
                  | SINGULAR PER DOC
                  | BOUNDED PER DOC
                  | UNDER [ <ontology>. ]<Parent>
                  | LAZY
                  | STRICT JSON
```

## Parameters

| Parameter | Description |
|---|---|
| `<ontology>.<Entity>` | The ontology and the entity's name. Rows are read as `<corpus>.<Entity>` from a corpus bound to the ontology. |
| `<type>` | The column type. The spellings in each line of the syntax are the same type. |
| `KEY` | Marks a column as part of the entity's key: the values that name one instance. It does not enforce uniqueness. `KEY ( a, b )` in the column list marks several columns at once. |
| `NOT NULL` | The column is required in every extracted instance. |
| `EXTRACT '<what to read>'` | The column's description, shown to the extraction model. Give every column one: a column without a description extracts poorly or not at all. |
| `SENSITIVE` | The column is masked for callers not cleared to see sensitive values. |
| `CHECK ( <column> IN ( ... ) )` | A closed list of allowed values. The column becomes an enum. Only the `IN` list form is accepted. |
| `ROOT` | The entity is what the document is (an Invoice, a Contract). Implies `SINGULAR PER DOC`. An ontology needs exactly one root. |
| `SINGULAR PER DOC` | At most one instance per document. |
| `BOUNDED PER DOC` | A small fixed set per document, more than one. Extraction reuses the instances it already found in earlier sections instead of inventing new ones. |
| `UNDER <Parent>` | The entity is part of `<Parent>` in the same ontology. A `part_of` edge from this entity to the parent is created with it, which is how extraction reaches the entity from the root. |
| `LAZY` | Recorded on the entity and shown in the catalogue. |
| `STRICT JSON` | For a root whose documents are always the same JSON shape: extraction replays a stored format instead of calling a model. The format must be stored before a run. |
| `DERIVED FROM ( <select> )` | The entity is filled by the query, not by extraction. |
| `INTO CORPUS <corpus>` | The corpus a derived entity's rows land in. Without it, the corpus the ontology is bound to. |

## Usage notes

- Column options may come in any order, and so may modifiers.
- A derived entity cannot take `ROOT`, `SINGULAR PER DOC`, `BOUNDED PER DOC`, `STRICT JSON` or `UNDER`. When a target corpus exists, creating a derived entity binds it if needed and starts a run.
- `UNDER` across ontologies is refused when the statement runs.
- New entities reach extraction only after the ontology is frozen again: [REBIND CORPUS](../commands/rebind-corpus.md) then [RUN BINDING](../commands/run-binding.md).
- The entity's own description is set afterwards with [ALTER ENTITY ... SET DESCRIPTION](../commands/alter-entity.md).

## Examples

A root and the lines under it:

```sql
CREATE ENTITY finance.Invoice (
  invoice_no TEXT KEY NOT NULL EXTRACT 'The invoice number as printed on the invoice',
  supplier TEXT EXTRACT 'The legal name of the business that issued the invoice',
  issued_on DATE EXTRACT 'The date the invoice was issued',
  total NUMERIC EXTRACT 'The invoice total including tax',
  status TEXT CHECK (status IN ('draft', 'issued', 'paid')) EXTRACT 'Whether the invoice is a draft, issued or marked paid',
  bank_account TEXT SENSITIVE EXTRACT 'The bank account number payment goes to'
) ROOT;

CREATE ENTITY finance.LineItem (
  description TEXT KEY EXTRACT 'What the line charges for',
  amount NUMERIC EXTRACT 'The line amount excluding tax'
) UNDER Invoice;
```

| result |
|---|
| entity "finance.Invoice" created (collection=finance) |
| entity "finance.LineItem" created (collection=finance) |

A small fixed set per document, with a composite key:

```sql
CREATE ENTITY finance.TaxLine (
  rate NUMERIC EXTRACT 'The tax rate as a percentage',
  region TEXT EXTRACT 'The region the tax applies in',
  KEY (rate, region)
) BOUNDED PER DOC UNDER finance.Invoice;
```

An entity filled by a query:

```sql
CREATE ENTITY finance.Supplier (
  name TEXT KEY EXTRACT 'The supplier name'
) DERIVED FROM (
  SELECT i.supplier AS name FROM books.Invoice i GROUP BY i.supplier
) INTO CORPUS books;
```

## Not supported

| Refused | Write instead |
|---|---|
| `CHECK` with any form but `col IN (...)` | List the allowed values |
| A type outside the list, such as `TIMESTAMP` or `JSON` | `DATE` or `TEXT` |
| `CREATE TABLE <Name>` without a schema | `CREATE TABLE <ontology>.<Name>`, or a model entity with `CREATE ENTITY <Name>` |

```sql
-- Refused by the engine
CREATE ENTITY finance.Invoice (total NUMERIC CHECK (total > 0)) ROOT
```

```sql
-- Refused by the engine
CREATE ENTITY finance.Invoice (issued_at TIMESTAMP) ROOT
```

## See also

[CREATE ONTOLOGY](../commands/create-ontology.md) · [ALTER ENTITY](../commands/alter-entity.md) · [CREATE EDGE (ontology)](../commands/create-ontology-edge.md) · [DROP ENTITY](../commands/drop-entity.md) · [CREATE ENTITY](../commands/create-entity.md) · [BIND CORPUS](../commands/bind-corpus.md)
