---
sidebar_position: 2
title: "Querying"
description: "Every query clause and function SerchaQL accepts, the forms it refuses with what to write instead, and the read-only SHOW forms."
---

:::note
Every example on this page is parsed by the SerchaQL engine in a test, and every refused form is checked to still be refused. Agents get the same reference from `describe serchaql`.
:::

## Query clauses

Everything below works. Where a form has a limit, the limit is stated.

**Filtering and shaping**: `WHERE` with `AND`, `OR`, `NOT`, `IN (list)`,
`IN (subquery)`, `NOT IN`, `EXISTS`, `BETWEEN`, `IS [NOT] NULL`, `LIKE`,
`NOT LIKE`, `ILIKE` (backslash is the escape character); `CASE WHEN`;
`CAST(x AS type)` and `x::type`; `||` concatenation; arithmetic anywhere,
including dividing one aggregate by another.

```sql
SELECT o.key, o.amount * 1.1 AS with_tax
FROM Order o
WHERE o.status IN ('open', 'held') AND o.title ILIKE '%refund%' AND o.closed_at IS NULL
```

**Grouping**: `GROUP BY` (columns, expressions or positions), `HAVING` on an
aggregate or its alias, `DISTINCT`, `COUNT(DISTINCT x)`.

```sql
SELECT o.status, COUNT(*) AS n, COUNT(DISTINCT o.customer) AS customers, SUM(o.amount) / COUNT(*) AS average
FROM Order o
GROUP BY o.status
HAVING COUNT(*) > 5
ORDER BY n DESC NULLS LAST
LIMIT 10 OFFSET 0
```

**Ordering and paging**: `ORDER BY` a column, an alias, a position or a
column not selected, `ASC`/`DESC`, `NULLS FIRST`/`NULLS LAST`; `LIMIT`,
`OFFSET`, `FETCH FIRST n ROWS ONLY`.

**Joins**: `JOIN` and `LEFT JOIN`. `ON` takes column equalities only
(`a.x = b.y`, joined by `AND`); compute anything else in a subquery first and
join on its output column. `USING (col)` also works. A join of a CTE, a
subquery or a view works the same way.

```sql
SELECT o.key, n.norm_name
FROM Order o
JOIN (SELECT c.key AS key, LOWER(TRIM(c.name)) AS norm_name FROM Customer c) n ON n.key = o.customer
```

**Subqueries and derived tables**: anywhere a table goes, and in `IN (...)`
and `EXISTS (...)`.

**Set operations**: `UNION`, `UNION ALL`, `INTERSECT`, `EXCEPT`. Output
column names come from the first branch.

**Common table expressions**: `WITH name AS (SELECT ...)`. Each CTE is
computed once per statement and a CTE nothing reads is skipped, so naming a
shared step is free. A CTE whose body is itself a `UNION` must wrap the union
in a derived table:

```sql
WITH everyone AS (
  SELECT u.k FROM (
    SELECT c.key AS k FROM Customer c
    UNION ALL
    SELECT s.key AS k FROM Supplier s
  ) u
)
SELECT e.k FROM everyone e
```

`WITH RECURSIVE` is for real recursion only (walking a parent chain):

```sql
WITH RECURSIVE chain AS (
  SELECT t.key AS key, t.parent AS parent, 1 AS depth FROM Team t WHERE t.key = 'platform'
  UNION ALL
  SELECT p.key, p.parent, c.depth + 1 FROM Team p JOIN chain c ON p.key = c.parent
)
SELECT chain.key, chain.depth FROM chain
```

**Window functions**: `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `NTILE`,
`PERCENT_RANK`, `CUME_DIST`, `LAG`, `LEAD` (with offset and default),
`FIRST_VALUE`, `LAST_VALUE`, `NTH_VALUE`, and `SUM`/`AVG`/`COUNT`/`MIN`/`MAX`
over a window. `PARTITION BY`, `ORDER BY`, `ROWS BETWEEN ... AND ...` and
`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. Window functions work
inside expressions. To filter on one, compute it in a derived table and
filter outside:

```sql
SELECT r.customer, r.key, r.amount
FROM (
  SELECT o.customer AS customer, o.key AS key, o.amount AS amount,
         ROW_NUMBER() OVER (PARTITION BY o.customer ORDER BY o.amount DESC) AS rn
  FROM Order o
) r
WHERE r.rn = 1
```

```sql
SELECT o.key, o.amount - LAG(o.amount) OVER (ORDER BY o.placed_at) AS change,
       SUM(o.amount) OVER (ORDER BY o.placed_at ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS last_seven
FROM Order o
```

**Comments**: `-- line` and `/* block */`.

## Functions

**Text**: `lower`, `upper`, `initcap`, `trim`, `btrim`, `ltrim`, `rtrim`,
`length`, `char_length`, `substring`, `substr`, `left`, `right`, `replace`,
`reverse`, `lpad`, `rpad`, `concat`, `concat_ws`, `strpos`, `position`,
`starts_with`, `split_part`, `regexp_replace`, `regexp_like`,
`regexp_split_to_table`, `string_to_table`.

**Numbers**: `abs`, `round`, `ceil`, `ceiling`, `floor`, `trunc`, `sign`,
`mod`, `power`, `pow`, `sqrt`, `greatest`, `least`.

**Nulls**: `coalesce`, `nullif`.

**Dates**: `current_date`, `date_trunc`, `date_part`,
`extract(field FROM x)` (including `extract(epoch FROM x)` for seconds, which
is how you do date arithmetic).

**Types for CAST**: `integer`, `bigint`, `numeric`, `float`, `double`,
`text`, `varchar`, `boolean`, `date`, `timestamp`.

**Aggregates**: `count`, `sum`, `avg`, `min`, `max`, `string_agg`,
`array_agg`. `DISTINCT` inside an aggregate works for `count`.

```sql
SELECT split_part(t.path, '/', 1) AS top_folder,
       COUNT(*) AS files,
       string_agg(t.owner, ', ') AS owners,
       MAX(extract(epoch FROM t.updated_at)) - MIN(extract(epoch FROM t.updated_at)) AS span_seconds
FROM tables.drive.file t
WHERE regexp_like(t.path, '^finance/') AND strpos(t.name, '.xlsx') > 0
GROUP BY split_part(t.path, '/', 1)
```

Spellings from other dialects are refused with the spelling to use instead:
`now()` (use `current_date`), `to_char`, `to_date`, `to_timestamp`,
`to_number` (use `CAST`), `ifnull`, `nvl`, `isnull` (use `coalesce`), `iif`,
`if` (use `CASE WHEN`), `len` (use `length`), `datediff`, `date_diff`, `age`
(subtract `extract(epoch ...)` values), `regexp_matches` (use `regexp_like`),
`array_length`, `unnest`.

## Refused forms and what to write instead

The engine refuses each of these with a message that names the rewrite.

| Refused | Write instead |
|---|---|
| `RIGHT JOIN`, `FULL JOIN`, `CROSS JOIN`, `NATURAL JOIN` | Swap the sides of a `LEFT JOIN`; for a cross join, join two derived tables on a constant column |
| An expression in `ON` | Compute it in a subquery and join on the result column |
| `DISTINCT ON (...)` | `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` in a derived table, keep `rn = 1` |
| `INTERVAL '1 day'` | Compare dates directly, or subtract `extract(epoch FROM ...)` values |
| `SELECT` without `FROM` | Select from a table |
| `regexp_extract`, `regexp_matches` | `split_part`, `regexp_replace`, `regexp_like` |
| `IS DISTINCT FROM` | `coalesce` both sides and compare |
| `SIMILAR TO`, `LIKE ... ESCAPE` | `LIKE`/`ILIKE` (backslash already escapes) or `regexp_like` |
| `t.*` | Name the columns (`SELECT *` from one table works) |
| `ORDER BY` or `FILTER` inside an aggregate, `WITHIN GROUP` | A derived table that orders or filters first |
| A named `WINDOW`, `IGNORE NULLS`, `GROUPS` frames, `RANGE` with a numeric offset | Repeat the `OVER (...)`; filter nulls in a derived table; use `ROWS` |
| A window function in `WHERE`, or an aggregate in a window's `ORDER BY` | Compute it in a derived table, filter or order outside |
| A `UNION` directly as a CTE body | Wrap it: `WITH x AS (SELECT u.a FROM (... UNION ALL ...) u)` |
| `stddev`, `variance`, `median`, `percentile_cont`, `mode`, `bool_and`, `json_agg` | `stddev` from `SUM(x)`, `SUM(x * x)` and `COUNT(x)`; the others are not available |

```sql
-- Refused by the engine
SELECT a.x FROM c.E a RIGHT JOIN c.F b ON a.x = b.x
```

```sql
-- Refused by the engine
SELECT a.x FROM c.E a JOIN c.F b ON a.x = lower(b.x)
```

```sql
-- Refused by the engine
SELECT DISTINCT ON (a.x) a.x FROM c.E a
```

```sql
-- Refused by the engine
SELECT a.x FROM c.E a WHERE a.t > current_date - INTERVAL '7 days'
```

```sql
-- Refused by the engine
SELECT 1
```

```sql
-- Refused by the engine
SELECT regexp_extract(a.x, '[0-9]+') FROM c.E a
```

```sql
-- Refused by the engine
SELECT now() FROM c.E a
```

```sql
-- Refused by the engine
WITH u AS (SELECT a.x FROM c.E a UNION ALL SELECT b.x FROM c.F b) SELECT u.x FROM u
```

```sql
-- Refused by the engine
SELECT stddev(a.x) FROM c.E a
```

```sql
-- Refused by the engine
SELECT a.x FROM c.E a WHERE ROW_NUMBER() OVER (ORDER BY a.x) = 1
```

## Looking around (read-only)

| Statement | Answers |
|---|---|
| `SHOW MODEL` / `SHOW MODEL STATS` / `SHOW MODEL COVERAGE` | The entities and relations, their row counts, which tables the model covers |
| `SHOW LINKS OF <Entity> '<key>'` | Everything one instance is linked to |
| `SHOW LINEAGE OF <Entity> '<key>'` | The rows it was made from (`DOWN`/`UP` for direction) |
| `SHOW RAW '<_source_key>'` | The source item a row came from, as it landed |
| `SHOW RECORDS LIKE '<text>'` | Instances whose name or key matches |
| `SHOW CORPUSES`, `SHOW ENTITIES`, `SHOW DATASETS`, `SHOW TABLES`, `SHOW VIEWS`, `SHOW MATERIALIZED VIEWS`, `SHOW TOOLS`, `SHOW EDGES`, `SHOW ONTOLOGIES`, `SHOW BINDINGS`, `SHOW STRUCTURES` | What exists |
| `DESCRIBE <name>`, `DESCRIBE TOOL <name>`, `DESCRIBE EDGE <name>` | One object's definition and columns |
| `EXPLAIN [ANALYZE] SELECT ...` | The plan, and with `ANALYZE` the rows and time per step |

```sql
SHOW LINKS OF Customer 'acme' LIMIT 50
```

```sql
SHOW LINEAGE OF Order 'PO-1001' DOWN
```
