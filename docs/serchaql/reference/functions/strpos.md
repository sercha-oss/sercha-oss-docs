---
title: "STRPOS"
description: "The position of a substring in a string."
---

# STRPOS

[Functions › Text › Find](../functions.md#text)

Returns the position of the first occurrence of a substring, counting from 1, or 0 when it is not found.

## Syntax

```text
STRPOS( <string>, <substring> )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to search. |
| `<substring>` | The text to find. Matched exactly, with case. |

## Returns

An integer: the character position of the first match, or 0 when there is none. 1 when `<substring>` is empty. NULL when any argument is NULL.

## Usage notes

- [POSITION](../functions/position.md) is the standard form with the arguments the other way round: `POSITION(<substring> IN <string>)`.
- The position counts characters, not bytes.
- On large tables the engine runs it in the data store.

## Examples

```sql
SELECT f.name, STRPOS(f.name, '.') AS dot
FROM tables.drive.file f
WHERE STRPOS(f.name, 'draft') > 0
```

| name | dot |
|---|---|
| draft_plan.docx | 11 |

With [SUBSTRING](../functions/substring.md), take the text before a character:

```sql
SELECT c.email, SUBSTRING(c.email, 1, STRPOS(c.email, '@') - 1) AS mailbox FROM Customer c
```

| email | mailbox |
|---|---|
| ana.ruiz@example.com | ana.ruiz |

## See also

[POSITION](../functions/position.md) · [SUBSTRING](../functions/substring.md) · [SPLIT_PART](../functions/split_part.md) · [STARTS_WITH](../functions/starts_with.md) · [LIKE](../clauses/like.md)
