---
sidebar_position: 4
title: "Removed and reserved"
description: "Forms older versions accepted that SerchaQL now refuses."
---

:::note
Every example on this page is parsed by the SerchaQL engine in a test, and every refused form is checked to still be refused. Agents get the same reference from `describe serchaql`.
:::

## Removed and reserved

These were in older documentation and are gone. Each is refused with a message.

- `SEARCH(...)` and `MATCHES`: Sercha has no search index. Filter with
  `WHERE` and `ILIKE`.
- `CREATE PIPELINE`, `DROP PIPELINE`, `SHOW PIPELINES`, `GRANT ... ON
  PIPELINE`: search pipelines were removed with the index.
- Reserved and refused: `EMBED`, `CREATE SNAPSHOT`, `RESOLVE SEMANTIC`,
  `ALTER CORPUS ... ORGANISE BY` (a corpus's organisation is fixed when it is
  created).

```sql
-- Refused by the engine
SELECT a.x FROM c.E a WHERE SEARCH(a.x, 'refund')
```

```sql
-- Refused by the engine
CREATE SNAPSHOT s
```
