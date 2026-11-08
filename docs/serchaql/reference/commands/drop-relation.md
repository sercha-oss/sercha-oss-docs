---
title: "DROP RELATION"
description: "Remove a relation from the model."
---

# DROP RELATION

[Commands › Relations](../commands.md#relations) · Admins only, through `sercha_define` or a tenant file

Removes a relation of the model and the view that holds its rows. For an inferred relation, the judge's verdicts go too.

## Syntax

```text
DROP RELATION [ IF EXISTS ] <name>
```

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | The relation, as `SHOW MODEL` lists it. |
| `IF EXISTS` | Succeed with a message when there is no such relation. |

## Usage notes

- Drop a relation before either entity it relates: `DROP ENTITY` is refused while a relation names the entity.

## Examples

```sql
DROP RELATION IF EXISTS placed
```

| result |
|---|
| relation placed dropped |

## Not supported

| Refused | Write instead |
|---|---|
| A relation named with its ends | The relation's name alone |

```sql
-- Refused by the engine
DROP RELATION placed (Customer places Order)
```

## See also

[CREATE RELATION](../commands/create-relation.md) · [REFRESH RELATION](../commands/refresh-relation.md) · [DROP ENTITY](../commands/drop-entity.md) · [SHOW MODEL](../commands/show-model.md)
