---
title: "CREATE ENTITY"
description: "Declare an entity of the model, of one kind, with its records given by a query."
---

# CREATE ENTITY

[Commands › Model entities](../commands.md#model-entities) · Admins only, through `sercha_define` or a tenant file

Declares an entity of the model: a named kind of thing the organisation's data is about, such as `Customer` or `Order`. Its records are a `SELECT` over landed tables, cleaned tables, datasets or other entities, kept under the entity's name as a view (or a materialized view). Queries then read it by bare name: `FROM Order o`.

## Syntax

```text
CREATE [ OR REPLACE ] ENTITY <Name> <KIND>
  [ OF <Host> [ BY <host_key_column> ] ]
  [ MATERIALISED ]
  [ KEY <column> ]
  [ TITLE <column> ]
  [ TIME <column> [, <column> ] ]
  [ IDENTITY BY <column> [, ...] [ LINKED BY <relation> ] ]
  [ VERSIONS ( <select> ) ]
  [ DESCRIPTION '<text>' ]
  [ AS <select> ]
```

The clauses after `OF` come in any order. `MATERIALIZED` is accepted for `MATERIALISED`.

## Parameters

| Parameter | Description |
|---|---|
| `<Name>` | Capitalised words with letters and digits only, as `Order` or `CodeUnit`. |
| `<KIND>` | What sort of thing the entity is; see the kinds below. `SHOW MODEL KINDS` lists them. |
| `OF <Host>` | The entity this one exists in. Required for `QUALITY`, `FUNCTION`, `DISPOSITION` and `ROLE`; refused for the other kinds. The host must be declared first. |
| `BY <host_key_column>` | The column of the body holding the host's key, so each record names the host record that bears it. `DESCRIBE` then gives a ready walk to the host. |
| `MATERIALISED` | Keep the records as a materialized view instead of a view. Use it when the body aggregates, deduplicates or derives, so it is computed once rather than on every read. |
| `KEY <column>` | The column naming one record. Required with `AS`. |
| `TITLE <column>` | The column people call a record by (a name, a number), shown wherever a record is listed: `SHOW LINKS`, `SHOW RECORDS`, `SHOW LINEAGE`. |
| `TIME <column> [, <column>]` | A `PROCESS` names its start and end (the end empty while it runs); an `EVENT` names its instant. Refused for every other kind. |
| `IDENTITY BY <column>, ...` | Records are built by Sercha from member rows: member rows sharing any value of these columns are one record. The body gives one row per member, with a `member` column naming it. Implies `MATERIALISED`, and the key must be `KEY id`. |
| `LINKED BY <relation>` | With `IDENTITY BY`: a relation whose rows (`from_key`, `to_key`) say two members are the same though they share no value, usually an inferred relation. |
| `VERSIONS ( <select> )` | For a materialised entity: a `SELECT` of two columns, the key and a version of its inputs. Only records whose version changed are computed again. Needs `MATERIALISED`; refused with `IDENTITY BY`. |
| `DESCRIPTION '<text>'` | What one record is. Agents read it to choose the entity. |
| `AS <select>` | The records. The body must give the `KEY` column, the `TIME` columns, the `BY` column and the `TITLE` column under those names. Without `AS` the entity has no records of its own: it is declared so other entities can be `OF` it, and takes no `BY`, `KEY`, `TIME`, `VERSIONS` or `MATERIALISED`. |

The kinds:

| Kind | Needs | Meaning |
|---|---|---|
| `THING` | | Exists on its own and keeps its identity over time: a person, an organisation, a system. |
| `ARTEFACT` | | Information: one content however many copies or versions are kept (a ticket, a contract, a file). |
| `QUALITY` | `OF <Host>` | A value borne by one host, with no identity of its own (a label, a status). |
| `FUNCTION` | `OF <Host>` | What its host is for, realised when a process runs (a capability of a product). |
| `DISPOSITION` | `OF <Host>` | How its host tends to behave under some condition (a rule, a defect). |
| `ROLE` | `OF <Host>` | A status its host has for a while (reviewer, assignee). |
| `PROCESS` | `TIME <start>, <end>` | Unfolds over time from a start to an end, with participants (an order from placed to delivered). |
| `EVENT` | `TIME <at>` | An instant that starts or ends a process (shipped, invoiced, an error raised). |

## Usage notes

- `CREATE ENTITY` of a name that exists is refused; `CREATE OR REPLACE ENTITY` changes it. A change between view and materialized view drops the old one first.
- The body is checked when the statement runs: every named column must be in its select list, and every select item needs a name (`AS`), as for a view.
- An `IDENTITY BY` entity is read as `<Name>`, and its members as `<name>_members` (columns `member` and `id`).
- A bare name is a model entity. `CREATE ENTITY <corpus>.<Entity> ( ... )` and `CREATE TABLE <schema>.<Table> ( ... )` declare an extracted entity instead; see [CREATE ENTITY (extracted)](../commands/create-extracted-entity.md).
- Link entities with [CREATE RELATION](../commands/create-relation.md).

## Examples

A thing, with a title:

```sql
CREATE OR REPLACE ENTITY Customer THING
  KEY key TITLE name
  DESCRIPTION 'An account that places orders.'
  AS SELECT a.account_no AS key, a.name AS name, a.region AS region
     FROM tables.crm.account a;
```

An artefact read from a dataset:

```sql
CREATE OR REPLACE ENTITY Order ARTEFACT
  KEY key
  DESCRIPTION 'A purchase order raised against a customer account.'
  AS SELECT i.order_no AS key, i.customer AS customer, i.amount AS amount, i.status AS status
     FROM data.invoices i;
```

A quality of each order, naming its host record:

```sql
CREATE OR REPLACE ENTITY OrderStatus QUALITY OF Order BY order_key
  KEY id
  AS SELECT CONCAT(o.key, ':', o.status) AS id, o.key AS order_key, o.status AS status
     FROM Order o;
```

A process with a start and an end, materialised and refreshed by key:

```sql
CREATE OR REPLACE ENTITY Fulfilment PROCESS MATERIALISED
  KEY key TIME opened_at, closed_at
  VERSIONS (SELECT f.order_no, f.updated_at FROM data.fulfilments f)
  AS SELECT f.order_no AS key, MIN(f.opened_at) AS opened_at, MAX(f.closed_at) AS closed_at
     FROM data.fulfilments f
     GROUP BY f.order_no;
```

An event:

```sql
CREATE OR REPLACE ENTITY Shipment EVENT
  KEY key TIME shipped_at
  AS SELECT s.tracking_no AS key, s.shipped_at AS shipped_at FROM data.shipments s;
```

Suppliers known by email in one system and by tax number in another, made one by identity:

```sql
CREATE OR REPLACE ENTITY Supplier THING
  KEY id
  IDENTITY BY email, tax_no
  AS SELECT s.id AS member, s.email AS email, s.tax_no AS tax_no FROM tables.crm.supplier s
     UNION ALL
     SELECT v.vendor_id AS member, v.contact_email AS email, v.abn AS tax_no FROM tables.erp.vendor v;
```

A host with no records of its own:

```sql
CREATE ENTITY Product THING;
```

## Not supported

| Refused | Write instead |
|---|---|
| An unknown kind | One of the eight kinds |
| `CREATE TABLE <Name>` with a bare name | `CREATE ENTITY <Name> <KIND> ...` |

```sql
-- Refused by the engine
CREATE ENTITY Order WIDGET KEY key AS SELECT o.key AS key FROM data.invoices o
```

```sql
-- Refused by the engine
CREATE TABLE Order ARTEFACT
```

## See also

[CREATE RELATION](../commands/create-relation.md) · [DROP ENTITY](../commands/drop-entity.md) · [SHOW MODEL](../commands/show-model.md) · [DESCRIBE](../commands/describe.md) · [CREATE ENTITY (extraction)](../commands/create-extracted-entity.md) · [CREATE MATERIALIZED VIEW](../commands/create-materialized-view.md)
