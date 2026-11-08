---
title: "INITCAP"
description: "A string with the first letter of each word in upper case."
---

# INITCAP

[Functions › Text › Case and length](../functions.md#text)

Returns a string with the first letter of each word in upper case and the other letters in lower case.

## Syntax

```text
INITCAP( <string> )
```

## Arguments

| Argument | Description |
|---|---|
| `<string>` | The text to convert. |

## Returns

Text. NULL when `<string>` is NULL.

## Usage notes

- A word is a run of letters and digits. Any other character, such as a space, hyphen or apostrophe, starts a new word: `INITCAP('o''neil-SMITH')` is `O'Neil-Smith`.
- A digit counts as part of a word, so the letter after it stays lower case: `INITCAP('3RD AVENUE')` is `3rd Avenue`.
- It always runs after the rows are read, never in the data store.

## Examples

```sql
SELECT c.key, INITCAP(c.name) AS name
FROM Customer c
```

| key | name |
|---|---|
| C-104 | Ana Ruiz |
| C-310 | Mary-Jane O'Neil |

## See also

[UPPER](../functions/upper.md) · [LOWER](../functions/lower.md)
