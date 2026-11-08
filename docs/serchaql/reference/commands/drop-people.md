---
title: "DROP PEOPLE"
description: "Remove a people declaration made with CREATE PEOPLE."
---

# DROP PEOPLE

[Commands › People](../commands.md#people) · Admins only, through `sercha_define` or a tenant file

Removes a declaration made with [CREATE PEOPLE](../commands/create-people.md). The unified people are rebuilt without it on the next [REFRESH PEOPLE](../commands/refresh-people.md).

## Syntax

```text
DROP PEOPLE [ IF EXISTS ] <name>
```

## Parameters

| Parameter | Description |
|---|---|
| `IF EXISTS` | No error when there is no such declaration. |
| `<name>` | The declaration's name. |

## Usage notes

- A connector's people come with its pack and cannot be dropped.
- The people tables keep their rows until the next refresh.

## Examples

```sql
DROP PEOPLE IF EXISTS staff;
REFRESH PEOPLE;
```

| result |
|---|
| people staff dropped; REFRESH PEOPLE rebuilds the unified people without them |

## See also

[CREATE PEOPLE](../commands/create-people.md) · [REFRESH PEOPLE](../commands/refresh-people.md)
