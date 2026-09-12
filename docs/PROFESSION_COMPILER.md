# Profession Compiler v0.1

The **Profession Compiler** is the research/build pipeline that turns observed human professional work into a candidate Professional Body.

It is not expected to be fully automatic at first.

## Principle

Do not begin with "What should an AI expert know?"

Begin with:

> What does a competent human specialist actually notice, retrieve, decide, use, produce, verify, communicate, remember, and refuse across real work?

Then make those structures explicit where doing so creates useful control or evidence.

## Pipeline

### 0. Bound the profession slice

Define jurisdiction/scope, seniority assumptions, task class, environment, and non-goals.

Avoid compiling an entire vague profession such as `engineer` in one pass.

### 1. Observe the work

Collect evidence from real professional practice where lawful and appropriate:

- interviews and practitioner explanations;
- standards and primary references;
- textbooks/manuals;
- workflows and checklists;
- real artifacts;
- tool usage;
- incident/postmortem material;
- review comments;
- training/certification material;
- observed failure cases.

Preserve disagreement instead of averaging it into false consensus.

### 2. Build the profession map

Map:

- recurring goals;
- inputs;
- observations/signals;
- classifications;
- decisions;
- tools;
- procedures;
- artifacts;
- evidence;
- handoffs;
- failure modes;
- escalation paths;
- memory/state needs.

Separate common practice from institution-specific habit.

### 3. Extract invariants and judgment zones

Identify what is relatively deterministic and what requires contextual judgment.

Do not force judgment into fake deterministic rules. Instead bound the judgment with inputs, evidence, alternatives, uncertainty, and review paths.

### 4. Compile knowledge

Create source-aware knowledge domains and retrieval rules.

Prefer references and retrieval over stuffing static copies into prompts when the information can change or requires authority/version tracking.

### 5. Compile capabilities

Turn repeated professional actions into reusable capabilities.

A capability should answer:

- what problem does it solve?
- what inputs are required?
- what execution mode does it use?
- what output does it produce?
- what evidence supports success?
- what can go wrong?

### 6. Compile tools and procedures

Bind professional capabilities to tools where appropriate and create explicit procedures for repeatable workflows.

Tool availability and professional authority remain separate.

### 7. Compile memory and state

Decide what belongs in:

- canonical professional knowledge;
- project/case state;
- temporary working state;
- institution state.

Define promotion and retention rules.

### 8. Compile ownership and handoffs

Define decision rights and cross-profession boundaries.

Create minimum handoff packets so another body can continue from explicit state/evidence instead of hidden chain-of-thought or chat history.

### 9. Compile the failure library

Seed known failure modes and add new ones from experiments.

A body should learn not only how work succeeds but how professionals detect when their own output is unreliable.

### 10. Build professional fixtures

Construct representative tasks with known important observations and outcomes.

Include tests where:

- obvious answers are wrong;
- evidence conflicts;
- data is missing;
- another profession owns the decision;
- a tool fails;
- the correct action is abstain/escalate;
- stale state creates a trap.

### 11. Baseline

Compare at minimum:

`same intelligence + role-only instruction`

against:

`same intelligence + Professional Body`

Where possible add another intelligence using the same body.

### 12. Diagnose the delta

Do not merely score pass/fail. Determine whether failures came from:

- missing knowledge;
- bad retrieval;
- bad procedure;
- tool deficiency;
- incorrect state;
- weak handoff;
- ownership confusion;
- evidence failure;
- intelligence limitation;
- institution limitation.

The diagnosis decides where the next improvement belongs.

### 13. Promote carefully

A body grows only when the new professional structure has provenance/evidence and existing contracts still pass or their change is explicit.

## Output

The compiler produces a Professional Body conforming to the schema plus its associated references, tools, procedures, fixtures, evidence, and history.

## Long-term direction

Eventually Profession Compiler may itself become an institution-supported machine process capable of proposing new bodies and upgrades. Until evidence justifies that, human and machine researchers should treat compilation as an explicit research activity rather than an automatic truth generator.
