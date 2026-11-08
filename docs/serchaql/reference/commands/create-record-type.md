---
title: "CREATE RECORD TYPE"
description: "Declare a kind of ledger record that people or agents write about extracted instances."
---

# CREATE RECORD TYPE

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Declares a record type in an ontology. Records are written by people and agents, not by extraction: a claim or a problem about an extracted instance, kept in an append-only ledger. A record type declares its columns in the same grammar as an entity.

## Syntax

```text
CREATE RECORD TYPE <ontology>.<Name> (
    <column> <type> [ <column option> ... ] [, ...]
    [, KEY ( <column> [, ...] ) ]
  )
  [ KIND { assertion | exception } ]
  [ ON ENTITY <Entity> ]
```

## Parameters

| Parameter | Description |
|---|---|
| `<ontology>.<Name>` | The ontology and the record type's name. Must be qualified. |
| `<column>`, `<type>`, `<column option>` | As in [CREATE ENTITY (extraction)](../commands/create-extracted-entity.md): `KEY`, `NOT NULL`, `CHECK ( col IN (...) )` and `EXTRACT '<description>'` mean the same. `SENSITIVE` is refused. |
| `KIND assertion` | The default. A positive claim about an instance: a value, a classification, a judgement. Its columns carry the claim. |
| `KIND exception` | Something is wrong or cannot be resolved about an instance. The record's existence is the fact; its columns describe it. |
| `ON ENTITY <Entity>` | The entity, in the same ontology, the records attach to. Unqualified. Without it, records may attach to any instance. |

## Usage notes

- `KIND` and `ON ENTITY` may come in either order.
- A record attaches to an instance by the entity's natural key; declare one first with [ALTER ENTITY ... SET NATURAL KEY](../commands/alter-entity.md).
- Writing a record about a corpus needs both `SELECT` and `ANNOTATE` on it. See [GRANT](../commands/grant.md).

## Examples

```sql
CREATE RECORD TYPE finance.PaymentCheck (
  checked_on DATE NOT NULL EXTRACT 'The date the payment was checked against the bank statement',
  outcome TEXT CHECK (outcome IN ('matched', 'short', 'missing')) EXTRACT 'What the check found'
) KIND assertion ON ENTITY Invoice;
```

| result |
|---|
| record type "finance.PaymentCheck" created (kind=assertion, ontology=finance) |

```sql
CREATE RECORD TYPE finance.DuplicateInvoice (
  other_invoice_no TEXT NOT NULL EXTRACT 'The invoice number this one duplicates'
) ON ENTITY Invoice KIND exception;
```

## Not supported

```sql
-- Refused by the engine
CREATE RECORD TYPE PaymentCheck (outcome TEXT)
```

```sql
-- Refused by the engine
CREATE RECORD TYPE finance.PaymentCheck (outcome TEXT) KIND warning
```

## See also

[CREATE ONTOLOGY](../commands/create-ontology.md) · [ALTER ENTITY](../commands/alter-entity.md) · [GRANT](../commands/grant.md) · [SHOW RECORDS](../commands/show-records.md)
