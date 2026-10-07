/* ==========================================================================
   Course Recap Generator — all logic runs in the browser.
   No network calls for user data, no fetches for content. The sample recap
   is embedded below as strings so the page works from any path.
   ========================================================================== */
(function () {
  'use strict';

  /* ────────────────────────────────────────────────────────────────────
     1. EMBEDDED SAMPLE RECAP
     Copied verbatim from the four lecture decks' summary. Nothing here is
     fetched, so it works on file:// and from any static host.
     ──────────────────────────────────────────────────────────────────── */

  var SAMPLE_MD = [
    '# Sample: AI Coding Techniques, Day 3 (Slides 1-21)',
    '',
    'Day 3 covers the agent harness: a model wired into a loop that perceives, decides, acts, and observes, plus the tools and practices for building with LLMs. Slides 1-21.',
    '',
'## Key concepts',
  '',
  '- **The tool landscape**: Four tools, one defining trait each, compared by strength and typical use. (Day 3, Slides 3 and 5)',
  '- **The agent harness**: It isn\'t just a smarter chatbot; it\'s a model wired into a loop. (Day 3, Slides 6 and 7)',
  '- **Agentic file editing**: It reads and edits real files, not just answers. (Day 3, Slide 13)',
  '- **Plan mode**: It proposes a plan before it acts. (Day 3, Slide 14)',
  '- **Self-correcting on errors**: It runs the code, sees errors, fixes them. (Day 3, Slide 15)',
  '- **Skills**: Teach it once, reuse it every time. (Day 3, Slide 16)',
  '- **MCP**: The agent reaches outside the codebase, through host, client, and server. (Day 3, Slide 17)',
  '- **Sub-agents**: It delegates a sub-task to another agent. (Day 3, Slide 19)',
  '',
  '## Day 3 — AI Coding Techniques: From understanding LLMs to building with them',
    '',
    '### The tool landscape',
    '- Four tools, one defining trait each, compared by strength and typical use. (Day 3, Slide 3)',
    '- The choice is one tool for execution, not all four. (Day 3, Slide 5)',
    '',
    '### The agent harness',
    '- It isn\'t just a smarter chatbot; it\'s a model wired into a loop. (Day 3, Slide 6)',
    '- The loop is: perceive, decide, act, observe. Repeat. (Day 3, Slide 7)',
    '- What this extends: the environment joins the conversation. (Day 3, Slide 8)',
    '- Model plus harness equals agent: the model proposes, the harness does. (Day 3, Slide 9)',
    '- A harness is everything around the model; four tools share one pattern, same architecture, different surface, and the tool ships one that you extend. (Day 3, Slide 10)',
    '',
    '### Harness capabilities',
    '- Agentic file editing: it reads and edits real files, not just answers. (Day 3, Slide 13)',
    '- Plan mode: it proposes a plan before it acts. (Day 3, Slide 14)',
    '- Self-correcting on errors: it runs the code, sees errors, fixes them. (Day 3, Slide 15)',
    '- Skills: teach it once, reuse it every time. (Day 3, Slide 16)',
    '- MCP lets the agent reach outside the codebase, through host, client, and server. (Day 3, Slide 17)',
    '- Sub-agents: it delegates a sub-task to another agent. (Day 3, Slide 19)',
    '',
    '### Best practices',
    '- The best-practice checklist is not blind trust: know exactly where to look. (Day 3, Slide 20)',
    '- Recap: seven ideas, each with a place to pause. (Day 3, Slide 21)',
    '',
'## Relationships',
  '',
  '- Prompt structure -> Agent harness (the harness is everything around the model: structure the model reads, plus what acts) (Day 3, Slide 10)',
  '- Agent harness -> Inference pipeline (the harness loop is a repeated request through prefill and decode) (Day 3, Slide 7)',
    '',
'## Glossary',
  '',
  '- **Agent harness**: Everything around the model. (Day 3, Slide 10)',
  '- **Plan mode**: It proposes a plan before it acts. (Day 3, Slide 14)',
  '- **Skills**: Teach it once, reuse it every time. (Day 3, Slide 16)',
  '- **MCP**: The agent reaches outside the codebase; host, client, server, and what a server offers. (Day 3, Slide 17)',
  '- **Sub-agents**: It delegates a sub-task to another agent. (Day 3, Slide 19)',
    ''
  ].join('\n');

/* The closing lines of the Day 3 recap, in plain language. Every line is a
   sentence that already appears in the Key concepts or topic sections above,
   so nothing here is new text: it is the same material, re-ordered into a
   short read-through. The slide number in brackets is the citation. */
var SAMPLE_FINAL = [
  'Day 3 compares four coding tools, each with one defining trait, judged by strength and typical use. [S3]',
  'You pick one tool for execution, not all four. [S5]',
  'An agent harness is not a smarter chatbot; it is a model wired into a loop. [S6]',
  'The loop is perceive, decide, act, observe, and it repeats. [S7]',
  'What the loop adds is that the environment joins the conversation. [S8]',
  'Model plus harness equals an agent: the model proposes, the harness does. [S9]',
  'The harness is everything around the model, and the tool you use ships one that you extend. [S10]',
  'Agentic file editing means the agent reads and edits real files instead of only answering. [S13]',
  'Plan mode has it propose a plan before it acts. [S14]',
  'Skills teach it once, and you reuse it every time. [S16]'
];

var SAMPLE_MMD = [
  'flowchart TD',
  '  Tools[Tool Landscape]',
  '  Harness[Agent Harness]',
  '  Edit[Agentic File Editing]',
  '  Plan[Plan Mode]',
  '  Fix[Self Correcting]',
  '  Skills[Skills]',
  '  MCP[MCP]',
  '  Sub[Sub Agents]',
  '  Practices[Best Practices]',
  '  Tools --> Harness',
  '  Harness --> Edit',
  '  Harness --> Plan',
  '  Harness --> Fix',
  '  Harness --> Skills',
  '  Harness --> MCP',
  '  Harness --> Sub',
  '  Harness --> Practices'
].join('\n');

var SAMPLE_META = 'Slides 1-21';

  /* ────────────────────────────────────────────────────────────────────
     2. TEXT REPAIR
     PDF text layers lose ligatures and mojibake them. Fix what is safe to
     fix, and never invent words that were not recoverable.
     ──────────────────────────────────────────────────────────────────── */

  var LIGATURES = {
    '\ufb00': 'ff', '\ufb01': 'fi', '\ufb02': 'fl', '\ufb03': 'ffi', '\ufb04': 'ffl',
    '\ufb05': 'st', '\ufb06': 'st', '\ufb07': 'ft', '\u00c6': 'AE', '\u00e6': 'ae',
    '\u0152': 'OE', '\u0153': 'oe', '\u2018': "'", '\u2019': "'", '\u201a': "'",
    '\u201c': '"', '\u201d': '"', '\u00a0': ' ', '\u200b': ''
  };

  /* Words that lose their double-f ligature and come back with the gap. */
  var FF_REPAIRS = {
    dierent: 'different', ecient: 'efficient', eect: 'effect', eective: 'effective',
    efects: 'effects', afected: 'affected', afect: 'affect', ofering: 'offering',
    ofers: 'offers', ofer: 'offer', sufer: 'suffer', sufered: 'suffered',
    sufering: 'suffering', bufer: 'buffer', bufered: 'buffered', bufering: 'buffering',
    difers: 'differs', difer: 'differ', diferent: 'different', diferences: 'differences',
    shufle: 'shuffle', shufling: 'shuffling', caue: 'cause', caing: 'casing',
    irst: 'first', xed: 'fixed', maers: 'matters', maering: 'mattering',
    aers: 'attends', aending: 'attending', aention: 'attention', aentional: 'attentional',
    baers: 'batters', aack: 'attack', aempt: 'attempt', aich: 'which',
    ows: 'flows', ailed: 'failed', aake: 'take', aken: 'taken', ueries: 'queries',
    suers: 'users', suered: 'suffered', uer: 'quer', uests: 'requests',
    nite: 'night'
  };

  var MOJIBAKE = [
    [/â€™/g, '’'], [/â€œ/g, '“'], [/â€\x9d/g, '”'],
    [/â€“/g, '–'], [/â€”/g, '—'], [/â€¢/g, '•'], [/â€¦/g, '…'],
    [/Â/g, ''], [/Ã/g, '']
  ];

  function normalizeText(raw) {
    if (!raw) return '';
    var s = String(raw);

    Object.keys(LIGATURES).forEach(function (ch) {
      s = s.split(ch).join(LIGATURES[ch]);
    });

    MOJIBAKE.forEach(function (pair) { s = s.replace(pair[0], pair[1]); });

    /* Replacement characters are unmappable glyphs. Drop the stray
       U+FFFD runs, then repair the words they broke if we know them. */
    s = s.replace(/\ufffd+/g, '');
    s = s.replace(/�/g, '');

    Object.keys(FF_REPAIRS).forEach(function (broken) {
      s = s.replace(new RegExp('\\b' + broken + '\\b', 'gi'), function (match) {
        var fixed = FF_REPAIRS[broken];
        if (match[0] === match[0].toUpperCase() && match.length > 3) {
          return fixed[0].toUpperCase() + fixed.slice(1);
        }
        return fixed;
      });
    });

    /* Collapse whitespace but keep line structure. */
    s = s.replace(/\r\n?/g, '\n')
         .replace(/[ \t ]+/g, ' ')
         .replace(/ ?\n ?/g, '\n')
         .replace(/\n{3,}/g, '\n\n')
         .split('\n').map(function (l) { return l.trim(); }).join('\n');

    return s.trim();
  }

  function tidy(str) {
    return String(str || '').replace(/\s+/g, ' ').replace(/\s+([.,;:!?])/g, '$1').trim();
  }

  function truncate(str, max) {
    var s = tidy(str);
    if (s.length <= max) return s;
    var cut = s.slice(0, max);
    var lastSpace = cut.lastIndexOf(' ');
    /* Always cut on a word boundary when one is available: a definition
       that stops mid-word ("0.8 MB per") reads as broken. */
    if (lastSpace > max * 0.4) cut = cut.slice(0, lastSpace);
    return cut.replace(/[\s,;:.\u2013-]+$/, '') + '…';
  }

  function titleCase(str) {
    return tidy(str).toLowerCase().replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); });
  }

  /* ────────────────────────────────────────────────────────────────────
     3. CITATIONS
     "(Day 2, Slides 18 and 19)" -> ["L2 S18-19"]
     ──────────────────────────────────────────────────────────────────── */

  var DASH = '–';

  function citeToBadges(cite) {
    if (!cite) return [];
    var out = [];
    String(cite).replace(/\(([^)]*)\)/g, function (_, inner) {
      inner.split(';').forEach(function (part) {
        part = part.trim();
        if (!part) return;
        var dayMatch = part.match(/Day\s+(\d)/i);
        var day = dayMatch ? dayMatch[1] : '';
        var slidesPart = part.replace(/^.*?Slide[s]?\s*/i, '');
        var nums = slidesPart.match(/\d+(?:\s*(?:and|to|-|–)\s*\d+)?/g);
        if (!nums) {
          if (day) out.push('L' + day);
          return;
        }
        nums.forEach(function (chunk) {
          var pair = chunk.split(/\s*(?:and|to|-|–)\s*/);
          var label = pair.length === 2 ? pair[0] + DASH + pair[1] : pair[0];
          out.push((day ? 'L' + day + ' ' : '') + 'S' + label);
        });
      });
      return '';
    });
    return out;
  }

  function slideBadge(n) { return 'S' + n; }

  /* ────────────────────────────────────────────────────────────────────
     4. PARSING THE EMBEDDED SAMPLE MARKDOWN
     Same shape the upload path produces, so both render identically.
     ──────────────────────────────────────────────────────────────────── */

  /* "Some sentence. [S7]" -> { text, cite }. The citation is already the
     badge text, so nothing needs re-parsing downstream. */
  function parseFinalLines(lines) {
    return (lines || []).map(function (line) {
      var t = tidy(line);
      var m = t.match(/^(.*?)\s*\[([^\]]+)\]\s*$/);
      return m
        ? { text: m[1].trim(), badges: [m[2].trim()] }
        : { text: t, badges: [] };
    }).filter(function (l) { return l.text; });
  }

  function parseSampleMarkdown(md) {
    var lines = md.split('\n');
    var recap = {
      kind: 'sample',
      title: '',
      purpose: '',
      meta: SAMPLE_META,
      concepts: [],
      days: [],
      glossary: [],
      /* The sample carries no per-slide cards; the Slides tab says so. */
      slides: [],
      final: parseFinalLines(SAMPLE_FINAL),
      md: md
    };

    var section = null;
    var day = null;
    var topic = null;
    var buffer = [];

    function flushPurpose() {
      if (!recap.purpose && buffer.length) {
        recap.purpose = tidy(buffer.join(' '));
        buffer = [];
      }
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();

      if (line.charAt(0) === '#' && line.charAt(1) !== '#') {
        recap.title = line.replace(/^#+\s*/, '');
        section = null;
        continue;
      }

      if (line.indexOf('## ') === 0) {
        flushPurpose();
        section = line.slice(3).trim().toLowerCase();
        if (section.indexOf('day ') === 0) {
          var head = line.slice(3).trim();
          var m = head.match(/^Day\s+(\d+)\s*[—–-]\s*(.+)$/);
          if (m) {
            day = { marker: 'DAY ' + m[1], title: tidy(m[2]), topics: [] };
            recap.days.push(day);
          }
          topic = null;
        }
        continue;
      }

      if (line.indexOf('### ') === 0 && day) {
        topic = { title: line.slice(4).trim(), items: [] };
        day.topics.push(topic);
        continue;
      }

      if (line.charAt(0) === '-') {
        var body = line.slice(1).trim();
        var citeMatch = body.match(/\s*\((Day\s+\d[^)]*)\)\s*$/);
        var cite = '';
        if (citeMatch) {
          cite = citeMatch[1];
          body = body.slice(0, citeMatch.index).trim();
        }
        var badges = citeToBadges(cite ? '(' + cite + ')' : '');

        if (section === 'key concepts') {
          var strong = body.match(/^\*\*(.+?)\*\*:\s*(.+)$/);
          recap.concepts.push({
            term: strong ? strong[1] : truncate(body, 42),
            text: strong ? strong[2] : body,
            badges: badges
          });
        } else if (section === 'glossary') {
          var g = body.match(/^\*\*(.+?)\*\*:\s*(.+)$/);
          recap.glossary.push({
            term: g ? g[1] : truncate(body, 30),
            def: g ? g[2] : body,
            badges: badges
          });
        } else if (topic) {
          topic.items.push({ text: body, badges: badges });
        }
        continue;
      }

      if (line && section === null && day === null) buffer.push(line);
    }

    flushPurpose();
    return recap;
  }

  /* ────────────────────────────────────────────────────────────────────
     5. EXTRACTIVE SUMMARISER (upload path)
     Nothing is generated: concepts are terms that really occur, and every
     definition is a sentence copied out of a slide.
     ──────────────────────────────────────────────────────────────────── */

  var STOPWORDS = ('a an the and or but if then than that this these those of in on at to for with without from by as is are was were be been being it its it\'s we you they he she i do does did not no nor so such own same too very can will just should now what which who whom when where why how all any both each few more most other some only own here there into over under again further once about above below up down out off').split(' ');

  /* Words that are common in any technical talk and so carry no signal as
     a "key concept" on their own. */
  var GENERIC = ('text word words thing things number numbers part parts slide slides page pages time times model models use used using make makes made need needs want wants know knows like good best better first last next previous new old big small large long short high low real true false full empty first thing first one two three four five six seven eight nine ten also well back even still way ways part point case cases kind sort type types name names number').split(' ');

  var BOILERPLATE_HINT = /^(deboistech|confidential|copyright|all rights reserved|\d{1,2}$|page \d+|slide \d+|\d{1,2} \/\s*\d+)$/i;

  /* Deck furniture that would otherwise read as a title or a concept:
     "PART 3 · STRUCTURE", "CHAPTER TWO", "DAY 1 · ASTRA", and any
     mostly-uppercase running header. */
  var SECTION_HEADER = /^(part|section|chapter|unit|module|track|lecture|lesson|appendix)\b/i;
  var DAY_HEADER = /^day\s+\d+\b/i;

  function upperRatio(str) {
    var letters = str.replace(/[^A-Za-z]/g, '');
    if (!letters.length) return 0;
    var upper = letters.replace(/[^A-Z]/g, '').length;
    return upper / letters.length;
  }

  function isSectionHeader(line) {
    var t = tidy(line);
    if (!t) return true;
    if (SECTION_HEADER.test(t) || DAY_HEADER.test(t)) return true;
    var words = t.split(/\s+/).length;
    if (words <= 8 && upperRatio(t) > 0.7) return true;
    /* Dot-separated all-caps segments, e.g. "PART 4 · INFERENCE VOCABULARY". */
    if (/^[^a-z]{6,}$/.test(t) && /[·|]/.test(t)) return true;
    return false;
  }

  function isNoise(line) {
    var t = tidy(line);
    if (!t) return true;
    if (BOILERPLATE_HINT.test(t)) return true;
    if (/^\d+$/.test(t)) return true;
    if (t.split(/\s+/).length < 2) return true;
    return false;
  }

  function pickSlideTitle(lines) {
    if (!lines.length) return '';
    for (var i = 0; i < lines.length; i++) {
      if (!isNoise(lines[i]) && !isSectionHeader(lines[i])) {
        return truncate(lines[i].replace(/^[\d\s.:|-]+/, ''), 70);
      }
    }
    return truncate(tidy(lines[0]).replace(/^[\d\s.:|-]+/, ''), 70);
  }

  function splitSentences(text) {
    var flat = tidy(text);
    var out = [];
    /* Split on sentence-ending punctuation without a lookbehind, so the
       code works on engines that do not support lookbehind assertions. */
    flat.split(/([.!?])\s+/).reduce(function (acc, piece, i, arr) {
      if (i % 2 === 0) return acc;
      acc.push((arr[i - 1] + piece).trim());
      return acc;
    }, out);
    if (!out.length) out.push(flat);
    return out.map(tidy).filter(function (s) {
      var w = s.split(/\s+/);
      return s.length >= 28 && s.length <= 240 && w.length >= 5;
    });
  }

  function tokenize(text) {
    return tidy(text).toLowerCase().match(/[a-z][a-z'-]{2,}/g) || [];
  }

  function buildRecap(fileName, pages) {
    /* pages: [{ n, lines, text }] */
    /* Footer noise: identical short lines repeated on many slides. */
    var freq = {};
    pages.forEach(function (p) {
      p.lines.forEach(function (l) {
        var t = tidy(l);
        if (t && t.length < 45) freq[t] = (freq[t] || 0) + 1;
      });
    });
    var pageCount = pages.length || 1;
    var boilerplate = Object.keys(freq).filter(function (t) {
      return freq[t] >= Math.max(3, pageCount * 0.34);
    });

    /* Attribution lines are citations, not content about the subject. */
    var SOURCE_LINE = /^(source|sources|read the originals|reference|references|credit|adapted from|via)\b\s*[:\-–]/i;

    function clean(line) {
      var t = tidy(line);
      if (!t || SOURCE_LINE.test(t)) return false;
      return boilerplate.indexOf(t) === -1 && !isNoise(t) && !isSectionHeader(t);
    }

    var slideTitles = pages.map(function (p) { return p.title; });

    /* Body lines and sentences per slide. "Has text" is judged on body
       lines, not sentences: a slide of short bullets is not empty even
       when none of its lines is a full sentence. */
    var slideLines = pages.map(function (p) {
      return p.lines.filter(clean);
    });

    var slideSentences = slideLines.map(function (lines) {
      return lines.reduce(function (acc, line) {
        return acc.concat(splitSentences(line));
      }, []);
    });

    var allSentences = slideSentences.reduce(function (a, b) { return a.concat(b); }, []);

    /* Same sentences, each tagged with the slide it was read from. */
    var sentencesWithSlide = [];
    slideSentences.forEach(function (sents, idx) {
      sents.forEach(function (s) { sentencesWithSlide.push({ s: s, n: pages[idx].n }); });
    });

    /* Keyword scoring. Titles weigh more than body text, and a term that
       shows up on nearly every slide is less informative than a rarer one,
       so frequency is damped by how widely the term is spread. */
    var scores = {};
    var docFreq = {};
    var pageTotal = Math.max(1, pageCount);

    function tally(text, weight) {
      tokenize(text).forEach(function (w) {
        if (STOPWORDS.indexOf(w) !== -1) return;
        if (GENERIC.indexOf(w) !== -1) return;
        if (w.length < 4) return;
        scores[w] = (scores[w] || 0) + weight;
      });
    }

    pages.forEach(function (p) { tally(p.title, 3); });
    allSentences.forEach(function (s) { tally(s, 1); });

    /* Where each term occurs, so concepts can cite slides. */
    var hits = {};
    Object.keys(scores).forEach(function (w) { hits[w] = []; docFreq[w] = 0; });
    pages.forEach(function (p) {
      var hay = (p.title + ' ' + p.lines.join(' ')).toLowerCase();
      Object.keys(scores).forEach(function (w) {
        if (hay.indexOf(w) !== -1) { hits[w].push(p.n); docFreq[w]++; }
      });
    });

    Object.keys(scores).forEach(function (w) {
      var spread = 1 + Math.log(pageTotal / docFreq[w]);
      scores[w] = scores[w] * spread;
    });

    var ranked = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; });
    var conceptTerms = ranked
      .filter(function (w) { return scores[w] >= 1.5 && docFreq[w] >= 2; })
      .slice(0, 8);

    /* A concept's text must be a real sentence that mentions the term.
       Sentences on slides the term titles are preferred, because that is
       where a deck defines its own vocabulary. */
    var concepts = conceptTerms.map(function (w) {
      var best = null;
      var bestScore = -1;
      var bestN = 0;
      /* sentencesWithSlide keeps the citation attached to each candidate, so
         the summary can name the slide a sentence actually came from. */
      sentencesWithSlide.forEach(function (entry) {
        var s = entry.s;
        var low = s.toLowerCase();
        var at = low.indexOf(w);
        if (at === -1) return;
        var score = 0;
        /* Opens with the term: looks like a definition. */
        if (at <= 2) score += 120;
        if (/^(a|an|the)?\s*[A-Z]/.test(s) && at <= 12) score += 40;
        /* Colon before the term is a label-then-gloss pattern. */
        if (s.slice(0, at).indexOf(':') !== -1) score += 30;
        score += Math.min(s.length, 170);
        if (score > bestScore) { bestScore = score; best = s; bestN = entry.n; }
      });
      var where = (hits[w] || []).slice(0, 4).map(slideBadge);
      return {
        term: titleCase(w),
        text: best ? truncate(best, 200) : '',
        badges: where,
        /* Prefer the slide the quoted sentence lives on; fall back to the
           first slide the term appears on. */
        n: bestN || (hits[w] && hits[w][0]) || 0
      };
    }).filter(function (c) { return c.text; });

    /* Final summary: the strongest sentence for each of the top concepts,
       ordered by the slide it came from. Extractive like everything else,
       so a deck with fewer than eight concepts simply yields fewer lines.
       Several concepts often resolve to the same defining sentence, so
       repeats are dropped: the same line twice helps nobody. */
    var seenFinal = {};
    var conceptWordsForFinal = concepts.map(function (c) {
      return c.term.toLowerCase();
    });
    var final = concepts.slice(0, 10).map(function (c) {
      return {
        text: c.text,
        badges: [slideBadge(c.n)],
        n: c.n
      };
    }).filter(function (l) {
      var key = l.text.toLowerCase();
      if (seenFinal[key]) return false;
      seenFinal[key] = true;
      return true;
    });

    /* Dedupe can leave the list short, so top it up from the strongest
       remaining slide sentences rather than padding with weaker lines. */
    if (final.length < 8) {
      sentencesWithSlide
        .map(function (entry) {
          var score = entry.s.length;
          conceptWordsForFinal.forEach(function (w) {
            if (entry.s.toLowerCase().indexOf(w) !== -1) score += 60;
          });
          return { text: entry.s, n: entry.n, score: score };
        })
        .sort(function (a, b) { return b.score - a.score; })
        .forEach(function (entry) {
          if (final.length >= 8) return;
          var key = entry.text.toLowerCase();
          if (seenFinal[key]) return;
          seenFinal[key] = true;
          final.push({ text: entry.text, badges: [slideBadge(entry.n)], n: entry.n });
        });
    }

    final.sort(function (a, b) { return a.n - b.n; });

    /* Slide cards: title plus the two strongest sentences on that slide. */
    var conceptWords = conceptTerms.slice(0, 12);
    var slides = pages.map(function (p, idx) {
      var rankedSentences = slideSentences[idx]
        .map(function (s) {
          var score = s.length;
          conceptWords.forEach(function (w) {
            if (s.toLowerCase().indexOf(w) !== -1) score += 60;
          });
          return { s: s, score: score };
        })
        .sort(function (a, b) { return b.score - a.score; });
      return {
        n: p.n,
        title: p.title,
        sentences: rankedSentences.slice(0, 2).map(function (r) { return truncate(r.s, 190); }),
        /* Short bullet lines are still content worth showing. */
        body: slideLines[idx].filter(function (l) { return l.length <= 90; })
                    .slice(0, 3).map(function (l) { return truncate(l, 120); })
                    .filter(function (l, i, arr) { return arr.indexOf(l) === i; }),
        badges: [slideBadge(p.n)],
        empty: slideLines[idx].length === 0
      };
    });

    /* Glossary: acronyms and repeated capitalised terms. */
    var termHits = {};
    pages.forEach(function (p, idx) {
      var seen = {};
      slideLines[idx].forEach(function (line) {
        var found = tidy(line).match(/\b(?:[A-Z]{2,6}(?:s)?|[A-Z][a-z]{2,})\b/g) || [];
        found.forEach(function (t) {
          var low = t.toLowerCase();
          if (STOPWORDS.indexOf(low) !== -1 || GENERIC.indexOf(low) !== -1) return;
          if (!termHits[t]) termHits[t] = { first: p.n, count: 0, lines: [], lowercase: 0 };
          if (!seen[t]) {
            seen[t] = true;
            termHits[t].count++;
            termHits[t].lines.push(idx);
          }
        });
      });
      /* Lower-case mentions are the evidence that a capitalised form is a
         recurring technical term rather than sentence case. */
      var lower = tidy(slideLines[idx].join(' ')).toLowerCase();
      Object.keys(termHits).forEach(function (t) {
        if (termHits[t].lines.indexOf(idx) !== -1) return;
        if (lower.indexOf(t.toLowerCase()) !== -1) termHits[t].lowercase++;
      });
    });

    /* Slide furniture and sentence-initial words that happen to be
       capitalised. These repeat across a deck without being terms. */
    var CAP_NOISE = ('what why how when where which who the this that these those time times part parts core recap overview agenda summary intro next up notes note slide page example examples answer answers question questions today tomorrow yesterday first second third new old now then here there also just only more most less least very really quite rather instead still even because after before during between within without across through over under again once every each both few several many some any all none one two three four five six seven eight nine ten make makes made give gives given take takes taken come comes came go goes going want wants need needs see sees seen know knows known think thinks said say says').split(' ');

    function isAcronym(t) { return /^[A-Z]{2,6}$/.test(t); }

    function termIsReal(t) {
      var low = t.toLowerCase();
      if (CAP_NOISE.indexOf(low) !== -1) return false;
      if (STOPWORDS.indexOf(low) !== -1) return false;
      return true;
    }

    function ownsTitle(t) {
      var low = t.toLowerCase();
      return slideTitles.some(function (title) {
        return title.toLowerCase().indexOf(low) !== -1;
      });
    }

    /* A glossary built from slide titles: in a lecture deck the titles ARE
       the topic list, and each one is a phrase the lecturer chose. Terms
       that also recur in running text are listed first. */
    var glossaryCandidates = [];

    Object.keys(termHits).forEach(function (t) {
      if (termHits[t].count < 2 || t.length < 3 || !termIsReal(t)) return;
      if (!isAcronym(t) && !ownsTitle(t) && !termHits[t].lowercase) return;
      glossaryCandidates.push({ term: t, weight: termHits[t].count + (ownsTitle(t) ? 1 : 0), n: termHits[t].first });
    });

    /* Titles that are already short phrases become entries in their own
       right, e.g. "Silent truncation bugs" or "Vector databases". */
    slideTitles.forEach(function (title, idx) {
      var words = tidy(title).split(/\s+/);
      if (words.length > 4 || words.length < 1) return;
      if (/[?]$/.test(title)) return;
      var plain = title.replace(/[^\w\s.-]/g, '').trim();
      if (plain.length < 3) return;
      glossaryCandidates.push({ term: plain, weight: 0.6, n: pages[idx].n });
    });

    var seenTerm = {};
    var glossary = [];
    glossaryCandidates
      .sort(function (a, b) { return b.weight - a.weight; })
      .forEach(function (cand) {
        if (glossary.length >= 18) return;
        var key = cand.term.toLowerCase();
        if (seenTerm[key]) return;

        /* A definition is a sentence that mentions the term. Failing that,
           quote the line it appeared on rather than inventing a gloss. */
        var def = '';
        var at = cand.n;
        for (var i = 0; i < pages.length && !def; i++) {
          var sents = slideSentences[i].filter(function (s) {
            return s.toLowerCase().indexOf(key) !== -1;
          });
          if (sents.length) { def = truncate(sents[0], 170); at = pages[i].n; }
        }
        if (!def) {
          for (var j = 0; j < pages.length && !def; j++) {
            var line = slideLines[j].filter(function (l) {
              return l.toLowerCase().indexOf(key) !== -1;
            })[0];
            if (line) { def = truncate(line, 150); at = pages[j].n; }
          }
        }
        if (!def) return;

        seenTerm[key] = true;
        glossary.push({ term: cand.term, def: def, badges: [slideBadge(at)] });
      });

    var textSlides = slides.filter(function (s) { return !s.empty; }).length;

    return {
      kind: 'upload',
      title: fileName.replace(/\.pdf$/i, ''),
      purpose: allSentences.length
        ? 'The deck has ' + pages.length + ' slides and ' + textSlides + ' of them carry extractable text. Below are the terms that come up most, the sentences that define them, and the slide each one came from.'
        : '',
      meta: pages.length + ' slides · ' + textSlides + ' with text · ' + glossary.length + ' glossary terms',
      concepts: concepts,
      days: [{
        marker: 'DECK',
        title: fileName,
        topics: slides.filter(function (s) { return !s.empty; }).map(function (s) {
          return {
            title: s.title || ('Slide ' + s.n),
            items: s.sentences.map(function (text) {
              return { text: text, badges: [slideBadge(s.n)] };
            })
          };
        })
      }],
      slides: slides,
      glossary: glossary,
      final: final,
      md: ''
    };
  }

  function finalMarkdownLines(lines) {
    return (lines || []).map(function (l) {
      return '- ' + l.text +
        (l.badges.length ? ' ' + l.badges.map(function (b) { return '[' + b + ']'; }).join('') : '');
    }).join('\n');
  }

  function recapToMarkdown(recap) {
    if (recap.kind === 'sample') {
      if (!recap.final || !recap.final.length) return recap.md;
      return recap.md.replace(/\s+$/, '') +
        '\n\n## Final summary\n\n' + finalMarkdownLines(recap.final) + '\n';
    }
    var out = ['# ' + recap.title, '', recap.purpose, '', '## Key concepts', ''];
    recap.concepts.forEach(function (c) {
      out.push('- **' + c.term + '**: ' + c.text + ' (' + c.badges.join(', ') + ')');
    });
    out.push('', '## Slides', '');
    recap.days.forEach(function (day) {
      out.push('### ' + day.title, '');
      day.topics.forEach(function (t) {
        out.push('#### ' + t.title, '');
        t.items.forEach(function (i) {
          out.push('- ' + i.text + ' (' + i.badges.join(', ') + ')');
        });
        out.push('');
      });
    });
    if (recap.glossary.length) {
      out.push('## Glossary', '');
      recap.glossary.forEach(function (g) {
        out.push('- **' + g.term + '**: ' + g.def + ' (' + g.badges.join(', ') + ')');
      });
      out.push('');
    }
    if (recap.final && recap.final.length) {
      out.push('## Final summary', '');
      out.push(finalMarkdownLines(recap.final));
      out.push('');
    }
    out.push('Extractive summary generated in the browser by Course Recap Generator. Every line is text that appeared on a slide.');
    return out.join('\n');
  }

  /* ────────────────────────────────────────────────────────────────────
     6. DIAGRAM BUILDER
     Nodes are slide titles in slide order. Flowchart caps at 12 nodes; if
     there are more topics than that, a mind map carries them all.
     ──────────────────────────────────────────────────────────────────── */

  var FLOW_CAP = 12;

  function sanitizeLabel(text) {
    var words = tidy(text)
      .replace(/["'`“”‘’()[\]{}<>:;,.!?|#*_=+\\/\u2014\u2013]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 4);
    var label = words.join(' ') || 'Topic';
    return label;
  }

  function buildFlowchart(topics) {
    /* Collapse repeats: many decks reuse a running title on several slides,
       and two identical nodes make the chart look broken. */
    var seen = {};
    var unique = [];
    topics.forEach(function (t) {
      var label = sanitizeLabel(t);
      var key = label.toLowerCase();
      if (seen[key]) return;
      seen[key] = true;
      unique.push(label);
    });
    var chosen = unique.slice(0, FLOW_CAP);
    if (!chosen.length) return '';
    var lines = ['flowchart TD'];
    chosen.forEach(function (label, i) {
      lines.push('  N' + i + '[' + label + ']');
    });
    for (var i = 0; i + 1 < chosen.length; i++) {
      lines.push('  N' + i + ' --> N' + (i + 1));
    }
    return lines.join('\n');
  }

  function buildMindmap(rootLabel, topics) {
    var lines = ['mindmap', '  root((' + sanitizeLabel(rootLabel).replace(/[()]/g, '') + '))'];
    topics.forEach(function (t) {
      lines.push('    ' + sanitizeLabel(t).replace(/[()[\]]/g, ''));
    });
    return lines.join('\n');
  }

  /* ────────────────────────────────────────────────────────────────────
     7. SMALL HELPERS
     ──────────────────────────────────────────────────────────────────── */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function badges(list) {
    var frag = document.createDocumentFragment();
    (list || []).forEach(function (b) { frag.appendChild(el('span', 'badge', b)); });
    return frag;
  }

  var toastNode = null;
  var toastTimer = null;
  function toast(message) {
    if (!toastNode) {
      toastNode = el('div', 'toast');
      toastNode.setAttribute('role', 'status');
      document.body.appendChild(toastNode);
    }
    toastNode.textContent = message;
    /* Force a reflow so the transition replays. */
    void toastNode.offsetWidth;
    toastNode.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastNode.classList.remove('is-visible'); }, 2400);
  }

   function copyText(text, okMessage, btn) {
     function legacy() {
       var ta = document.createElement('textarea');
       ta.value = text;
       ta.setAttribute('readonly', '');
       ta.style.position = 'fixed';
       ta.style.left = '-9999px';
       document.body.appendChild(ta);
       ta.select();
       var ok = false;
       try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
       document.body.removeChild(ta);
       if (ok) {
         toast(okMessage);
         if (btn) { var orig = btn.textContent; btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = orig; }, 1500); }
       } else {
         toast('Copy failed');
         if (btn) btn.textContent = 'Copy failed';
       }
     }
 
     if (window.isSecureContext && navigator.clipboard && navigator.clipboard.writeText) {
       navigator.clipboard.writeText(text).then(function () {
         toast(okMessage);
         if (btn) { var orig = btn.textContent; btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = orig; }, 1500); }
       }).catch(function (err) {
         console.error('Clipboard write failed:', err);
         legacy();
       });
     } else {
       legacy();
     }
   }

   function download(filename, text, mime) {
     var blob = new Blob([text], { type: mime });
     var url = URL.createObjectURL(blob);
     var a = document.createElement('a');
     a.href = url;
     a.download = filename;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
     setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
   }

  /* ────────────────────────────────────────────────────────────────────
     8. MERMAID RENDERING
     Re-renders on theme change and falls back to the source with a
     readable message rather than an empty frame.
     ──────────────────────────────────────────────────────────────────── */

  var renderSeq = 0;

  function mermaidConfig() {
    var cs = getComputedStyle(document.documentElement);
    var v = function (n) { return cs.getPropertyValue(n).trim(); };
    var dark = document.documentElement.getAttribute('data-theme') !== 'light';
    return {
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      fontFamily: getComputedStyle(document.body).fontFamily,
      themeVariables: {
        background: v('--glass-strong'),
        primaryColor: dark ? 'rgba(34,211,238,0.10)' : 'rgba(14,116,144,0.10)',
        primaryTextColor: v('--text'),
        primaryBorderColor: v('--accent-from'),
        lineColor: v('--accent-from'),
        secondaryColor: 'rgba(167,139,250,0.12)',
        tertiaryColor: 'rgba(167,139,250,0.12)',
        edgeLabelBackground: v('--bg-mid'),
        fontSize: '15px'
      },
      flowchart: { curve: 'basis', padding: 16, useMaxWidth: true, nodeSpacing: 40, rankSpacing: 46 },
      mindmap: { padding: 12, useMaxWidth: true }
    };
  }

   function renderDiagram(surface, sourceEl, code, label, onSvg) {
     surface.textContent = '';
 
     if (!code) {
       surface.appendChild(el('p', 'empty-note', 'No diagram could be built: no slide titles were detected in this PDF.'));
       if (onSvg) onSvg(null);
       return null;
     }
 
     sourceEl.textContent = code;
 
     if (typeof mermaid === 'undefined') {
       fallback(surface, code, 'Mermaid could not be loaded, so the diagram is shown as source instead.');
       if (onSvg) onSvg(null);
       return null;
     }
 
     var host = el('div', 'diagram-host');
     surface.appendChild(host);
 
     try {
       mermaid.initialize(mermaidConfig());
       var id = 'crg-diagram-' + (renderSeq++);
       var maybe = mermaid.render(id, code);
 
       return Promise.resolve(maybe).then(function (result) {
         var svg = typeof result === 'string' ? result : (result && result.svg);
         if (!svg) throw new Error('no svg');
         host.innerHTML = svg;
         if (onSvg) onSvg(svg);
         return svg;
         /* Mermaid throws on stderr-free syntax errors via a rejected
            promise; a thrown string can also arrive as the argument. */
       }).catch(function (err) {
         surface.textContent = '';
         fallback(surface, code,
           'The ' + label + ' could not be drawn from this deck. The Mermaid source is below, so nothing is lost.');
         if (onSvg) onSvg(null);
         return null;
       });
     } catch (err) {
       surface.textContent = '';
       fallback(surface, code, 'The ' + label + ' could not be drawn from this deck. The Mermaid source is below.');
       if (onSvg) onSvg(null);
       return null;
     }
   }

  function fallback(surface, code, message) {
    var wrap = el('div', 'diagram-fallback');
    wrap.appendChild(el('p', null, message));
    var pre = el('pre', 'mono source-block', code);
    wrap.appendChild(pre);
    surface.appendChild(wrap);
  }

  /* ────────────────────────────────────────────────────────────────────
     9. RENDERERS
     ──────────────────────────────────────────────────────────────────── */

  function renderSummaryPanel(panel, recap) {
    panel.textContent = '';

    var intro = el('p', 'provenance');
    intro.appendChild(el('strong', null,
      recap.kind === 'sample' ? 'Slide-grounded sample recap. ' : 'Extractive summary generated in your browser. '));
    intro.appendChild(document.createTextNode(
      recap.kind === 'sample'
        ? 'Every line below is text taken from the Day 3 deck, with the slide it came from.'
        : 'Every line below is a sentence copied off a slide. Nothing was written for you.'));
    panel.appendChild(intro);

    if (recap.purpose) {
      var purpose = el('p', 'deck-meta', recap.purpose);
      purpose.style.marginBottom = '1.5rem';
      panel.appendChild(purpose);
    }

    if (recap.concepts.length) {
      panel.appendChild(sectionLabel('Key concepts', recap.concepts.length + ' found by term frequency, weighted toward slide titles'));
      var grid = el('div', 'card-grid');
      recap.concepts.forEach(function (c) {
        var card = el('div', 'card');
        card.appendChild(el('h3', null, c.term));
        card.appendChild(el('p', null, c.text));
        card.appendChild(badges(c.badges));
        grid.appendChild(card);
      });
      panel.appendChild(grid);
    } else {
      panel.appendChild(el('p', 'empty-note', 'No repeated terms stood out in this deck, so no key concepts were extracted.'));
    }

    recap.days.forEach(function (day) {
      var block = el('div', 'day-block');
      block.appendChild(el('p', 'day-marker', day.marker));
      block.appendChild(el('h3', null, day.title));

      day.topics.forEach(function (topic) {
        if (!topic.items.length) return;
        var group = el('div', 'topic-group');
        group.appendChild(el('h3', null, topic.title));
        var ul = el('ul', 'claim-list');
        topic.items.forEach(function (item) {
          var li = el('li');
          li.appendChild(el('span', 'claim', item.text));
          li.appendChild(badges(item.badges));
          ul.appendChild(li);
        });
        group.appendChild(ul);
        block.appendChild(group);
      });

      panel.appendChild(block);
    });
  }

  /* ────────────────────────────────────────────────────────────────────
     9b. FINAL SUMMARY CARD
     A last look at the deck in eight to ten lines, one sentence each, with
     the slide it came from. Rendered after the tabs, at the end of results.
     ──────────────────────────────────────────────────────────────────── */

  function renderFinalSummary(host, recap) {
    if (!host) return;
    host.textContent = '';
    if (!recap || !recap.final || !recap.final.length) {
      host.hidden = true;
      return;
    }
    host.hidden = false;

    host.appendChild(el('h3', null, 'Final summary'));
    host.appendChild(el('p', 'deck-meta',
      recap.kind === 'sample'
        ? 'The Day 3 deck in ' + recap.final.length + ' lines, each one cited to its slide.'
        : recap.final.length + ' line' + (recap.final.length === 1 ? '' : 's') +
          ' — the strongest sentence for each top key concept, in slide order.'));

    var ol = el('ol');
    recap.final.forEach(function (l) {
      var li = el('li');
      li.appendChild(document.createTextNode(l.text + ' '));
      (l.badges || []).forEach(function (b) {
        li.appendChild(el('span', 'slide-cite', '[' + b + ']'));
      });
      ol.appendChild(li);
    });
    host.appendChild(ol);
  }

  function sectionLabel(text, hint) {
    var wrap = el('div', 'topic-group');
    wrap.appendChild(el('h3', null, text));
    if (hint) {
      var h = el('p', 'deck-meta', hint);
      h.style.marginTop = '-0.4rem';
      h.style.marginBottom = '0.75rem';
      wrap.appendChild(h);
    }
    return wrap;
  }

  function renderSlidesPanel(panel, recap) {
    panel.textContent = '';

    if (recap.kind === 'sample') {
      panel.appendChild(el('p', 'deck-meta',
        'Every cited line in the deck, grouped by day and topic. Badges show the slide each line came from.'));
      panel.appendChild(el('div', null, ''));
    }

    if (!recap.slides.length) {
      panel.appendChild(el('p', 'empty-note',
        'No per-slide detail for the sample recap. Use the Summary tab for the cited lines.'));
      return;
    }

    var unread = recap.slides.filter(function (s) { return s.empty; }).length;
    if (unread) {
      panel.appendChild(el('p', 'empty-note',
        unread + ' of ' + recap.slides.length + ' slides had no extractable text (likely images) and are not listed below.'));
    }

    var grid = el('div', 'card-grid');
    recap.slides.forEach(function (s) {
      if (s.empty) return;
      var card = el('div', 'card');
      card.appendChild(el('h3', null, s.title || ('Slide ' + s.n)));
      if (s.sentences.length) {
        var ul = el('ul', 'claim-list');
        ul.style.marginTop = '0.5rem';
        s.sentences.forEach(function (text) {
          var li = el('li');
          li.appendChild(el('span', 'claim', text));
          ul.appendChild(li);
        });
        card.appendChild(ul);
      } else {
        card.appendChild(el('p', null, 'No full sentences were extracted from this slide.'));
      }
      card.appendChild(badges(s.badges));
      grid.appendChild(card);
    });
    panel.appendChild(grid);
  }

  function renderGlossaryPanel(panel, recap) {
    panel.textContent = '';
    if (!recap.glossary.length) {
      panel.appendChild(el('p', 'empty-note', 'No terms repeated often enough to be worth defining.'));
      return;
    }
    var dl = el('dl', 'glossary');
    recap.glossary.forEach(function (g) {
      var wrap = el('div', 'term');
      var dt = el('dt');
      dt.appendChild(document.createTextNode(g.term));
      dt.appendChild(badges(g.badges));
      var dd = el('dd', null, g.def);
      wrap.appendChild(dt);
      wrap.appendChild(dd);
      dl.appendChild(wrap);
    });
    panel.appendChild(dl);
  }

  /* ────────────────────────────────────────────────────────────────────
     10. TABS
     ──────────────────────────────────────────────────────────────────── */

  function initTabs(tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));

    function select(index, focus) {
      tabs.forEach(function (tab, i) {
        var panel = document.getElementById(tab.getAttribute('aria-controls'));
        var on = i === index;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.setAttribute('tabindex', on ? '0' : '-1');
        if (panel) panel.hidden = !on;
        if (on && focus) tab.focus();
      });
    }

    tablist.addEventListener('click', function (event) {
      var tab = event.target.closest('[role="tab"]');
      if (!tab) return;
      select(tabs.indexOf(tab), false);
    });

    tablist.addEventListener('keydown', function (event) {
      var current = tabs.indexOf(document.activeElement);
      if (current === -1) return;
      var next = null;
      if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      select(next, true);
    });

    return { select: select };
  }

  /* ────────────────────────────────────────────────────────────────────
     11. A RECAP VIEW: wires panels, diagram and export buttons together
     ──────────────────────────────────────────────────────────────────── */

  function createView(config) {
     var view = {
       recap: null,
       style: 'flowchart',
       surface: config.surface,
       sourceEl: config.sourceEl,
       final: config.final,
       tabs: initTabs(config.tablist),
       rootLabel: config.rootLabel || 'Recap',
       headings: config.headings || [],
       _svgString: ''
     };

    function topicsForStyle(style) {
      if (view.recap.kind === 'sample') {
        /* Real headings from the embedded summary: days, then topics. */
        if (style === 'flowchart') {
          return view.headings.flow;
        }
        return view.headings.map;
      }
      var titles = (view.recap.slides || [])
        .filter(function (s) { return !s.empty && s.title; })
        .map(function (s) { return s.title; });
      /* A deck whose slides repeat one running title gives a one-node chart;
         fall back to the key concepts, which are real extracted terms. */
      var distinct = {};
      titles.forEach(function (t) { distinct[t.toLowerCase()] = true; });
      if (Object.keys(distinct).length < 3) {
        return view.recap.concepts.map(function (c) { return c.term; });
      }
      return titles;
    }

    function currentCode() {
      var topics = topicsForStyle(view.style);
      if (!topics || !topics.length) return '';
      if (view.style === 'mindmap') return buildMindmap(view.rootLabel, topics);
      /* Too many topics for a readable flowchart: fall back to a map. */
      if (topics.length > FLOW_CAP) return buildMindmap(view.rootLabel, topics);
      return buildFlowchart(topics);
    }

     view.drawDiagram = function () {
       var code = currentCode();
       view._svgString = null;
       renderDiagram(view.surface, view.sourceEl, code, view.style === 'mindmap' ? 'mind map' : 'flowchart', function (svg) {
         view._svgString = svg;
         updateExportState(view);
       });
     };

    view.setStyle = function (style) {
      view.style = style;
      view.drawDiagram();
    };

    view.currentCode = currentCode;

    view.render = function (recap) {
      view.recap = recap;
      renderSummaryPanel(config.summary, recap);
      renderSlidesPanel(config.slides, recap);
      renderGlossaryPanel(config.glossary, recap);
      renderFinalSummary(config.final, recap);
      if (config.deckTitle) config.deckTitle.textContent = recap.title;
      if (config.deckMeta) config.deckMeta.textContent = recap.meta;
      view.drawDiagram();
    };

    view.svg = function () {
      return view.surface.querySelector('svg');
    };

    return view;
  }

  /* ────────────────────────────────────────────────────────────────────
     12. THEME
     ──────────────────────────────────────────────────────────────────── */

  var themeToggle = document.getElementById('theme-toggle');
  var themeLabel = themeToggle ? themeToggle.querySelector('.theme-toggle-label') : null;
  var activeViews = [];

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function paintThemeToggle() {
    if (!themeToggle) return;
    var next = currentTheme() === 'light' ? 'Dark' : 'Light';
    if (themeLabel) themeLabel.textContent = next;
    themeToggle.setAttribute('aria-label', 'Switch to ' + next.toLowerCase() + ' theme');
  }

  paintThemeToggle();

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = currentTheme() === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('crg-theme', next); } catch (e) {}
      paintThemeToggle();
      activeViews.forEach(function (v) { v.drawDiagram(); });
    });
  }

  /* ────────────────────────────────────────────────────────────────────
     13. UPLOAD FLOW
     ──────────────────────────────────────────────────────────────────── */

  var MAX_BYTES = 40 * 1024 * 1024;

  var dropzone = document.getElementById('dropzone');
  var fileInput = document.getElementById('file-input');
  var browseBtn = document.getElementById('browse-btn');
  var progress = document.getElementById('progress');
  var progressFill = document.getElementById('progress-fill');
  var progressPct = document.getElementById('progress-pct');
  var progressLabel = document.getElementById('progress-label');
  var errorBox = document.getElementById('drop-error');
  var errorText = document.getElementById('drop-error-text');
  var resultsSection = document.getElementById('results');
  var resultsNav = document.querySelector('[data-nav="results"]');

  function setProgress(pct, label) {
    progress.hidden = false;
    var value = Math.max(0, Math.min(100, Math.round(pct)));
    progressFill.style.width = value + '%';
    progressPct.textContent = value + '%';
    if (label) progressLabel.textContent = label;
  }

  function clearError() {
    errorBox.hidden = true;
    errorText.textContent = '';
  }

  function showError(message) {
    errorText.textContent = message;
    errorBox.hidden = false;
  }

  function setBusy(busy) {
    dropzone.classList.toggle('is-busy', busy);
    var inner = dropzone.querySelector('.dropzone-inner');
    if (inner) inner.style.opacity = busy ? '0.55' : '';
  }

  try {
    if (browseBtn && fileInput) {
      browseBtn.addEventListener('click', function () { fileInput.click(); });
    }

    if (dropzone) {
      ['dragenter', 'dragover'].forEach(function (type) {
        dropzone.addEventListener(type, function (event) {
          event.preventDefault();
          dropzone.classList.add('is-over');
        });
      });
      ['dragleave', 'drop'].forEach(function (type) {
        dropzone.addEventListener(type, function (event) {
          event.preventDefault();
          if (type === 'dragleave' && dropzone.contains(event.relatedTarget)) return;
          dropzone.classList.remove('is-over');
        });
      });
      dropzone.addEventListener('drop', function (event) {
        var file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
        if (file) handleFile(file);
      });
      /* Dropping anywhere else should not make the browser navigate. */
      window.addEventListener('dragover', function (e) { e.preventDefault(); });
      window.addEventListener('drop', function (e) { e.preventDefault(); });
    }

    if (fileInput) {
      fileInput.addEventListener('change', function () {
        if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
      });
    }
  } catch (err) {
    console.error('Upload setup failed:', err);
  }

  function validate(file) {
    var looksPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    if (!looksPdf) {
      return 'That file is not a PDF. Choose a PDF of your slides and try again.';
    }
    if (file.size > MAX_BYTES) {
      return 'That PDF is ' + (file.size / 1048576).toFixed(1) + ' MB. The limit is 40 MB.';
    }
    if (file.size === 0) {
      return 'That file is empty, so there is nothing to read.';
    }
    return null;
  }

  function looksLikePdf(bytes) {
    var head = '';
    for (var i = 0; i < 5 && i < bytes.length; i++) head += String.fromCharCode(bytes[i]);
    return head === '%PDF-';
  }

   function handleFile(file) {
     clearError();
     var problem = validate(file);
     if (problem) { showError(problem); return; }

     setBusy(true);
     setProgress(2, 'Checking the file…');

     file.arrayBuffer().then(function (buffer) {
       var data = new Uint8Array(buffer);
       if (!looksLikePdf(data)) {
         setBusy(false);
         showError('That file does not start like a PDF, so it cannot be opened as one.');
         return;
       }
       setProgress(6, 'Opening ' + file.name + '…');
       return extractFromBuffer(data);
     }).then(function (result) {
       setBusy(false);
       var pages = result.pages;
       var noTextCount = result.noTextCount;
       if (!pages.length) {
         showError('This PDF has no pages, so there is nothing to recap.');
         return;
       }
       var withText = pages.filter(function (p) { return p.lines.length > 0; }).length;
       if (!withText) {
         showError('No text was found in this PDF. It looks like a scanned deck or one made of images, and this tool reads text only.');
         return;
       }
       setProgress(100, 'Read ' + pages.length + ' slides');
       renderUploaded(file.name, pages, withText, noTextCount);
     }).catch(function (err) {
       setBusy(false);
       var msg = (err && err.message) ? err.message : 'The PDF could not be opened.';
       if (err && err.name === 'PasswordException') {
         showError(msg + ' If it is password-protected, remove the password and try again.');
       } else {
         showError(msg);
       }
       console.error(err);
     });
   }

   function extractFromBuffer(data) {
     if (typeof pdfjsLib === 'undefined') {
       return Promise.reject(new Error('pdf.js did not load. Check your connection and reload the page.'));
     }
     pdfjsLib.GlobalWorkerOptions.workerSrc =
       'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

     var doc = pdfjsLib.getDocument({ data: data });

     return doc.promise.then(function (pdf) {
       var total = pdf.numPages;
       console.log('numPages:', total);
       var pages = [];
       var noTextCount = 0;
       var chain = Promise.resolve();

       for (var i = 0; i < total; i++) {
         (function (pn) {
           chain = chain.then(function () {
             return pdf.getPage(pn).then(function (page) {
               return page.getTextContent().then(function (content) {
                 var lines = linesFromTextContent(content);
                 pages.push({ n: pn, lines: lines, title: pickSlideTitle(lines), text: lines.join('\n') });
                 if (!lines.length) noTextCount++;
                 console.log('Page ' + pn + ' text length:', lines.join('\n').length);
                 setProgress(6 + (pn / total) * 88,
                   'Reading slide ' + pn + ' of ' + total);
               }).catch(function (err) {
                 console.error('Page ' + pn + ' text error:', err);
                 noTextCount++;
                 setProgress(6 + (pn / total) * 88,
                   'Reading slide ' + pn + ' of ' + total);
               });
             }).catch(function (err) {
               console.error('Page ' + pn + ' error:', err);
               noTextCount++;
               setProgress(6 + (pn / total) * 88,
                 'Reading slide ' + pn + ' of ' + total);
             });
           });
         })(i + 1);
       }

       return chain.then(function () {
         try { doc.destroy(); } catch (e) {}
         return { pages: pages, noTextCount: noTextCount };
       });
     });
   }

  /* Group text items into visual lines using their vertical position, and
     keep the font size so the biggest line on a slide can be taken as the
     title. */
  function linesFromTextContent(content) {
    var rows = [];
    var items = content.items || [];

    items.forEach(function (item) {
      if (!item.str) return;
      var y = item.transform ? Math.round(item.transform[5]) : 0;
      var size = item.height || (item.transform ? Math.abs(item.transform[3]) : 10);
      var row = null;
      for (var i = 0; i < rows.length; i++) {
        if (Math.abs(rows[i].y - y) <= 2) { row = rows[i]; break; }
      }
      if (!row) {
        row = { y: y, parts: [], size: size };
        rows.push(row);
      }
      row.parts.push({ str: item.str, size: size });
    });

    return rows
      .sort(function (a, b) { return b.y - a.y; })
      .map(function (row) {
        /* pdf.js keeps spaces inside item.str, so joining with a single
           space and letting normalizeText collapse them is enough. Do not
           try to guess missing spaces: it corrupts real words. */
        var text = row.parts.map(function (p) { return p.str; }).join(' ').trim();
        if (!text) return '';
        return normalizeText(text);
      })
      .filter(function (l) { return l.length > 0; });
  }

function renderUploaded(fileName, pages, withText, noTextCount) {
      var recap = buildRecap(fileName, pages);
      recap.meta = pages.length + ' slides · ' + withText + ' with text · ' +
        (noTextCount ? noTextCount + ' image-only · ' : '') +
        recap.concepts.length + ' key concepts';
      recap.md = recapToMarkdown(recap);

      uploadView.render(recap);
      resultsSection.hidden = false;
      if (resultsNav) resultsNav.hidden = false;

      var sampleSection = document.getElementById('sample');
      if (sampleSection) sampleSection.hidden = true;

      var fileLabel = document.getElementById('results-file-label');
      if (fileLabel) {
        fileLabel.textContent = 'Results for ' + fileName;
        fileLabel.hidden = false;
      }

      var backBtn = document.getElementById('back-to-sample');
      if (backBtn) backBtn.hidden = false;

      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      toast('Recap ready: ' + withText + ' slides read');
      updateExportState(uploadView);
      updateExportState(sampleView);
    }

    function showSample() {
      var sampleSection = document.getElementById('sample');
      if (sampleSection) sampleSection.hidden = false;

      resultsSection.hidden = true;
      if (resultsNav) resultsNav.hidden = true;

      var fileLabel = document.getElementById('results-file-label');
      if (fileLabel) fileLabel.hidden = true;

      var backBtn = document.getElementById('back-to-sample');
      if (backBtn) backBtn.hidden = true;

      var fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';

      clearError();
      progress.hidden = true;
      progressFill.style.width = '0%';

      uploadView.recap = null;
      uploadView.surface.textContent = '';
      uploadView.sourceEl.textContent = '';
      uploadView._svgString = '';
      uploadView.final.textContent = '';
      uploadView.final.hidden = true;

      sampleView.tabs.select(0);
      uploadView.tabs.select(0);

      sampleView.drawDiagram();

      document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
      updateExportState(sampleView);
      updateExportState(uploadView);
    }

  /* ────────────────────────────────────────────────────────────────────
     14. WIRE UP
     ──────────────────────────────────────────────────────────────────── */

  var sampleView = createView({
    tablist: document.querySelector('#sample .tablist'),
    summary: document.getElementById('spanel-summary'),
    slides: document.getElementById('spanel-slides'),
    glossary: document.getElementById('spanel-glossary'),
    surface: document.getElementById('sample-diagram-surface'),
    sourceEl: document.getElementById('sample-mermaid-source'),
    final: document.getElementById('sample-final-summary'),
    deckTitle: document.querySelector('#sample h2'),
    deckMeta: document.getElementById('sample-meta'),
    rootLabel: 'Applied AI Track'
  });

  var uploadView = createView({
    tablist: document.querySelector('#results .tablist'),
    summary: document.getElementById('panel-summary'),
    slides: document.getElementById('panel-slides'),
    glossary: document.getElementById('panel-glossary'),
    surface: document.getElementById('diagram-surface'),
    sourceEl: document.getElementById('mermaid-source'),
    final: document.getElementById('final-summary'),
    deckTitle: document.getElementById('deck-title'),
    deckMeta: document.getElementById('deck-meta'),
    rootLabel: 'Your deck'
  });

  activeViews = [sampleView, uploadView];

  /* Flow / mind-map toggles for both diagrams. */
  [['#sample .seg', sampleView], ['#results .seg', uploadView]].forEach(function (pair) {
    var container = document.querySelector(pair[0]);
    var view = pair[1];
    if (!container) return;
    container.addEventListener('click', function (event) {
      var btn = event.target.closest('.seg-btn');
      if (!btn) return;
      Array.prototype.forEach.call(container.querySelectorAll('.seg-btn'), function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      view.setStyle(btn.getAttribute('data-style'));
    });
  });

   function updateExportState(view) {
     var hasSummary = !!(view.recap && recapToMarkdown(view.recap));
     var hasDiagram = !!view.currentCode();
     var hasSvg = !!view._svgString;
     var ids = [
       view === sampleView ? 'sample-copy' : 'copy-summary',
       view === sampleView ? 'sample-download' : 'download-md',
       view === sampleView ? 'sample-copy-mermaid' : 'copy-mermaid',
       view === sampleView ? 'sample-download-svg' : 'download-svg',
       view === sampleView ? 'sample-download-mmd' : 'download-mmd'
     ];
     ids.forEach(function (id) {
       var btn = document.getElementById(id);
       if (!btn) return;
       if (id === (view === sampleView ? 'sample-download-svg' : 'download-svg')) {
         btn.disabled = !hasSvg;
       } else if (id === (view === sampleView ? 'sample-download-mmd' : 'download-mmd')) {
         btn.disabled = !hasDiagram;
       } else {
         btn.disabled = !(hasSummary || hasDiagram);
       }
     });
   }
 
   function wireExport(btnId, view, getText) {
     var btn = document.getElementById(btnId);
     if (!btn) { console.error('Button not found: ' + btnId); return; }
     btn.addEventListener('click', function () {
       if (!view.recap) { toast('Nothing to export yet'); return; }
       var text = getText(view.recap);
       if (!text) { toast('Nothing to export yet'); return; }
       copyText(text, 'Summary copied', btn);
     });
   }
 
   function wireDownloadBtn(btnId, view, getText, filename, mime) {
     var btn = document.getElementById(btnId);
     if (!btn) { console.error('Button not found: ' + btnId); return; }
     btn.addEventListener('click', function () {
       if (!view.recap) { toast('Nothing to export yet'); return; }
       var text = getText(view.recap);
       if (!text) { toast('Nothing to export yet'); return; }
       download(filename, text, mime);
       toast('Downloaded');
     });
   }
 
   function wireDiagramExport(copyId, svgId, mmdId, view) {
     var copyBtn = document.getElementById(copyId);
     var svgBtn = document.getElementById(svgId);
     var mmdBtn = document.getElementById(mmdId);
 
     if (copyBtn) copyBtn.addEventListener('click', function () {
       var code = view.currentCode();
       if (!code) { toast('Nothing to export yet'); return; }
       copyText(code, 'Mermaid code copied', copyBtn);
     });
 
     if (svgBtn) svgBtn.addEventListener('click', function () {
       if (!view._svgString) { toast('Nothing to export yet'); return; }
       download('diagram.svg', view._svgString, 'image/svg+xml');
       toast('SVG downloaded');
     });
 
     if (mmdBtn) mmdBtn.addEventListener('click', function () {
       var code = view.currentCode();
       if (!code) { toast('Nothing to export yet'); return; }
       download('diagram.mmd', code, 'text/markdown');
       toast('Mermaid source downloaded');
     });
   }
 
   function safeName(str) {
     return String(str || 'recap').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'recap';
   }
 
   /* Export buttons — summary */
   wireExport('sample-copy', sampleView, recapToMarkdown);
   wireExport('copy-summary', uploadView, recapToMarkdown);
   wireDownloadBtn('sample-download', sampleView, recapToMarkdown, 'summary.md', 'text/markdown');
   wireDownloadBtn('download-md', uploadView, recapToMarkdown, 'summary.md', 'text/markdown');
 
   /* Export buttons — diagram */
   wireDiagramExport('sample-copy-mermaid', 'sample-download-svg', 'sample-download-mmd', sampleView);
   wireDiagramExport('copy-mermaid', 'download-svg', 'download-mmd', uploadView);
 
/* Reset. */
    var resetBtn = document.getElementById('reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', showSample);
    }

    /* Back to sample. */
    var backBtn = document.getElementById('back-to-sample');
    if (backBtn) {
      backBtn.addEventListener('click', showSample);
    }
 
   /* ── Sample recap ─────────────────────────────────────────────────── */
 
   try {
     var sampleRecap = parseSampleMarkdown(SAMPLE_MD);
 
     sampleView.headings = {
       flow: ['Tool Landscape', 'Agent Harness', 'Harness Capabilities', 'Best Practices'],
       map: []
     };
     sampleRecap.days.forEach(function (day) {
       sampleView.headings.map.push(day.marker.charAt(0) + day.marker.slice(1).toLowerCase() + ' topics');
       day.topics.forEach(function (t) {
         sampleView.headings.map.push(sanitizeLabel(t.title));
       });
     });
 
     sampleView.render(sampleRecap);
     updateExportState(sampleView);
   } catch (err) {
     console.error('Sample rendering failed:', err);
   }
 
   function wireAll() {
     updateExportState(sampleView);
     updateExportState(uploadView);
   }
 
   if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', wireAll);
   } else {
     wireAll();
   }
 
    activeViews = [sampleView, uploadView];
})();