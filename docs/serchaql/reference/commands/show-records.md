---
title: "SHOW RECORDS"
description: "Find records of any model entity by their key or title."
---

# SHOW RECORDS

[Commands › Looking around](../commands.md#looking-around) · Any caller; rows they are not granted never appear

Finds records of every model entity whose key or title contains the text, ignoring case. Use it when you have a name or number but not the entity: a customer's name, an invoice number, a person.

## Syntax

```text
SHOW RECORDS LIKE '<text>' [ LIMIT <n> ]
```

## Parameters

| Parameter | Description |
|---|---|
| `'<text>'` | The text to find, quoted and not empty. It matches anywhere in the key or the title. |
| `LIMIT <n>` | Records per entity, at least 1. The default is 5 and the most is 50. |

## Usage notes

- One row per record found: `entity`, `key`, `title`.
- Every entity with records of its own is searched at once, each as a `SELECT` run as the caller. An entity the caller cannot read is left out.
- A key or title that is not text is compared as text, so a numbered key is found by its number.
- The MCP `query` tool does not run this statement; run it through SerchaQL directly. Over MCP, `catalogue` and a `SELECT ... WHERE lower(t.name) LIKE '%...%'` do the same job.

## Examples

```sql
SHOW RECORDS LIKE 'acme' LIMIT 3
```

| entity | key | title |
|---|---|---|
| Customer | acme | Acme Corp |
| Supplier | S-31 | Acme Packaging |
| Order | PO-1042 | Acme pallets, November |

## Not supported

| Refused | Write instead |
|---|---|
| Empty text | Some text to find |
| `LIMIT 0` | At least 1 |

```sql
-- Refused by the engine
SHOW RECORDS LIKE ''
```

```sql
-- Refused by the engine
SHOW RECORDS LIKE 'acme' LIMIT 0
```

## See also

[SHOW LINKS](../commands/show-links.md) · [SHOW MODEL](../commands/show-model.md) · [DESCRIBE](../commands/describe.md) · [LIKE](../clauses/like.md)
