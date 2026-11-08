---
title: "PREVIEW EDGE"
description: "Resolve an edge and report what it would hold, without storing anything."
---

# PREVIEW EDGE

[Commands › Edges](../commands.md#edges) · Admins only, through `sercha_define` or a tenant file

Resolves an edge's rule over both sides and reports the pair count, how many rows on each side link, the count per rule and up to ten sample pairs. Nothing is written.

## Syntax

```text
PREVIEW EDGE <name>
PREVIEW EDGE <name> ON <relation> [ WHERE ... ] <VERB> <relation> [ WHERE ... ]
  LINK BY <rule> [, ...] [ RESOLVE { EXACT | FUZZY } ]
```

## Parameters

| Parameter | Description |
|---|---|
| `<name>` | With no body, the stored edge of that name is previewed. With a body, the name only labels the result. |
| `ON ... LINK BY ...` | An edge body, written exactly as in [CREATE EDGE](../commands/create-edge.md). |

## Usage notes

- The result has three columns, `what`, `count` and `detail`. Its rows are `pairs`, one row per side (`<relation> rows`, with linked and unmatched counts), one `rule: ...` row per rule, and `sample` rows showing `left_key -> right_key (rule): evidence`.
- An edge written out in the statement reads entity and view sides as you, as it would once you declare it.
- Without a body, a name with no stored edge is an error that asks for the body.

## Examples

```sql
PREVIEW EDGE order_customer
  ON data.orders PLACED_BY data.customers
  LINK BY customer_no = account_no;
```

| what | count | detail |
|---|---|---|
| pairs | 1482 | |
| data.orders rows | 1530 | 1482 linked, 48 unmatched |
| data.customers rows | 312 | 297 linked, 15 unmatched |
| rule: customer_no = account_no | 1482 | |
| sample | 1 | o-10021 -> c-0042 (customer_no = account_no): customer_no = c-0042 |

Preview a stored edge:

```sql
PREVIEW EDGE order_customer
```

## See also

[CREATE EDGE](../commands/create-edge.md) · [REFRESH EDGES](../commands/refresh-edges.md) · [DROP EDGE](../commands/drop-edge.md)
