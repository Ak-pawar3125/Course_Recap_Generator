# Course Recap Generator

Takes course slide PDFs, extracts the text, and produces a slide-cited summary, key concepts, glossary, final summary and a Mermaid diagram, shown on a static website where users can also upload their own PDF. Harness used: OpenCode.

Live site: https://course-recap-generator.netlify.app

## 1. Planning phase and my choices

Summarized from docs/plan.md:

**Decision (a) Content extraction** — Option 1: pypdf text via `extract.py`, delegated to `@deck-summarizer`. The pdf MCP failed on this deck; text-first is the only path that works. The summarizer reads `input/text/` markdown files and applies the skills.

**Decision (b) Summary structure** — Option 1: per-topic, deck-partitioned. One `output/summary.md` with Day 1–4 sections, each with topic bullets and slide citations. Matches the skill's fixed output format and maps 1:1 onto the site's topic sections and Day nav.

**Decision (c) Diagram type** — Option 1: `flowchart TD`, one diagram for the whole course (≤12 nodes). The decks are sequential (Foundations → Prompting → Coding → Inference), so directionality is real. Mindmap would flatten the order; four diagrams would bloat the page.

**Decision (d) Website design direction** — Concept A: Technical notebook, dark-first. Near-black ground, one electric-cyan accent, monospace for citations and day markers, Inter for prose. The slide-citation rail is the signature move — citations are structurally load-bearing, not decoration.

Planning used OpenCode Plan mode with the brainstorming skill. Evidence: docs/plan.md.

## 2. MCP servers

**mermaid MCP (mcp-mermaid):** Renders and validates the diagram. In opencode.json it uses `["cmd", "/c", "mcp-mermaid"]` — on Windows this needed a global install and the `cmd /c` wrapper to connect.

**pdf MCP (@sylphlab/pdf-reader-mcp):** Connected but reading the course deck failed with a Buffer/Uint8Array error. A pinned older version (0.3.15) would not connect. I extracted text with `extract.py` (pypdf) into `input/text/` instead.

The website itself reads PDFs in the browser with pdf.js (loaded from CDN).

## 3. Sub-agents

**deck-summarizer** (`.opencode/agent/deck-summarizer.md`): Reads `input/text/`, applies `deck-concept-extraction` and `diagram-style` skills, writes `output/summary.md` and `output/diagram.mmd`, renders the diagram once with the mermaid MCP. Tools: edit, write.

**summary-reviewer** (`.opencode/agent/summary-reviewer.md`): Re-reads `input/text/` and checks `output/summary.md` and `output/diagram.mmd` for missed concepts, misrepresented ideas, and unsupported diagram nodes. Returns a numbered fix list with slide references. Tools: none (read-only). Read-only because it must re-read sources independently — that only works if extraction is already on disk and untouched by the summarizer.

The pipeline had one review round. I kept one diagram edge (`Day 3 -> Day 4`) against the reviewer's suggestion. Reason: Day 3's own next-up slide points at "Week 2" rather than this deck, but the deck is sequenced after Day 2 and before Day 4 as presented; that ordering is the course structure, not a claim the slides make. It is a navigation edge, not a slide-derived relationship. Source: output/summary.md line 196.

Both agents read the four extracted text files in `input/text/`.

## 4. Skills

**deck-concept-extraction** (custom skill): Output format — title/purpose, 5–8 key concepts with slide refs, per-topic sections (3–5 bullets each), Relationships list ("A -> B (reason)"), Glossary. Rules: only use content present in slides; cite slide numbers for every key concept. Reusable on any deck because it operates on the extracted text files, not the PDFs directly.

**diagram-style:** Converts the Relationships section into a Mermaid diagram. `flowchart TD` for flows, `mindmap` for topic overviews. Max 12 nodes, labels under 5 words, no special characters. Every node must come from the summary's Relationships or Key concepts.

**brainstorming:** Used during Plan mode to explore options and record decisions in docs/plan.md.

**frontend-design:** Guided the Technical notebook concept (Concept A) — dark-first, one accent, monospace for citations, citation rail as the signature move.

## 5. Single clean pass

Flow: `input/text` → `deck-summarizer` → `summary-reviewer` → fixes applied once → website. No open-ended loops. The plan explicitly forbids looping: if reviewer returns fixes, apply them once; if any item remains unresolved, log it in `output/summary.md` under `Source notes` as a known limitation and move on.

Later website edits (hero text, final summary card, upload fix) were separate small prompts and not part of the pipeline.