---
title: "LOWER"
description: "A string in lower case."
---

# LOWER

[Functions › Text › Case and length](../functions.md#text)

Returns a string with every letter in lower case.

## Syntax

```text
LOWER( <string> )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to convert. A number, boolean or date is converted as its text. |

## Returns

Text. NULL when `<string>` is NULL.

## Usage notes

- Letters outside ASCII are converted too: `LOWER('ÉCOLE')` is `école`.
- Use it to compare text without regard to case. `ILIKE` does the same for a pattern.
- On large tables the engine runs it in the data store, in the select list and in `WHERE`.

## Examples

```sql
SELECT c.key, LOWER(c.email) AS email
FROM Customer c
WHERE LOWER(c.email) LIKE '%@example.com'
```

| key | email |
|---|---|
| C-104 | ana.ruiz@example.com |
| C-221 | j.smith@example.com |

Group names that differ only in case:

```sql
SELECT LOWER(a.name) AS name, COUNT(*) AS accounts
FROM tables.crm.account a
GROUP BY LOWER(a.name)
HAVING COUNT(*) > 1
```

| name | accounts |
|---|---|
| northwind traders | 2 |

## See also

[UPPER](../functions/upper.md) · [INITCAP](../functions/initcap.md) · [LIKE](../clauses/like.md) · [TRIM](../functions/trim.md)
