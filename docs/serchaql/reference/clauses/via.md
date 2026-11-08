---
title: "VIA"
description: "Join along a declared link, or on the same person, without writing the join keys."
---

# VIA

[Query syntax](../query-syntax.md)

Joins two tables along a link that has already been declared, so the query does not spell out the keys. `VIA <alias>.<link>` follows a link; `VIA PERSON` matches the same person on both sides.

## Syntax

```text
SELECT ...
FROM <left> [ AS ] <l>
  { JOIN | LEFT JOIN } <right> [ AS ] <r>
    { VIA [ <l>. ]<link>
    | VIA PERSON ( <l>.<column> = <r>.<column> ) }
[ WHERE ... ]
...
```

## Parameters

| Parameter | Description |
|---|---|
| `<link>` | The name of a declared link: an edge of the corpus's ontology between two extracted entities (`CREATE ONTOLOGY EDGE`), or an edge between two tables (`CREATE EDGE`, or a bridge a preset declares). `describe` prints the exact `VIA` form for each link. |
| `<l>.` | The alias of the side the link starts from. Needed when more than one table joined before is an end of the link; optional otherwise. |
| `VIA PERSON ( <l>.<column> = <r>.<column> )` | Joins rows where the two columns name the same person, however each one spells them (an email on one side, a user id on the other). Both columns must be declared as naming a person (`CREATE PEOPLE`). |
| `LEFT JOIN` | Keeps every left row; the right side is NULL where no link exists. |

## Usage notes

- An ontology link's direction comes from the entity types it was declared between, so `FROM Supplier s JOIN Invoice i VIA ...` and the reverse return the same pairs. Only for a link from an entity type to itself does the alias decide: the alias named in `VIA` is the link's source.
- A link name the ontology does not declare, or one that does not connect the two joined entity types, is an error, not an empty result. The error lists the links that do exist.
- A table link (`CREATE EDGE`) becomes a join through the link's table. It works between dataset tables, extracted entities and views, whichever ends the edge was declared on. Joining from a table that is neither end fails and names the ends.
- Both sides of `VIA PERSON` must be dataset tables (`data.<table>`), and the other column's table must come earlier in the `FROM` or joins. The join runs through the people index that `CREATE PEOPLE` builds; a deployment without the people layer refuses it.
- `VIA PERSON` written without the column pair is read as a link named `PERSON`, which fails as an undeclared link. Always give the pair.
- The link name may also be the inverse label an ontology edge was declared with.
- To join on columns you know, use `ON`. See [JOIN](../clauses/join.md).

## Examples

An extracted entity to the entity it links to:

```sql
SELECT a.invoice_no, a.total, b.name AS supplier
FROM books.Invoice a
JOIN books.Supplier b VIA a.supplier
```

| invoice_no | total | supplier |
|---|---|---|
| INV-0042 | 1280.00 | Northwind Traders |
| INV-0043 | 312.50 | Contoso Supply |

Keep invoices with no linked supplier:

```sql
SELECT a.invoice_no, b.name
FROM books.Invoice a
LEFT JOIN books.Supplier b VIA a.supplier
WHERE b.name IS NULL
```

A table link declared with `CREATE EDGE invoice_region`, and a person match:

```text
SELECT i.id, r.region
FROM data.invoices i
JOIN data.regions r VIA i.invoice_region

SELECT i.id, j.id AS submitted_by_approver
FROM data.invoices i
JOIN data.invoices j VIA PERSON (i.approver = j.submitted_by)
```

## Not supported

| Refused | Write instead |
|---|---|
| `VIA` together with `ON` | One of them |
| `VIA PERSON` comparing anything but two qualified columns | `VIA PERSON ( <l>.<column> = <r>.<column> )` |

```sql
-- Refused by the engine
SELECT i.id FROM data.invoices i JOIN data.invoices j VIA PERSON (approver = submitted_by)
```

```sql
-- Refused by the engine
SELECT a.invoice_no FROM books.Invoice a JOIN books.Supplier b VIA a.supplier ON a.supplier_id = b.id
```

## See also

[JOIN](../clauses/join.md) · [CREATE EDGE](../commands/create-edge.md) · [CREATE EDGE (ontology)](../commands/create-ontology-edge.md) · [CREATE PEOPLE](../commands/create-people.md) · [DESCRIBE](../commands/describe.md) · [SHOW LINKS](../commands/show-links.md)
