---
title: "REFRESH PEOPLE"
description: "Rebuild the people tables and resolve every source's people into unified people."
---

# REFRESH PEOPLE

[Commands › People](../commands.md#people) · Admins only, through `sercha_define` or a tenant file

Reads the people every connector and every [CREATE PEOPLE](../commands/create-people.md) declares, resolves them by their keys and rewrites the people tables.

## Syntax

```text
REFRESH PEOPLE
```

## Usage notes

- Rewrites `data.people_<source>` for each source and the shared tables `data.unified_people` (one row per person), `data.unified_people_accounts` (one row per source person, with its unified id), `data.unified_people_keys` (one row per key of a source person) and `data.unified_people_values` (one row per value of a column that names a person, which `VIA PERSON` joins through).
- Returns one row per source with its people count, then `(unified people)`, `(conflicts)` and a `(not read) ...` row for each table that could not be read.
- A refresh also runs in the background after a sync of a source that names people. Run this after a new or changed declaration.

## Examples

```sql
REFRESH PEOPLE
```

| source | people |
|---|---|
| github | 48 |
| staff | 61 |
| (unified people) | 74 |
| (conflicts) | 1 |

## See also

[CREATE PEOPLE](../commands/create-people.md) · [DROP PEOPLE](../commands/drop-people.md)
