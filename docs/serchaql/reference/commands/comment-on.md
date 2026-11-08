---
title: "COMMENT ON"
description: "Describe a view, a materialized view or one of its columns."
---

# COMMENT ON

[Commands › Views](../commands.md#views) · Admins only, through `sercha_define` or a tenant file

Records what a view is for, or what one of its columns means. `DESCRIBE` and `SHOW VIEWS` show it, and agents read it to choose the view and read its columns.

## Syntax

```text
COMMENT ON [ MATERIALIZED ] VIEW <name> IS '<text>'

COMMENT ON COLUMN <view>.<column> IS '<text>'
```

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | A view or materialized view. |
| `<view>.<column>` | A column of a view or materialized view. The column is matched ignoring case; a name the view does not have is refused with the list of its columns. |
| `'<text>'` | The description. Leading and trailing spaces are dropped. |

## Usage notes

- `COMMENT ON VIEW` also finds a materialized view of that name.
- Descriptions survive `CREATE OR REPLACE` of the view.
- A view a view preset keeps cannot be described by hand.

## Examples

```sql
COMMENT ON MATERIALIZED VIEW customer_totals IS 'Orders and spend per customer, all time.'
```

| result |
|---|
| materialized view "customer_totals" described |

```sql
COMMENT ON COLUMN customer_totals.spend IS 'Sum of order amounts, tax included.'
```

| result |
|---|
| column customer_totals.spend described |

## Not supported

| Refused | Write instead |
|---|---|
| `COMMENT ON COLUMN` without the view | `COMMENT ON COLUMN <view>.<column>` |
| `COMMENT ON TABLE` | Describe a view, or the table's entity with `DESCRIPTION` |

```sql
-- Refused by the engine
COMMENT ON COLUMN spend IS 'Sum of order amounts.'
```

```sql
-- Refused by the engine
COMMENT ON TABLE tables.crm.account IS 'Accounts.'
```

## See also

[CREATE VIEW](../commands/create-view.md) · [CREATE MATERIALIZED VIEW](../commands/create-materialized-view.md) · [DESCRIBE](../commands/describe.md) · [SHOW](../commands/show.md)
