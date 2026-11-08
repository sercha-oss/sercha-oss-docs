---
title: "REVOKE"
description: "Remove a privilege a user or group was granted."
---

# REVOKE

[Commands › Access](../commands.md#access) · Admins only, through `sercha_define` or a tenant file

Removes the grants that match a privilege, an object and a subject.

## Syntax

```text
REVOKE <privilege> ON <object> FROM { USER | GROUP } <subject>

<object> ::= CORPUS <corpus>
           | CORPUS <corpus> PARTITION '<key>'
           | DATASET data.<table>
           | SOURCE <source>
           | CONTAINER <source> [ '<container>' ]
           | BINDING <name>
```

## Parameters

| Parameter | Description |
|---|---|
| `<privilege>` | The privilege the grant gave: `SELECT`, `WRITE`, `USE` and the others [GRANT](../commands/grant.md) accepts. |
| `<object>` | The object, written as in [GRANT](../commands/grant.md). |
| `USER <subject>`, `GROUP <subject>` | The subject, by email, name or id. |

## Usage notes

- The subject is resolved to its id, and grants stored under the literal text are matched too, so older grants stay removable.
- Every matching grant is removed; the result says how many.
- No matching grant is an error.
- A grant on a dataset table that no longer exists can still be revoked.

## Examples

```sql
REVOKE SELECT ON CORPUS books FROM GROUP finance
```

| result |
|---|
| revoked SELECT ON corpus books FROM group finance (1 grant(s)) |

```sql
REVOKE SELECT ON DATASET data.regions FROM USER analyst@example.com;
REVOKE WRITE ON SOURCE intake FROM USER intake-bot@example.com;
```

## Not supported

```sql
-- Refused by the engine
REVOKE SELECT ON CORPUS books TO GROUP finance
```

## See also

[GRANT](../commands/grant.md) · [SHOW](../commands/show.md)
