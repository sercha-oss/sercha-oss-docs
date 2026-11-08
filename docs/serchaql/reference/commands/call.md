---
title: "CALL"
description: "Run a saved tool with arguments."
---

# CALL

[Commands › Tools](../commands.md#tools) · Any caller; rows they are not granted never appear

Runs a saved tool: the tool's stored `SELECT` with each `:name` placeholder bound to the value passed. The call runs as the caller, so it returns only the rows the caller may read.

## Syntax

```text
CALL <tool> ( [ <value> [, ...] ] )

CALL <tool> ( [ <value> [, ...] , ] <parameter> => <value> [, ...] )
```

## Parameters

| Parameter | Description |
|---|---|
| `<tool>` | A tool made with [CREATE TOOL](../commands/create-tool.md). `SHOW TOOLS` lists them. |
| `<value>` | A literal: `'text'`, a number (`5`, `-2.5`), `TRUE`, `FALSE`, `NULL`, `DATE '2026-01-31'`, `TIMESTAMP '2026-01-31 09:00:00'`, or a list for a `TEXT[]` parameter as `ARRAY['a', 'b']` or `('a', 'b')`. |
| `<parameter> => <value>` | A named argument. Positional arguments bind in the tool's parameter order and must all come before any named one. |

## Usage notes

- A parameter left out takes its `DEFAULT`. A required parameter left out is an error, as is an argument passed twice or more positional arguments than the tool has parameters.
- Each value is checked against the parameter's type before anything runs. A text value is at most 8 KiB; a list holds at most 1000 items.
- A parameter declared with `FORM code_name` rewrites its text before it binds (see [CREATE TOOL](../commands/create-tool.md)).
- Grants, column policies and row caps apply as for any `SELECT` the caller writes. A caller who cannot read a table the body reads gets the same error that `SELECT` would give.
- Over MCP, every saved tool is also a tool of its own name, called with a JSON object of its arguments. `CALL` is the SerchaQL form of the same call.
- Arguments are literals only. Write expressions inside the tool's body.

## Examples

A tool with one required and two optional parameters, called by name:

```sql
CALL customer_orders(customer => 'acme', top => 5)
```

| key | amount | status |
|---|---|---|
| PO-1042 | 18200.00 | open |
| PO-1017 | 9450.00 | open |

The same call with positional arguments, in the tool's parameter order:

```sql
CALL customer_orders('acme', 'open', 5)
```

A list argument for a `TEXT[]` parameter:

```sql
CALL orders_in_regions(regions => ARRAY['north', 'west'])
```

## Not supported

| Refused | Write instead |
|---|---|
| A positional argument after a named one | Name every argument after the first named one |
| An expression as an argument | A literal; compute in the tool's body |

```sql
-- Refused by the engine
CALL customer_orders(customer => 'acme', 5)
```

```sql
-- Refused by the engine
CALL customer_orders(top => 2 + 3)
```

## See also

[CREATE TOOL](../commands/create-tool.md) · [DROP TOOL](../commands/drop-tool.md) · [SHOW](../commands/show.md) · [DESCRIBE](../commands/describe.md) · [SELECT](../commands/select.md)
