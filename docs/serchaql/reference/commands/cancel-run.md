---
title: "CANCEL RUN"
description: "Stop an extraction run that has not finished."
---

# CANCEL RUN

[Commands › Extracting entities from documents](../commands.md#extracting-entities-from-documents) · Admins only, through `sercha_define` or a tenant file

Cancels a run. Nothing the run staged is sealed, so the rows it was producing never appear.

## Syntax

```text
CANCEL RUN <run_id>
```

## Parameters

| Parameter | Description |
|---|---|
| `<run_id>` | The run's id, as [RUN BINDING](../commands/run-binding.md) or `SHOW RUNS` gives it. Quote an id with dashes: `'5e7a...'`. |

## Usage notes

- A run that already finished, failed or was cancelled is left alone; the result says so.
- An unknown id is an error.

## Examples

```sql
CANCEL RUN '5e7a2b10-4c1d-4a8e-9f3b-0d2c6e1a7b44'
```

| result |
|---|
| run 5e7a2b10-4c1d-4a8e-9f3b-0d2c6e1a7b44 cancelled; nothing it staged is sealed |

## See also

[RUN BINDING](../commands/run-binding.md) · [DROP RUN](../commands/drop-run.md)
