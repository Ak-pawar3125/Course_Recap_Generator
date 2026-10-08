# Course Recap Generator — Plan

## Path classification
**Architectural.** New pipeline, new artifacts, three new site files, no existing flow to read. Needs your sign-off on the written plan before code.

## Repo facts that shape the design

| Fact | Consequence |
|---|---|
| `input/text/` does not exist | `extract.py` must run first. Task 1. |
| 4 decks in `input/` | One course, Day 1–4. Slide numbers must be namespaced per deck (`L1 S4`), since each file restarts at `## Slide 1`. |
| pdf MCP disabled (`opencode.json:7`) | `deck-summarizer` reads text files only — correct already. `.opencode/agents/summary-reviewer.md` is unusable as written; planning around the `agent/` version per your call. |
| `.opencode/agent/summary-reviewer.md:8` truncated | Ends `"Do not"` — task 2 completes it. |
| No git commits yet | I'll leave committing alone unless you ask. |

---

## Decision (a) Content extraction approach

**Option 1 — pypdf text, delegated to `@deck-summarizer` (recommended).**
`extract.py` writes `input/text/<deck>.md` with `## Slide N` sections. `@deck-summarizer` applies `deck-concept-extraction` and `diagram-style`, writes `output/summary.md` + `output/diagram.mmd`, renders once via mermaid MCP.
*Why:* the PDF MCP already failed on this deck. Text-first is the only path that works, and `deck-summarizer` is already scoped exactly this way (`.opencode/agent/deck-summarizer.md`).

**Option 2 — re-attempt the pdf MCP.** Add visual inspection of slide graphics.
*Against:* it failed once on this content; `opencode.json` has it disabled; re-enabling adds a failure mode for zero gain on a text-heavy lecture deck.

**Option 3 — a single agent does extract + summarize.** One context, no file handoff.
*Against:* no clean boundary to review. `@summary-reviewer` must re-read `input/text/` independently — that only works if extraction is already on disk and untouched by the summarizer.

**Extraction caveats to carry into the plan:** pypdf loses reading order on multi-column and figure slides, and drops all images. Any slide whose text comes back near-empty is a known blind spot — the summarizer must cite it as unread rather than infer content. Flag those slides in `output/summary.md` under a `Source notes` line.

---

## Decision (b) Summary structure

**Option 1 — per-topic, deck-partitioned (recommended).**
One `output/summary.md`, sections grouped by Day 1–4; within each day, per-topic bullets (3–5) and slide citations. Follows the skill's fixed output format: title/purpose → 5–8 key concepts → per-topic sections → relationships → glossary.
*Why:* it satisfies `deck-concept-extraction/SKILL.md` as written, and maps 1:1 onto the site's topic sections and Day nav. Citations stay auditable because every bullet ends in `(Day N, Slide M)`.

**Option 2 — per-slide.** One entry per slide, all 4 decks.
*Against:* ~150+ near-duplicate entries, unreadable as a recap, and a poor fit for the skill's required per-topic sections.

**Option 3 — whole-deck prose narrative.** Three or four flowing paragraphs.
*Against:* loses the slide-number anchoring the accuracy requirement depends on. Citations would end up section-level, not claim-level.

**Recommendation:** Option 1. Concretely `output/summary.md` gets: title + one-line purpose; 8 key concepts max, each with slide refs; `## Day 1 — <lecture title>` … `## Day 4`, each with `###<topic>` and 3–5 bullets; a `## Relationships` list of `A -> B (reason)` pairs; a `## Glossary`; and `## Source notes` for the pypdf blind spots.

---

## Decision (c) Diagram type

**Option 1 — `flowchart TD`, one diagram for the whole course (recommended).**
Day nodes → topic nodes → concept nodes, ≤12 nodes total, labels under 5 words, no special characters.
*Why:* the decks are sequential (Foundations → Prompting → Coding → Inference), so directionality is real and a flowchart shows the progression the recap is actually about. `diagram-style/SKILL.md` prescribes `flowchart TD` for flows. At 12 nodes it stays legible in a browser at mobile width.

**Option 2 — `mindmap`.** Radial topic overview.
*Against:* the skill reserves mindmap for topic overviews, and this content has a genuine order — a mindmap would flatten Lecture 1 into the same rank as Lecture 4. Also worse on mobile; radial layouts need horizontal scroll below ~600px.

**Option 3 — one `flowchart TD` per day.** Four diagrams.
*Against:* the user asked for "rendered Mermaid diagram," singular. Four would bloat the page and break the single-accent discipline.

**Constraint:** 12 nodes is tight for 4 days × topics. If the summarizer can't fit it, it drops to Day nodes + top concepts only rather than exceeding the cap.

---

## Decision (d) Website design direction

**Concept A — Technical notebook (recommended, your pick).**
Dark-first. The subject is an engineering lecture course, so the visual world is terminal documentation: near-black ground, one electric-cyan accent, monospace reserved for slide citations and day markers, a neutral grotesque for prose.

```
┌──────────────────────────────────────────────────┐
│  AAP LECTURES DAY 1 ▾  DAY 2  DAY 3 4 │  sticky, thin rule under
├──────────────────────────────────────────────────┤
│  Foundations of                          L1 S1–L1 S12│
│  Large Language Models                             │
│  ─────────────────────────                          │
│  Purpose line, one sentence.                       │
├────┬─────────────────────────────────────────────┤
│ 03 │  KEY CONCEPTS                               │
│ L1 │ ┌──────────┐ ┌──────────┐ ┌──────────┐     │  cards, slide-ref
│ S12 │  │ Token    │ │ Context  │ │ Window   │     │  in the corner
│    │  └──────────┘ └──────────┘ └──────────┘     │
├────┴─────────────────────────────────────────────┤
│  DAY 1 · FOUNDATIONS                     [DAY 1→4]│
│  ### Transformer architecture │
│  • Self-attention weights every token...  L1 S7   │  citations as a mono
│  • Positional encoding injects order...    L1 S8   │  marginalia column
├──────────────────────────────────────────────────┤
│  COURSE MAP        [rendered mermaid]            │  full-bleed, own surface
├──────────────────────────────────────────────────┤
│  GLOSSARY   Attention · Token · KV cache ...     │
├──────────────────────────────────────────────────┤
│  footer: source decks, slide counts, generation  │
└──────────────────────────────────────────────────┘
```

- **Color:** ground `#0B0D0E`, raised surface `#15181A`, accent `#22D3EE` (cyan), text `#E6E8E9`, muted `#8A9194`. One accent, used only for links, the active day marker, and diagram strokes.
- **Type:** `JetBrains Mono` for day markers, slide refs, diagram labels; `Inter` for prose and headings. Two families, clearly distinct by role rather than by accident.
- **Layout:** left-aligned throughout, measure capped at ~70ch. On ≥900px the slide citations sit in a fixed right rail; below that they reflow inline after the sentence they support.
- **Signature move:** the **slide-citation rail** — citations are structurally load-bearing, not decoration, because they're the accuracy proof. That's the one bold element; everything else stays quiet.
- **Self-critique against the frontend-design defaults:** it avoids cream/serif/terracotta, avoids acid-green-on-black, avoids hairline broadsheet columns, avoids the uniform rounded-card kit (concept cards get asymmetric corner treatment and no drop shadows), and avoids ALL-CAPS eyebrows and middle-dot meta strings. Day markers read `DAY 1`, plain, not tracked out.

**Concept B — Technical textbook.** Light-first, paper-white ground, deep-ink accent, a text serif for concept prose, citations as superscript numerals, wider margins, longer measure. Elegant and highly readable, but it drops the visible citation machinery that this brief's accuracy requirement depends on — the reviewer-verified slide numbers should be *seen*, not whispered.

**Recommendation:** Concept A. The citations are the product's central claim about itself; the design should show them.

**Tokens to write:** `--bg`, `--surface`, `--accent`, `--text`, `--muted` under `:root` and a `[data-theme="light"]` override block. `accent-color` + `:focus-visible` outlines throughout; toggle persisted to `localStorage`, defaulting to `prefers-color-scheme`.

---

## Numbered task list (single pass)

**Task 0 — Fix the truncated reviewer agent**
Complete `.opencode/agent/summary-reviewer.md:8` (currently ends `"Do not"`) so it states: do not modify files, return only the numbered fix list.
*Accept:* file ends in a complete sentence; agent loads without a parse error.

**Task 1 — Run extraction**
`python extract.py` → `input/text/AAPLecture{1..4}_*.md`.
*Accept:* 4 files exist; slide count per file matches the PDF page count printed by the script; every file's first heading is `## Slide 1`.

**Task 2 — Summarize and diagram** (`@deck-summarizer`)
Reads `input/text/`, applies both skills, writes `output/summary.md` + `output/diagram.mmd`, renders the diagram once with the mermaid MCP.
*Accept:* summary has title/purpose, 5–8 key concepts, Day 1–4 topic sections, Relationships, Glossary, Source notes; every concept and bullet carries a `(Day N, Slide M)` ref; diagram is ≤12 nodes, `flowchart TD`, every node traceable to the Relationships section; mermaid render succeeds with no syntax error.

**Task 3 — Review** (`@summary-reviewer`)
Independent read of `input/text/` against both artifacts.
*Accept:* returns a numbered fix list covering missed concepts, misrepresented ideas, and unsupported diagram nodes, each with a slide reference; or explicitly reports no fixes.

**Task 4 — One fix pass** (single revision, in the orchestrator, not the agent)
Apply every reviewer fix to `summary.md` and `diagram.mmd` in one edit pass.
*Accept:* every item in the Task 3 list is addressed or explicitly rejected with a reason; no new claims introduced beyond what the reviewer approved; citations still resolve to real slides.

**Task 5 — Build the site**
Write `site/index.html`, `site/style.css`, `site/script.js`.
*Accept:* sections present and in order — hero (course title, day, one-line purpose), key concept cards with slide numbers, Day 1–4 topic sections, rendered Mermaid diagram, glossary, footer; every string of prose traces to a line in `output/summary.md`, no free rewriting; citations visible; Mermaid loaded from CDN and rendering; toggle works and persists; mobile-first at 360px with no horizontal scroll; visible keyboard focus; `prefers-reduced-motion` respected.

**Task 6 — Quality checklist pass**
Check the built site against the short list below.
*Accept:* all 12 checks pass on the first run after Task 5, or each failure is a listed, intentional deviation.

### Do not loopOne pass per task. If Task 3 returns fixes, Task 4 applies them **once**. If Task 4 leaves an item unresolved, log it in `output/summary.md` under `Source notes` as a known limitation and move on. If the Task 6 checklist fails on a rendering issue, fix that specific item only — do not reopen Task 2. The only re-entry permitted is a reviewer finding that proves a summary claim is factually absent from the slides; that one item gets fixed and the site ships with it noted. No task runs more than twice.

### Quality checklist (Task 6)
1. Every claim on the site has a visible slide citation.
2. No prose on the site that isn't in `summary.md`.
3. Hero day matches the Day 1–4 nav.
4. Key concept cards number5–8 and match the summary exactly.
5. Diagram node count ≤12; no node absent from the Relationships section.
6. Mermaid renders in both light and dark themes without a broken SVG frame.
7. Toggle persists across reload.
8. No horizontal scroll at 360px.
9. Text/background contrast ≥4.5:1 in both themes.
10. Full keyboard traversal; focus visible on every interactive element.
11. Exactly one accent color; no second hue introduced by Mermaid theming.
12. Reduced-motion preference suppresses the load animation.

---

Two things worth flagging: the 12-node diagram cap is the tightest constraint (4 days × topics won't fit), and `@deck-summarizer` and `@summary-reviewer` both have `bash: false` — so neither can count slides or run the renderer itself; the mermaid render in Task 2 has to happen in the orchestrator unless you'd rather I adjust the agent permissions.

(End of file - total 160 lines)

## Revision log: changes after planning (2026-10-08)

1. **Extraction moved to extract.py (pypdf)**
   - The pdf MCP (@sylphlab/pdf-reader-mcp) failed with Buffer/Uint8Array error; pinned 0.3.15 would not connect.
   - Added extract.py using pypdf, writes per-slide text to input/text/; agents read from there.
   - Shown in: extract.py (pypdf extraction), input/text/*.md (output), opencode.json (pdf MCP disabled)

2. **Mermaid MCP needs Windows wrapper**
   - Global install required; "cmd /c" wrapper in opencode.json before it connected.
   - Shown in: opencode.json:11 ("command": ["cmd", "/c", "mcp-mermaid"])

3. **Website rebuilt as interactive tool**
   - First static report had no upload and no visible diagram.
   - Rebuilt with PDF upload (pdf.js in browser), extractive summary, glossary, Mermaid diagram with flowchart/mindmap toggle, light/dark mode.
   - Shown in: site/index.html (upload, tabs, toolbar), site/script.js (pdf.js, extractive summarizer, diagram builder, theme toggle)

4. **Sample recap reduced to one deck; hides on upload**
   - Was four decks; now only Day 3 (AI Coding Techniques). Sample section hidden when user uploads a file.
   - Shown in: site/index.html:162 (sample section), site/script.js:1219+ (sample hidden on upload)

5. **Source notes removed; Final summary added (8–10 lines with slide numbers)**
   - Source notes section removed from summary.md; Final summary section added with 8–10 lines, each citing slide numbers.
   - Shown in: output/summary.md (no Source notes, has Final summary), site/script.js:1074 (renderFinalSummary)

6. **Copy and download for summary (Markdown) and diagram (SVG + .mmd)**
   - Buttons for copy/download summary as Markdown; copy/download diagram as SVG and .mmd.
   - Shown in: site/index.html:108-110,138-140 (results), site/index.html:170-172,196-199 (sample), site/script.js:872 (copyText), site/script.js:906 (download)

7. **Hero and page title renamed to "Course Recap Generator"**
   - Title and brand text updated.
   - Shown in: site/index.html:6 (<title>), site/index.html:32 (brand), site/index.html:55 (hero title)

8. **Project folder renamed from PPT_Analyzer to Course_Recap_Generator**
   - Repository and folder name changed.
   - Shown in: README.md:1, README.md:57 (structure), git history (f4a3369)

9. **GitHub main protected by repository ruleset; changes via PRs (plain git)**
   - Main branch protected; push through pull requests using plain git, not GitHub MCP.
   - Shown in: git log shows merge commits (ed76d52), GitHub MCP not configured in opencode.json

10. **Documentation added: README.md (exists); docs/architecture.md does not exist**
    - README.md created with full project docs.
    - docs/architecture.md was planned but not created.
    - Shown in: README.md (exists), docs/ (no architecture.md)

---

### Still true from the original plan
- Single pass per task (Task 0–6), one review round (Task 3 reviewer, Task 4 fix pass)
- Reviewer is read-only (summary-reviewer.md: tools bash: false, edit: false, write: false)
- Skills used: deck-concept-extraction, diagram-style (as specified in deck-summarizer.md)
- Extraction via extract.py writing input/text/ (Task 1)
- Summary structure: title/purpose → key concepts → per-day topics → relationships → glossary (matches deck-concept-extraction skill)
- Diagram: flowchart TD, ≤12 nodes, labels ≤5 words (diagram-style skill)
- Site: dark-first technical notebook, one cyan accent, monospace citations, Inter for prose, citation rail, light/dark toggle persisted (Concept A)