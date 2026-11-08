---
title: "REFRESH RELATION"
description: "Judge an inferred relation's changed candidates again."
---

# REFRESH RELATION

[Commands › Relations](../commands.md#relations) · Admins only, through `sercha_define` or a tenant file

Starts judging an inferred relation's candidate pairs again, where they are new or their evidence changed. Only a relation made with `INFER FROM ... JUDGE` is judged; a relation made with `AS SELECT` is a query and always current.

## Syntax

```text
REFRESH RELATION <name>
```

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | An inferred relation. `SHOW MODEL` lists relations; an inferred one has `stored` of `inferred: <rule>`. |

## Usage notes

- The judging runs in the background. The statement returns at once.
- The relation's rows are the pairs the judge accepted, with `confidence` and `evidence` columns.
- `REFRESH RELATION` of a relation made with `AS SELECT` is refused with a message saying its rows are always current.

## Examples

```sql
REFRESH RELATION about
```

| result |
|---|
| relation about: judging what changed in the background |

## Not supported

| Refused | Write instead |
|---|---|
| A relation without its name | `REFRESH RELATION <name>` |

```sql
-- Refused by the engine
REFRESH RELATION
```

## See also

[CREATE RELATION](../commands/create-relation.md) · [DROP RELATION](../commands/drop-relation.md) · [SHOW MODEL](../commands/show-model.md)
