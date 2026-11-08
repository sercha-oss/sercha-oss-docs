---
title: "CREATE TOOL"
description: "Save a parameterised SELECT as a named tool that agents call with typed arguments."
---

# CREATE TOOL

[Commands › Tools](../commands.md#tools) · Admins only, through `sercha_define` or a tenant file

Saves a `SELECT` with `:name` placeholders as a tool. Each parameter has a type, an optional default and a description. Agents call the tool with arguments instead of writing the SQL: over MCP each saved tool is a tool of its own name, and in SerchaQL it is run with [CALL](../commands/call.md).

## Syntax

```text
CREATE [ OR REPLACE ] TOOL <name> (
  [ <parameter> <type> [ FORM code_name ] [ DEFAULT <literal> ] [ COMMENT '<text>' ] [, ...] ]
)
COMMENT '<text>'
AS <select>
```

`FORM`, `DEFAULT` and `COMMENT` follow the type in any order.

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | A lowercase identifier of at most 64 characters: letters, digits and `_`, starting with a letter. It may not be a built-in tool's name (`query`, `describe`, `catalogue`, `export` and the others). |
| `<parameter>` | A lowercase identifier, used in the body as `:<parameter>`. At most 32 parameters. Write `()` for a tool without parameters. |
| `<type>` | `TEXT` (also `VARCHAR`, `STRING`), `INTEGER` (`INT`, `BIGINT`), `NUMBER` (`NUMERIC`, `DECIMAL`, `FLOAT`, `DOUBLE`), `BOOLEAN` (`BOOL`), `DATE`, `TIMESTAMP` (`TIMESTAMPTZ`), or `TEXT[]`, a list of text. |
| `FORM code_name` | For a `TEXT` parameter: rewrite a code name to the dotted form before it binds. `Billing::Invoice` becomes `Billing.Invoice` and `Invoice#total` becomes `Invoice.total`; a link to a GitHub pull request, issue or file, or a Linear issue, becomes the number, key or path it names; a path is left as it is. A comma separated value is rewritten item by item. |
| `DEFAULT <literal>` | The value used when a call leaves the parameter out: `'text'`, a number, `TRUE`, `FALSE`, `NULL`, `DATE '...'`, `TIMESTAMP '...'`, or `ARRAY['a', 'b']`. A parameter without a default is required. |
| `COMMENT '<text>'` after a parameter | What to pass. Required. |
| `COMMENT '<text>'` after the list | What the tool answers and when to call it. Required; at most 4000 characters. |
| `AS <select>` | One `SELECT` or `WITH ... SELECT`, at most 128 KiB. |

## Usage notes

- Placeholders stand where a literal would: `WHERE o.customer = :customer`. A `TEXT[]` parameter stands only after `IN`, as `o.region IN :regions`; `IN (:region)` takes a single value. `LIMIT :n` and `OFFSET :n` take an `INTEGER`.
- Every placeholder must be a declared parameter, and every declared parameter must be used in the body.
- When the statement runs, the body is bound with a sample value for each parameter and planned as the creating admin, so a body that does not plan is refused at once.
- A call runs as the caller (invoker rights): grants, column policies and row caps apply as for any `SELECT` they write.
- `CREATE TOOL` of a name that exists is refused. `CREATE OR REPLACE TOOL` replaces it and bumps its version. Replacing a tool a view preset keeps makes an override, kept until a release changes the preset's tool.
- `SHOW TOOLS` lists tools; `DESCRIBE TOOL <name>` gives the parameters, body and an example call.
- A placeholder is valid only in a tool's body.

## Examples

```sql
CREATE OR REPLACE TOOL customer_orders (
  customer TEXT COMMENT 'The customer key, as in acme.',
  status   TEXT DEFAULT 'open' COMMENT 'Order status: open or closed.',
  top      INTEGER DEFAULT 10 COMMENT 'How many orders to return.'
)
COMMENT 'The largest orders of one customer, by status. Call it to see what a customer has on order.'
AS
SELECT o.key, o.amount, o.status
FROM Order o
WHERE o.customer = :customer AND o.status = :status
ORDER BY o.amount DESC
LIMIT :top;
```

| result |
|---|
| tool "customer_orders" created (id=91b2...) |

A list parameter:

```sql
CREATE OR REPLACE TOOL orders_in_regions (
  regions TEXT[] COMMENT 'Regions to include, as north or west.',
  since   DATE DEFAULT DATE '2026-01-01' COMMENT 'Orders placed on or after this day.'
)
COMMENT 'Order count and spend per region since a day.'
AS
SELECT c.region, COUNT(*) AS orders, SUM(o.amount) AS spend
FROM Order o
JOIN Customer c ON c.key = o.customer
WHERE c.region IN :regions AND o.placed_at >= :since
GROUP BY c.region;
```

## Not supported

| Refused | Write instead |
|---|---|
| A placeholder outside a tool's body | A literal, or a tool |
| A tool without a parameter list | `()` for no parameters |

```sql
-- Refused by the engine
SELECT o.key FROM Order o WHERE o.customer = :customer
```

```sql
-- Refused by the engine
CREATE TOOL all_orders COMMENT 'Every order.' AS SELECT o.key FROM Order o
```

## See also

[CALL](../commands/call.md) · [DROP TOOL](../commands/drop-tool.md) · [DESCRIBE](../commands/describe.md) · [SHOW](../commands/show.md) · [CREATE VIEW](../commands/create-view.md) · [IN](../clauses/in.md)
