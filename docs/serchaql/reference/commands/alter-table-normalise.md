---
title: "ALTER TABLE ... NORMALISE"
description: "Group a landed table's rows whose names differ only in case, punctuation or plurals into clean.<source>.<table>."
---

# ALTER TABLE ... NORMALISE

[Commands › Tables](../commands.md#tables) · Admins only, through `sercha_define` or a tenant file

Compresses a landed table within one source: rows whose value of one column names the same thing, once normalised, become one row of `clean.<source>.<table>`, and every source row keeps a pointer to its group in `clean.<source>.<table>_map`. It is deterministic: no model and no judge, and the same rows always give the same groups and ids.

## Syntax

```text
ALTER TABLE tables.<source>.<table>
  NORMALISE <column> BY <step> [, ...]
  [ KEEP <column> [, ...] ]

ALTER TABLE tables.<source>.<table> DROP NORMALISE

<step> ::= CASE | PUNCTUATION | PLURAL | ALSO <column>
```

## Parameters

| Parameter | Description |
|---|---|
| `<column>` | The column whose value names the thing: a name, a title. |
| `CASE` | Fold case. |
| `PUNCTUATION` | Turn every run of characters that are not letters or digits into one space. |
| `PLURAL` | Drop a trailing `s` from each word of four or more letters, unless the word ends in `ss`. |
| `ALSO <column>` | A column of other names for the same row: a JSON array, or values separated by `,`, `;` or `|`. Two groups join through an other name when some row has that name as its own value and at least two rows give it, so one loose alias cannot chain unrelated groups. |
| `KEEP <column>, ...` | Columns carried onto the group row from its representative row: the first row, by id, spelled as the group's name. The normalised column itself cannot be kept; the group already has it as `name`. |
| `DROP NORMALISE` | Remove the rule and both clean tables. |

## Usage notes

- At least one step is required. Leading, trailing and repeated spaces are always removed.
- The table must have a `tables.` layer name; give it one with [ALTER TABLE ... RENAME TO](../commands/alter-table-rename.md).
- `clean.<source>.<table>` has one row per group: `_id` (its smallest normalised key, stable while that key is), `key` (the normalised value), `name` (the spelling most of its rows use), `names` (every spelling, separated by ` | `), `members` (how many source rows), and the `KEEP` columns.
- `clean.<source>.<table>_map` has one row per source row: `member_id`, `clean_id` (the group's `_id`) and `value` (the column as the row writes it).
- Rows whose normalised value is empty are left out.
- Running the statement again replaces the rule and rebuilds. After new rows land, [REFRESH TABLE](../commands/refresh-table.md) rebuilds with the same rule.
- The result is `property` and `value` rows: `table`, `map`, `rows_read`, `groups`, `rows_written`, `rows_removed`.

## Examples

```sql
ALTER TABLE tables.crm.account
  NORMALISE name BY CASE, PUNCTUATION, PLURAL, ALSO other_names
  KEEP account_no, region
```

| property | value |
|---|---|
| table | clean.crm.account |
| map | clean.crm.account_map |
| rows_read | 1240 |
| groups | 1012 |
| rows_written | 2252 |
| rows_removed | 0 |

With `CASE, PUNCTUATION, PLURAL`, `Acme Corp.`, `ACME corp` and `acme-corps` all have the key `acme corp` and are one group.

Read the groups, and the rows behind one:

```sql
SELECT g._id, g.name, g.names, g.members
FROM clean.crm.account g
WHERE g.members > 1
ORDER BY g.members DESC
LIMIT 10
```

```sql
SELECT m.member_id, m.value
FROM clean.crm.account_map m
WHERE m.clean_id = 'acme corp'
```

```sql
ALTER TABLE tables.crm.account DROP NORMALISE
```

## Not supported

| Refused | Write instead |
|---|---|
| `NORMALISE <column>` with no `BY` steps | At least one of `CASE`, `PUNCTUATION`, `PLURAL`, `ALSO <column>` |
| `KEEP` of the normalised column | It is already the group's `name` |
| Any other step | `CASE`, `PUNCTUATION`, `PLURAL` or `ALSO <column>` |

```sql
-- Refused by the engine
ALTER TABLE tables.crm.account NORMALISE name
```

```sql
-- Refused by the engine
ALTER TABLE tables.crm.account NORMALISE name BY CASE KEEP name
```

```sql
-- Refused by the engine
ALTER TABLE tables.crm.account NORMALISE name BY STEM
```

## See also

[REFRESH TABLE](../commands/refresh-table.md) · [ALTER TABLE ... RENAME TO](../commands/alter-table-rename.md) · [SHOW LINEAGE](../commands/show-lineage.md) · [SHOW LINKS](../commands/show-links.md) · [CREATE ENTITY](../commands/create-entity.md)
