---
title: "SHOW LINKS"
description: "Everything one record of the model is linked to, with a count and a sample per link."
---

# SHOW LINKS

[Commands › Looking around](../commands.md#looking-around) · Any caller; rows they are not granted never appear

Lists every declared link that reaches one record: each relation it is the from end of (`out`) or the to end of (`in`), its host when it is `OF` another entity `BY` a column, and the records that are `OF` it. Per link it gives how many records are on the other end and a sample of them.

## Syntax

```text
SHOW LINKS OF <Entity> '<key>' [ LIMIT <n> ]

SHOW LINKS OF clean.<source>.<table> '<_id>' [ LIMIT <n> ]
```

## Parameters

| Parameter | Description |
|---|---|
| `<Entity>` | A model entity with records of its own. |
| `'<key>'` | The record's key, as a quoted string. A bare whole number is also accepted. |
| `clean.<source>.<table> '<_id>'` | A group of a cleaned table: the links of its member rows. The result has one more column, `links`. |
| `LIMIT <n>` | The sample size per link, at least 1. The default is 20 and the most is 200. |

## Usage notes

- Columns: `link` (the relation or host name), `direction` (`out` or `in`), `verb`, `other` (the entity on the other end), `count`, `sample` (keys and titles of records on the other end).
- Every count and sample is a `SELECT` run as the caller, so a caller sees exactly the links a `SELECT` of their own would find.
- The MCP `query` tool runs this statement.
- To read the linked rows in full, walk the relation with [JOIN](../clauses/join.md).

## Examples

```sql
SHOW LINKS OF Customer 'acme' LIMIT 5
```

| link | direction | verb | other | count | sample |
|---|---|---|---|---|---|
| placed | out | places | Order | 41 | PO-1042 (Pallets), PO-1017 (Racking), ... |
| supplies | in | supplies | Supplier | 2 | S-7 (Northwind), S-12 (Contoso) |

```sql
SHOW LINKS OF clean.crm.account 'acme corp'
```

## Not supported

| Refused | Write instead |
|---|---|
| A record named without a key | `SHOW LINKS OF <Entity> '<key>'` |
| `LIMIT 0` | A sample of at least 1 |

```sql
-- Refused by the engine
SHOW LINKS OF Customer
```

```sql
-- Refused by the engine
SHOW LINKS OF Customer 'acme' LIMIT 0
```

## See also

[SHOW LINEAGE](../commands/show-lineage.md) · [SHOW RECORDS](../commands/show-records.md) · [SHOW MODEL](../commands/show-model.md) · [CREATE RELATION](../commands/create-relation.md) · [JOIN](../clauses/join.md)
