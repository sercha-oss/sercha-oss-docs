---
title: "DROP ENTITY"
description: "Remove a model entity, or an extracted entity from an ontology."
---

# DROP ENTITY

[Commands › Model entities](../commands.md#model-entities) · Admins only, through `sercha_define` or a tenant file

Removes an entity. A bare name is a model entity; a name of two parts, `<ontology>.<Name>`, is an extracted entity of an ontology. The two are handled differently.

## Syntax

```text
DROP ENTITY [ IF EXISTS ] <Name>

DROP ENTITY [ IF EXISTS ] <ontology>.<Name> [ CASCADE | RESTRICT ]
DROP TABLE  [ IF EXISTS ] <ontology>.<Name> [ CASCADE | RESTRICT ]
```

## Parameters

| Parameter | Description |
|---|---|
| `<Name>` | A model entity, made with [CREATE ENTITY](../commands/create-entity.md). |
| `<ontology>.<Name>` | An extracted entity, made with [CREATE ENTITY (extracted)](../commands/create-extracted-entity.md). `DROP TABLE` is the same statement. |
| `IF EXISTS` | Succeed with a message when there is no such entity. |
| `RESTRICT` | The default for an extracted entity: refuse while an edge touches it, naming the children `CASCADE` would also remove. |
| `CASCADE` | Drop an extracted entity and every entity `UNDER` it, in one statement. A child that also sits under a parent outside the dropped set survives. |

## Usage notes

A model entity:

- Is refused while another entity is `OF` it, or a relation has it at either end. Drop those first: the model never names a missing entity.
- Takes its records with it: the view or materialized view under its name, and for an `IDENTITY BY` entity also `<name>_members` and the identity tables.
- Takes no `CASCADE` or `RESTRICT`.

An extracted entity:

- Is refused while it is the pack entity of a structure that still exists; `DROP STRUCTURE` removes it.
- Without `CASCADE`, is refused while any edge touches it.

## Examples

A model entity, after the relations that use it:

```sql
DROP RELATION IF EXISTS placed;
DROP ENTITY IF EXISTS Order;
```

| result |
|---|
| relation placed dropped |
| entity Order dropped |

An extracted entity and the entities under it:

```sql
DROP ENTITY finance.Invoice CASCADE
```

## Not supported

| Refused | Write instead |
|---|---|
| `CASCADE` on a model entity | Drop what is `OF` it and the relations that use it first |
| `DROP TABLE` with a bare name | `DROP ENTITY <Name>` |

```sql
-- Refused by the engine
DROP ENTITY Order CASCADE
```

```sql
-- Refused by the engine
DROP TABLE Order
```

## See also

[CREATE ENTITY](../commands/create-entity.md) · [CREATE ENTITY (extraction)](../commands/create-extracted-entity.md) · [DROP RELATION](../commands/drop-relation.md) · [DROP STRUCTURE](../commands/drop-structure.md) · [SHOW MODEL](../commands/show-model.md)
