# Applied AI Track: From LLM Foundations to Production Inference

Four days that move from the mechanics of how models read text, through how to talk to them and build agent tools with them, to what happens inside an inference server once a request is sent.

## Key concepts

- **Tokens and tokenizers**: Models read tokens, not text; tokenization exists so one finite vocabulary can cover endless text. (Day 1, Slide 3)
- **Context window**: A fixed-size input buffer, not memory, which is why long chats forget. (Day 1, Slide 15)
- **Sampling controls**: Temperature changes randomness for the same prompt; top-p and top-k decide which tokens are even allowed next. (Day 1, Slides 18 and 19)
- **Prompt structure**: A good prompt has four parts, every time, and structure matters because models don't infer intent from tone. (Day 2, Slide 3)
- **Few-shot prompting**: One example shows what "done" looks like; more examples bring more stability. (Day 2, Slide 12)
- **Prompt injection**: User input hijacks the instructions, so structure is also a defense. (Day 2, Slide 19)
- **Agent harness loop**: Not a smarter chatbot but a model wired into a loop: perceive, decide, act, observe, repeat. (Day 3, Slide 7)
- **TTFT and TPOT**: TTFT = queueing + prefill; TPOT = decode time per token; total latency is roughly TTFT + (output tokens - 1) x TPOT. (Day 4, Slide 14)

## Day 1 — LLM Foundations: Tokens · Context · Inference

### Tokens and tokenizers
- Models read tokens, not text. (Day 1, Slide 3)
- Tokenization exists to give one finite vocabulary, endless text. (Day 1, Slide 4)
- BPE, Byte-Pair Encoding: merge the most frequent pair. Repeat. (Day 1, Slide 5)
- WordPiece: greedy longest match, with ## marking a continuation. (Day 1, Slide 6)
- SentencePiece works on raw text, and a space is just a symbol. (Day 1, Slide 7)
- tiktoken is OpenAI's fast byte-level BPE. (Day 1, Slide 8)

### Model size, types and meaning
- Parameters equal model size: billions of tunable numbers. (Day 1, Slide 9)
- Dense vs. MoE: Mixture of Experts means only some experts run per token. (Day 1, Slide 10)
- Reasoning models think in tokens before they answer. (Day 1, Slide 11)
- Types of models: pick the right kind for the job. (Day 1, Slide 12)
- Embeddings are meaning, turned into numbers; vector databases search by meaning, not by keywords. (Day 1, Slides 13 and 14)

### Context and generation behavior
- The context window is a fixed-size input buffer, not memory. (Day 1, Slide 15)
- Long chats forget because of the window. (Day 1, Slide 16)
- Lost in the middle: attention isn't even inside the window. (Day 1, Slide 17)
- Temperature gives the same prompt, different randomness. (Day 1, Slide 18)
- Top-p and top-k decide which tokens are even allowed next. (Day 1, Slide 19)
- Hallucination is confident, plausible, wrong. (Day 1, Slide 20)

### Token economics and latency vocabulary
- Prompt vs. training data: what it knows vs. what you told it. (Day 1, Slide 21)
- Token economics: billed per token, and input and output differ. (Day 1, Slide 22)
- Input, output, cached: what each kind of token costs. (Day 1, Slide 23)
- Prompt caching: repeated prefixes get cheaper. (Day 1, Slide 24)
- Token budgeting: everything competes for one window. (Day 1, Slide 25)
- Silent truncation bugs: naive truncation drops the oldest first. (Day 1, Slide 26)
- Prompts cost time too, not just correctness and cost. (Day 1, Slide 27)
- TTFT is time to first token. (Day 1, Slide 28)
- TPOT is time per output token. (Day 1, Slide 29)
- Latency vs. throughput is start fast vs. serve many. (Day 1, Slide 30)
- Streaming: why text appears word by word. (Day 1, Slide 31)

## Day 2 — Prompt Engineering: How to talk to a model so it listens

### Prompt structure and delimiters
- A good prompt has four parts. Every time. (Day 2, Slide 3)
- Structure matters because models don't infer intent from tone. (Day 2, Slide 4)
- The wall-of-text problem: where does the task end and the data begin? (Day 2, Slide 5)
- XML sandwiching: tag every section and let the model see the seams. (Day 2, Slide 6)
- Structure works because models have read a lot of markup; the principle beats the syntax, whether you use tags, fenced blocks, or a line below. (Day 2, Slide 7)

### Zero-shot to few-shot
- Zero-shot is just the instruction, no examples. (Day 2, Slide 11)
- One-shot: one example shows what "done" looks like, demonstrated on converting dates to a numeric format. (Day 2, Slides 12 and 13)
- Few-shot: more examples, more stability. (Day 2, Slide 13)

### Failure patterns
- Ambiguous instructions: the model fills the gaps with assumptions. (Day 2, Slide 14)
- Conflicting constraints must be compatible, not just individually reasonable. (Day 2, Slide 15)
- Format drift starts on-format and ends off-format. (Day 2, Slide 16)
- The model argues with itself; contradictions creep into long chains. (Day 2, Slide 17)
- Prompts fail in predictable ways, so in production you defend them. (Day 2, Slide 18)

### Production concerns
- Prompt injection: user input hijacks the instructions. (Day 2, Slide 19)
- Why it matters more soon: from wrong words to wrong actions. (Day 2, Slide 21)
- One defense: structured input, a first layer and not a complete solution. (Day 2, Slide 22)
- Prompts are code: version them, with a mock version history. (Day 2, Slides 23 and 24)
- Testing prompts: you can't eyeball every input. (Day 2, Slide 25)
- A small eval set: run it before you ship a change. (Day 2, Slide 26)

## Day 3 — AI Coding Techniques: From understanding LLMs to building with them

### The tool landscape
- Four tools, one defining trait each, compared by strength and typical use. (Day 3, Slide 3)
- The choice is one tool for execution, not all four. (Day 3, Slide 5)

### The agent harness
- It isn't just a smarter chatbot; it's a model wired into a loop. (Day 3, Slide 6)
- The loop is: perceive, decide, act, observe. Repeat. (Day 3, Slide 7)
- What this extends: the environment joins the conversation. (Day 3, Slide 8)
- Model plus harness equals agent: the model proposes, the harness does. (Day 3, Slide 9)
- A harness is everything around the model; four tools share one pattern, same architecture, different surface, and the tool ships one that you extend. (Day 3, Slide 10)

### Harness capabilities
- Agentic file editing: it reads and edits real files, not just answers. (Day 3, Slide 13)
- Plan mode: it proposes a plan before it acts. (Day 3, Slide 14)
- Self-correcting on errors: it runs the code, sees errors, fixes them. (Day 3, Slide 15)
- Skills: teach it once, reuse it every time. (Day 3, Slide 16)
- MCP lets the agent reach outside the codebase, through host, client, and server. (Day 3, Slide 17)
- Sub-agents: it delegates a sub-task to another agent. (Day 3, Slide 19)

### Best practices
- The best-practice checklist is not blind trust: know exactly where to look. (Day 3, Slide 20)
- Recap: seven ideas, each with a place to pause. (Day 3, Slide 21)

## Day 4 — Inference Basics: What happens between "send" and "response"

### Definitions and the pipeline
- Day 1 gave the vocabulary; today each word is measured by which stage of a request it belongs to. (Day 4, Slide 2)
- Four ideas decide real-world speed: batching, concurrency, queueing, and cold starts. (Day 4, Slide 5)
- Every request passes the same six stages: it arrives, may wait in a queue, has its prompt processed (prefill), generates tokens one by one (decode), shares the GPU with others (batching), and streams back. (Day 4, Slide 6)
- The tokenizer from Day 1 cuts your text into tokens; from here on, everything the model sees is a sequence of token IDs, not words. (Day 4, Slide 7)
- Queueing time is part of TTFT, and under heavy load it often dominates it. (Day 4, Slide 8)
- Prefill reads the entire prompt in one pass, so a longer prompt means a higher TTFT. (Day 4, Slide 9)
- Decode produces tokens one at a time, and the gap between two consecutive tokens is TPOT. (Day 4, Slide 10)

### Inside the engine
- The KV cache stores each token's keys and values once and reuses them, instead of recomputing the whole sequence every step. (Day 4, Slide 11)
- The memory bill is about 0.8 MB per token for a 13B model; it competes with the weights and sets how many requests fit at once. (Day 4, Slide 12)
- Static batching waits for the slowest request; continuous (iteration-level) batching refills a freed slot at the very next step. (Day 4, Slide 15)
- Each step the scheduler decides who joins the batch; a long prompt can hog a step and stall everyone else's. (Day 4, Slide 16)

### Cost-latency trade-offs and failures at scale
- Bigger is not always better: larger models are stronger but slower and pricier per token. (Day 4, Slide 17)
- Picking a model is a trade-off, not a ranking: how long can this task wait, and how wrong can it afford? (Day 4, Slide 18)
- Instead of one model for everything, a router picks the model per request. (Day 4, Slide 19)
- Tokenizer failures at scale: Reddit usernames became pathological tokens in GPT-2/3's tokenizer, and GPT-4o's 200k-token tokenizer was found polluted by spam. (Day 4, Slides 21 and 22)
- The misrouted requests: Anthropic's 2025 postmortem, a routing bug that sent short-context requests to servers set up for the 1M-token context window, 16% of Sonnet 4 requests affected at the worst hour, with sticky routing keeping some users on the wrong servers. (Day 4, Slide 23)
- 60-80% of memory wasted: Berkeley's vLLM team found 2023 serving systems wasted 60-80% of KV-cache memory on fragmentation and over-reservation, which capped batch sizes. (Day 4, Slide 24)
- Paging the cache, PagedAttention, cut that waste below 4% and raised throughput 2-4x. (Day 4, Slide 24)
- In production nobody tells you the KV cache is full; you get symptoms, and each suspect lives in one stage of the pipeline. (Day 4, Slide 25)
- Average latency hides most of these problems; teams watch percentiles for TTFT and TPOT, token counts, queue and cache health, and output quality. (Day 4, Slide 20)

## Relationships

- Tokens -> Context window (the fixed-size input buffer is filled with tokens, not words) (Day 1, Slide 15; Day 4, Slide 7)
- Tokens -> Token economics (input, output and cached tokens are billed per token) (Day 1, Slide 22)
- Context window -> Silent truncation (everything competes for one window, so naive truncation drops the oldest first) (Day 1, Slides 25 and 26)
- Prompt structure -> Prompt injection (structure is also a defense against user input hijacking instructions) (Day 2, Slides 10 and 22)
- Few-shot prompting -> Failure patterns (failures like ambiguous instructions and format drift are predictable, so in production you defend them) (Day 2, Slide 18)
- Prompt structure -> Agent harness (the harness is everything around the model: structure the model reads, plus what acts) (Day 3, Slide 10)
- Agent harness -> Inference pipeline (the harness loop is a repeated request through prefill and decode) (Day 3, Slide 7; Day 4, Slide 6)
- TTFT -> Prefill (TTFT equals queueing plus prefill, and a longer prompt means more prefill work) (Day 4, Slide 14)
- TPOT -> Decode (TPOT is decode time per token and sets how fast text streams) (Day 4, Slide 10)
- KV cache -> Batching (the cache competes with the weights for GPU memory and sets how many requests fit at once) (Day 4, Slide 12)

## Glossary

- **Token**: The unit models read, not text. (Day 1, Slide 3)
- **BPE**: Byte-Pair Encoding. Merge the most frequent pair. Repeat. (Day 1, Slide 5)
- **WordPiece**: Greedy longest match; ## marks a continuation. (Day 1, Slide 6)
- **SentencePiece**: Works on raw text. A space is just a symbol. (Day 1, Slide 7)
- **MoE**: Mixture of Experts; only some experts run per token. (Day 1, Slide 10)
- **Context window**: A fixed-size input buffer, not memory. (Day 1, Slide 15)
- **Lost in the middle**: Attention isn't even inside the window. (Day 1, Slide 17)
- **Temperature**: Same prompt, different randomness. (Day 1, Slide 18)
- **Top-p / Top-k**: Which tokens are even allowed next. (Day 1, Slide 19)
- **Hallucination**: Confident, plausible, wrong. (Day 1, Slide 20)
- **Prompt caching**: Repeated prefixes get cheaper. (Day 1, Slide 24)
- **Zero-shot**: Just the instruction. No examples. (Day 2, Slide 11)
- **One-shot**: One example shows what "done" looks like, demonstrated on converting dates to a numeric format. (Day 2, Slides 12 and 13)
- **Few-shot**: More examples, more stability. (Day 2, Slide 13)
- **Format drift**: Starts on-format. Ends off-format. (Day 2, Slide 16)
- **Prompt injection**: User input hijacks the instructions. (Day 2, Slide 19)
- **Agent harness**: Everything around the model. (Day 3, Slide 10)
- **Plan mode**: It proposes a plan before it acts. (Day 3, Slide 14)
- **Skills**: Teach it once, reuse it every time. (Day 3, Slide 16)
- **MCP**: The agent reaches outside the codebase; host, client, server, and what a server offers. (Day 3, Slide 17)
- **Sub-agents**: It delegates a sub-task to another agent. (Day 3, Slide 19)
- **Streaming**: Why text appears word by word. (Day 1, Slide 31)
- **TTFT**: Time to first token. (Day 1, Slide 28; Day 4, Slide 8)
- **TPOT**: Time per output token. (Day 1, Slide 29; Day 4, Slide 10)
- **Prefill**: The model reads the entire prompt in one pass, builds its internal state, then emits the first token. (Day 4, Slide 9)
- **Decode**: Each new token depends on the tokens before it, so the model produces them one at a time. (Day 4, Slide 10)
- **KV cache**: Attention needs the keys (K) and values (V) of every earlier token; with a cache each token's K and V are computed once, stored and reused. (Day 4, Slide 11)
- **Batching**: Process requests together. (Day 4, Slide 5)
- **Concurrency**: Many requests in flight at once. (Day 4, Slide 5)
- **Queueing**: Waiting for a free slot. (Day 4, Slide 5)
- **Cold starts**: The delay before a sleeping model can answer. (Day 4, Slide 5)
- **Continuous batching**: Refills a freed slot at the very next step, so the GPU stays full and newcomers wait less. (Day 4, Slide 15)
- **PagedAttention**: Paging the cache; cut 2023 serving systems' KV-cache waste below 4% and raised throughput 2-4x. (Day 4, Slide 24)

## Source notes

Text was extracted with pypdf, which loses reading order on multi-column slides and drops images. The following slides yielded near-empty or obviously incomplete text and are cited as unread rather than inferred:

- Day 3, Slide 3 (The landscape) and Day 3, Slide 4 (Comparison at a glance): only the title and one caption line survive; the four-tool comparison is almost certainly a table or image. (Day 3, Slide 3)
- Day 3, Slide 18 (MCP: the components): only the caption "Host, client, server, and what a server offers" survives; the component diagram is lost. (Day 3, Slide 18)
- Day 3, Slide 20 (The best-practice checklist): checklist body is missing; only "Not blind trust: know exactly where to look." (Day 3, Slide 20)
- Day 1, Slide 33 (Quiz Time): only "Four options, one answer." plus "ABC" and "kahoot.com"; the quiz questions and options are lost. (Day 1, Slide 33)
- Day 2, Slides 8 and 9 (Other delimiters, Live: before and after): the code examples are fragmentary and their reading order is scrambled across delimiters, fences and inline text. (Day 2, Slide 8)
- Day 4, Slide 28 (Sources and further reading): the source list is truncated after "Read the originals: the numbers here are as reported by". (Day 4, Slide 28)

One reviewer item was rejected. The diagram keeps the `Day 3 -> Day 4` edge: Day 3's own next-up slide points at "Week 2" rather than this deck, but the deck is sequenced after Day 2 and before Day 4 as presented, and that ordering is the course structure rather than a claim the slides make. It is a navigation edge, not a slide-derived relationship.

Two further notes on the extracted text: ligature characters are corrupted throughout ("finite" appears as "finite" with a broken fi, "different" as "dierent", "attention" as "aention"), and the Day 3 deck's own title slide reads "DAY 6" even though it is presented here as Day 3, consistent with the other three decks' internal numbering.