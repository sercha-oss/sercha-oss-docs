---
title: "LENGTH"
description: "The number of characters in a string."
---

# LENGTH

[Functions › Text › Case and length](../functions.md#text) · Also written `CHAR_LENGTH`, `CHARACTER_LENGTH`

Returns the number of characters in a string.

## Syntax

```text
LENGTH( <string> )
CHAR_LENGTH( <string> )
CHARACTER_LENGTH( <string> )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to measure. A number, boolean or date is measured as its text. |

## Returns

An integer. NULL when `<string>` is NULL.

## Usage notes

- It counts characters, not bytes: `LENGTH('café')` is 4.
- An empty string stored in a column reads as NULL, so its length is NULL, not 0. Wrap it in [COALESCE](../functions/coalesce.md) to get 0.
- On large tables the engine runs it in the data store, in the select list and in `WHERE`.

## Examples

```sql
SELECT t.key, t.title, LENGTH(t.title) AS chars
FROM Ticket t
WHERE LENGTH(t.title) < 10
```

| key | title | chars |
|---|---|---|
| T-88 | Login bug | 9 |
| T-93 | Typo | 4 |

```sql
SELECT COALESCE(CHAR_LENGTH(c.notes), 0) AS notes_length FROM Customer c
```

| notes_length |
|---|
| 0 |
| 142 |

## See also

[SUBSTRING](../functions/substring.md) · [LEFT](../functions/left.md) · [RIGHT](../functions/right.md) · [TRIM](../functions/trim.md)
