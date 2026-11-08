---
title: "CREATE RELATION"
description: "Declare a kind of link between two model entities."
---

# CREATE RELATION

[Commands › Relations](../commands.md#relations) · Admins only, through `sercha_define` or a tenant file

Declares a kind of link between two entities of the model, built by a query that returns one row per link. Once created, the relation is read by name and walked with [JOIN](../clauses/join.md).

## Syntax

```text
CREATE [ OR REPLACE ] RELATION <name> ( <From> <verb> <To> )
  [ DESCRIPTION '<text>' ]
  { AS <select>
  | INFER FROM ( <select> ) JUDGE '<rule>' }
```

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | The relation's name, used in queries: `JOIN placed r ON ...`. |
| `<From>`, `<To>` | The entities at each end. |
| `<verb>` | How the link reads from `<From>` to `<To>`: `Customer places Order`. |
| `DESCRIPTION '<text>'` | What one link means. Agents read it to decide when to walk the relation. |
| `AS <select>` | A query returning `from_key` (a `<From>` key) and `to_key` (a `<To>` key). Other columns are kept on the link. |
| `INFER FROM ( <select> ) JUDGE '<rule>'` | Candidate pairs with an `evidence` column; a model decides each pair against the rule. Use it when no column states the link outright. |

## Usage notes

- `REFRESH RELATION <name>` judges an inferred relation again.

## Examples

```sql
CREATE OR REPLACE RELATION placed (Customer places Order)
  DESCRIPTION 'The customer whose account a purchase order is raised against.'
  AS SELECT o.customer AS from_key, o.key AS to_key FROM Order o;
```

Walk it:

```sql
SELECT c.key AS customer, o.key AS order_key
FROM Customer c
JOIN placed r ON r.from_key = c.key
JOIN Order o ON o.key = r.to_key
```

A judged relation:

```sql
CREATE OR REPLACE RELATION about (Ticket concerns Product)
  DESCRIPTION 'The product a support ticket is about.'
  INFER FROM (
    SELECT t.key AS from_key, p.key AS to_key,
           CONCAT('Ticket: ', t.title, '. Product: ', p.name) AS evidence
    FROM Ticket t JOIN Product p ON p.area = t.area
  )
  JUDGE 'The ticket reports a problem with, or asks how to use, this product.';
```

## See also

[CREATE ENTITY](../commands/create-entity.md) · [REFRESH RELATION](../commands/refresh-relation.md) · [DROP RELATION](../commands/drop-relation.md) · [JOIN](../clauses/join.md) · [SHOW LINKS](../commands/show-links.md)
