---
title: "SHOW RAW"
description: "The source item a landed row came from, as it last landed."
---

# SHOW RAW

[Commands › Looking around](../commands.md#looking-around) · Any caller; rows they are not granted never appear

Returns the item a source sent, as it last landed: the payload the connector received, with the run it landed in. Every row of a connector table carries the `_source_key` of the item it was made from; pass that key.

## Syntax

```text
SHOW RAW '<connection>:<table>:<key>'
```

## Parameters

| Parameter | Description |
|---|---|
| `'<connection>:<table>:<key>'` | A row's `_source_key`, quoted. Select it with `SELECT t._source_key FROM ...`. |

## Usage notes

- The result is `property` and `value` rows: `source_key`, `landed_in` (the kind and id of the run), `landed_at`, `version`, `raw` (the payload) and, for a connector that keeps no payload of its own, a `note` saying `raw` holds the item's fields.
- The item is read as its table is: a caller who may not read the table gets the same refusal a `SELECT` would.
- An item that has not landed since landing began keeping items is reported as such; a resync lands it.
- The MCP `query` tool runs this statement.

## Examples

```sql
SHOW RAW 'crm:account:0017'
```

| property | value |
|---|---|
| source_key | crm:account:0017 |
| landed_in | sync 4f1c9e2a |
| landed_at | 2026-11-07T22:14:03Z |
| raw | \{"Id":"0017","Name":"Acme Corp","Industry":"Logistics"\} |

## Not supported

| Refused | Write instead |
|---|---|
| An unquoted key | Quote it: `SHOW RAW '<_source_key>'` |

```sql
-- Refused by the engine
SHOW RAW crm
```

## See also

[SHOW LINEAGE](../commands/show-lineage.md) · [SHOW LINKS](../commands/show-links.md) · [SELECT](../commands/select.md) · [SHOW](../commands/show.md)
