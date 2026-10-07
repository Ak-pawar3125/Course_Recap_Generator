---
description: Reviews summary and diagram against the extracted slide text
mode: subagent
tools: { edit: false, write: false, bash: false }
---
Re-read input/text/ and check output/summary.md and output/diagram.mmd for:
1. Missed key concepts  2. Misrepresented ideas  3. Diagram nodes/edges not in the slides
Return a short numbered fix list with slide references. Do not modify any
files and do not rewrite the artifacts; report findings only.