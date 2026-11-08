---
title: "GRANT"
description: "Give a user or group a privilege on a corpus, dataset, source, partition or container."
---

# GRANT

[Commands › Access](../commands.md#access) · Admins only, through `sercha_define` or a tenant file

Gives a user or a group a privilege on an object. Grants decide what a caller can read and push; rows the caller is not granted never appear in a query.

## Syntax

```text
GRANT <privilege> ON <object> TO { USER | GROUP } <subject>

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
| `<privilege>` | `SELECT` reads. `WRITE` pushes documents into a source. `USE` is accepted and stored. The engine also accepts `ANNOTATE` (write ledger records about a corpus, together with `SELECT`), `CURATE` (the structure review surface on a corpus, together with `SELECT`) and `ADMIN`. |
| `CORPUS <corpus>` | A whole corpus, by name. `SELECT` reads its extracted entities and every dataset table attached to it ([ALTER CORPUS ... ATTACH DATASET](../commands/alter-corpus.md)). |
| `CORPUS <corpus> PARTITION '<key>'` | One partition of a corpus: the rows of documents whose partition key is `<key>`. The key need not exist yet. |
| `DATASET data.<table>` | One dataset table. Only `SELECT` applies. The table must exist. |
| `SOURCE <source>` | One source, by name. `WRITE` lets the subject push documents into it without being an admin; it does not let them read anything. |
| `CONTAINER <source> [ '<container>' ]` | One container of a source (a repository, a team, a folder), by the connector's reference or its name; without it, the source's root. `SELECT` reads the rows of the source's tables in that container and every container under it. Only `SELECT` applies. |
| `BINDING <name>` | Accepted and stored; reserved, nothing checks it yet. |
| `USER <subject>` | A Sercha user by email or id. An email may be written bare (`analyst@example.com`) or quoted. |
| `GROUP <subject>` | A Sercha group by name or id. |

## Usage notes

- Names are resolved when the grant is made: a corpus or source name is stored as its id, and an email or group name as the subject's id. The result says which id it resolved to.
- Model entities and relations are read with the grants on the tables they are made from. Grants never name a person in the data, only Sercha users and groups.
- Admins read everything; grants are for everyone else.
- Dropping a corpus removes its grants and partition grants.

## Examples

```sql
GRANT SELECT ON CORPUS books TO GROUP finance
```

| result |
|---|
| grant created (id=7f3c...): SELECT ON CORPUS books TO GROUP finance (group 9a1e...) |

```sql
GRANT SELECT ON DATASET data.regions TO USER analyst@example.com;
GRANT SELECT ON CORPUS books PARTITION 'Clients/Acme' TO USER 'reviewer@example.com';
GRANT SELECT ON CONTAINER code 'acme/web' TO GROUP engineering;
GRANT WRITE ON SOURCE intake TO USER intake-bot@example.com;
```

## Not supported

| Refused | Write instead |
|---|---|
| `GRANT ... ON PIPELINE` | Search pipelines were removed. Grant on the corpus or dataset. |
| `GRANT ... ON LEDGER` | `GRANT ANNOTATE ON CORPUS <corpus>` with `SELECT` |
| `GRANT INSERT`, `UPDATE` and other privileges | `SELECT`, `WRITE`, `USE` (refused when the statement runs) |
| A privilege other than `SELECT` on a dataset or container | `SELECT` (refused when the statement runs) |
| `TO ROLE ...` | `TO USER` or `TO GROUP` |

```sql
-- Refused by the engine
GRANT SELECT ON PIPELINE support TO GROUP finance
```

```sql
-- Refused by the engine
GRANT SELECT ON CORPUS books TO ROLE analyst
```

## See also

[REVOKE](../commands/revoke.md) · [CREATE CORPUS](../commands/create-corpus.md) · [ALTER CORPUS](../commands/alter-corpus.md) · [SHOW](../commands/show.md)
