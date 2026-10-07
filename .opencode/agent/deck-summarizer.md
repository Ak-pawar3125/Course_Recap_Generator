---
description: Reads extracted slide text and writes the summary and diagram source
mode: subagent
tools: { edit: true, write: true, bash: false }
---
Read the files in input/text/ (one section per slide). Apply the
deck-concept-extraction skill and write output/summary.md. Then apply
diagram-style, write output/diagram.mmd and render it once with the mermaid MCP.
Only use content that appears in the slides.