---
title: "Functions"
---

# Functions

Functions grouped by what they work on.

## Text

### Case and length

| Name | What it does |
|---|---|
| [LOWER](functions/lower.md) | A string in lower case. |
| [UPPER](functions/upper.md) | A string in upper case. |
| [INITCAP](functions/initcap.md) | A string with the first letter of each word in upper case. |
| [LENGTH](functions/length.md) | The number of characters in a string. |

### Find

| Name | What it does |
|---|---|
| [STRPOS](functions/strpos.md) | The position of a substring in a string. |
| [POSITION](functions/position.md) | The position of a substring in a string, standard form. |
| [STARTS_WITH](functions/starts_with.md) | Whether a string begins with a prefix. |
| [REGEXP_LIKE](functions/regexp_like.md) | Whether a string matches a regular expression. |

### Take part of a string

| Name | What it does |
|---|---|
| [SUBSTRING](functions/substring.md) | Part of a string, by start position and length. |
| [LEFT](functions/left.md) | The first characters of a string. |
| [RIGHT](functions/right.md) | The last characters of a string. |
| [SPLIT_PART](functions/split_part.md) | One part of a string split on a delimiter. |

### Change a string

| Name | What it does |
|---|---|
| [REPLACE](functions/replace.md) | A string with every occurrence of one substring replaced by another. |
| [REGEXP_REPLACE](functions/regexp_replace.md) | A string with matches of a regular expression replaced. |
| [TRIM](functions/trim.md) | A string with characters removed from both ends. |
| [LTRIM](functions/ltrim.md) | A string with characters removed from the start. |
| [RTRIM](functions/rtrim.md) | A string with characters removed from the end. |
| [LPAD](functions/lpad.md) | A string padded on the left to a length. |
| [RPAD](functions/rpad.md) | A string padded on the right to a length. |
| [REVERSE](functions/reverse.md) | A string with its characters in reverse order. |
| [CONCAT](functions/concat.md) | Strings joined end to end, skipping NULLs. |
| [CONCAT_WS](functions/concat_ws.md) | Strings joined with a separator, skipping NULLs. |

### Split into rows

| Name | What it does |
|---|---|
| [STRING_TO_TABLE](functions/string_to_table.md) | One row for each piece of a string split on a delimiter. |
| [REGEXP_SPLIT_TO_TABLE](functions/regexp_split_to_table.md) | One row for each piece of a string split on a regular expression. |

## Number

| Name | What it does |
|---|---|
| [ABS](functions/abs.md) | The absolute value of a number. |
| [ROUND](functions/round.md) | A number rounded to a number of decimal places. |
| [TRUNC](functions/trunc.md) | A number cut to a number of decimal places, toward zero. |
| [CEIL](functions/ceil.md) | The smallest whole number not less than a number. |
| [FLOOR](functions/floor.md) | The largest whole number not greater than a number. |
| [SIGN](functions/sign.md) | -1, 0 or 1 by the sign of a number. |
| [MOD](functions/mod.md) | The remainder of one number divided by another. |
| [POWER](functions/power.md) | A number raised to a power. |
| [SQRT](functions/sqrt.md) | The square root of a number. |

## Date and time

| Name | What it does |
|---|---|
| [CURRENT_DATE](functions/current_date.md) | Today's date in UTC. |
| [EXTRACT](functions/extract.md) | One field of a date or timestamp; with epoch, the way to do date arithmetic. |
| [DATE_PART](functions/date_part.md) | One field of a date or timestamp, such as the year, month or epoch seconds. |
| [DATE_TRUNC](functions/date_trunc.md) | A date or timestamp cut back to the start of its year, month, week or other unit. |

## Conditional

| Name | What it does |
|---|---|
| [COALESCE](functions/coalesce.md) | The first argument that is not NULL. |
| [NULLIF](functions/nullif.md) | NULL when two values are equal, otherwise the first value. |
| [GREATEST](functions/greatest.md) | The largest of its arguments, ignoring NULLs. |
| [LEAST](functions/least.md) | The smallest of its arguments, ignoring NULLs. |

## Aggregate

| Name | What it does |
|---|---|
| [COUNT](functions/count.md) | The number of rows, non-NULL values or distinct values in a group. |
| [SUM](functions/sum.md) | The total of the non-NULL values in a group. |
| [AVG](functions/avg.md) | The mean of the non-NULL values in a group. |
| [MIN](functions/min.md) | The smallest non-NULL value in a group. |
| [MAX](functions/max.md) | The largest non-NULL value in a group. |
| [STRING_AGG](functions/string_agg.md) | The values of a group joined into one string with a separator. |
| [ARRAY_AGG](functions/array_agg.md) | The values of a group collected into a list. |

## Window

### Ranking

| Name | What it does |
|---|---|
| [ROW_NUMBER](functions/row_number.md) | The position of each row in its partition, counting from 1. |
| [RANK](functions/rank.md) | The rank of each row in its partition, with gaps after ties. |
| [DENSE_RANK](functions/dense_rank.md) | The rank of each row in its partition, with no gaps after ties. |
| [NTILE](functions/ntile.md) | Splits each partition into a number of buckets of near-equal size. |
| [PERCENT_RANK](functions/percent_rank.md) | The relative rank of each row in its partition, from 0 to 1. |
| [CUME_DIST](functions/cume_dist.md) | The share of rows in the partition that sort at or before each row. |

### Other rows

| Name | What it does |
|---|---|
| [LAG](functions/lag.md) | A value from a row before the current one in the partition. |
| [LEAD](functions/lead.md) | A value from a row after the current one in the partition. |
| [FIRST_VALUE](functions/first_value.md) | The value from the first row of the window frame. |
| [LAST_VALUE](functions/last_value.md) | The value from the last row of the window frame. |
| [NTH_VALUE](functions/nth_value.md) | The value from the nth row of the window frame. |
