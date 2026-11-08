---
title: "CREATE PEOPLE"
description: "Declare which dataset columns identify people, so each person's identities resolve into one person."
---

# CREATE PEOPLE

[Commands › People](../commands.md#people) · Admins only, through `sercha_define` or a tenant file

Declares a source of people: one or more dataset tables and the columns a person is known by in them. [REFRESH PEOPLE](../commands/refresh-people.md) then resolves every source's people into unified people, which `JOIN ... VIA PERSON` matches through.

## Syntax

```text
CREATE [ OR REPLACE ] PEOPLE <name>
  FROM data.<table> [, data.<table> ...]
  KEY ( <column> KIND <kind> [, ...] )
  [ REF <column> ]
  [ NAME <column> ]
  TAG { internal | external }
```

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | The source name. Its people land in `data.people_<name>`. A name a connector already uses for its people is refused. |
| `OR REPLACE` | Replaces your own declaration of the same name. Without it, an existing name is an error. |
| `FROM data.<table>` | The dataset tables the people are read from. Every table must have every column the statement names. |
| `KEY ( <column> KIND <kind> )` | The columns that identify a person, and what each holds. `SHOW KINDS` lists the kinds: `email`, `email_domain`, `github_login`, `github_account_id`, `microsoft_user_id`, `abn`. Required unless `REF` is given. |
| `REF <column>` | The source's own id for the person. It becomes a key of the form `<table>:<id>` that never matches another source. |
| `NAME <column>` | The column holding the person's display name. |
| `TAG internal` | People who act in the tool: authors, assignees, record owners. |
| `TAG external` | People the data is about: contacts, customers, signatories. |

## Usage notes

- The clauses after `FROM` may come in any order. `KEY` (or `REF`) and `TAG` are required.
- Two people from different sources become one unified person when they share a key, except `email_domain`, which is recorded but never links people.
- Kinds that one person holds at most once (`github_login`, `github_account_id`, `microsoft_user_id`, `abn`) are checked: two values of one in a group are reported as a conflict.
- The declaration takes effect on the next [REFRESH PEOPLE](../commands/refresh-people.md), which also runs in the background after syncs.
- People in the data are never Sercha users and never permission subjects. Nothing here grants access.
- `SHOW PEOPLE` lists every declaration, a connector's and your own.

## Examples

```sql
CREATE PEOPLE staff
  FROM data.directory
  KEY (email KIND email, gh_login KIND github_login)
  NAME full_name
  TAG internal;
```

| result |
|---|
| people staff created over directory; REFRESH PEOPLE resolves them |

Customers' contacts from two tables:

```sql
CREATE OR REPLACE PEOPLE customer_contacts
  FROM data.customers, data.contacts
  KEY (contact_email KIND email)
  REF contact_id
  TAG external;
```

After [REFRESH PEOPLE](../commands/refresh-people.md), match rows of two tables that name the same person. Both columns must be ones a people declaration names:

```text
SELECT t.ticket_no, o.order_no
FROM data.tickets t
JOIN data.orders o VIA PERSON (t.reporter_email = o.buyer_email)
```

Read the unified people directly:

```sql
SELECT p.unified_id, p.name
FROM data.unified_people p
LIMIT 20
```

## Not supported

| Refused | Write instead |
|---|---|
| No `KEY` and no `REF` | Name at least one key column |
| No `TAG` | `TAG internal` or `TAG external` |
| A table not in `data.` | Land it as a dataset table first |

```sql
-- Refused by the engine
CREATE PEOPLE staff FROM data.directory KEY (email KIND email)
```

```sql
-- Refused by the engine
CREATE PEOPLE staff FROM tables.crm.account KEY (email KIND email) TAG external
```

## See also

[REFRESH PEOPLE](../commands/refresh-people.md) · [DROP PEOPLE](../commands/drop-people.md) · [JOIN](../clauses/join.md) · [SHOW](../commands/show.md)
