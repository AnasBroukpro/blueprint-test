# Blueprint AI Stack

## 1. Overview

Blueprint AI Stack is a **canonical master template** for AI-augmented software delivery.
It defines a strict, cloneable, and verifiable orchestration framework.

Every future clone inherits:
- The same validation contract
- The same audit methodology
- The same prohibition on implicit assumptions

## 2. Core Stack

| Tool | Role |
|---|---|
| **OpenCode (CLI)** | Local development agent: task execution, code editing, validation |
| **n8n** | Workflow orchestrator: automated phase chaining, notifications, integrations |
| **Plane** | Project management: tickets, sprints, roadmap, task tracking |
| **Spec Kit** | Scoping and design: functional and technical specifications, architecture decisions |
| **Graphify** | Knowledge graph: visualize dependencies between specs, tasks, modules, decisions |
| **GitHub** | Source code hosting, PRs, reviews, CI/CD |
| **VitePress** | Spec and documentation site (served locally) |

## 3. Architecture

```
Spec Kit ──▶ Plane ──▶ OpenCode ──▶ GitHub
   │                    │
   └──── n8n ───────────┘
          │
     Graphify   VitePress
```

The flow starts with scoping (Spec Kit), generates tickets (Plane), executes them via OpenCode, and orchestrates everything with n8n. Graphify indexes all artifacts. VitePress renders specs as a local documentation site.

## 4. Phases

| Phase | Description | Deliverable |
|---|---|---|
| **Φ0 — Bootstrap** | Stack initialization, tool configuration | Ready environment, valid API keys |
| **Φ1 — Scoping** | Write functional and technical specs | Spec Kit documents |
| **Φ2 — Planning** | Break down into Plane tickets, organize backlog | Plane tickets |
| **Φ3 — Implementation** | OpenCode-assisted development, PRs | Shipped code, green tests |
| **Φ4 — Verification** | Tests, lint, validate acceptance criteria | Approved review, merge |
| **Φ5 — Retrospective** | Update Graphify, close tickets, continuous improvement | Updated graph, lessons learned |

## 5. Operating Rules

### 5.1 Validation Contract (Non-Negotiable)

A workflow is **never** validated by a single indicator.

1. A webhook or trigger is **only** an entry point. It proves nothing about downstream logic.
2. Every workflow step must be verified **independently**.
3. Use only these statuses: **confirmé**, **absent**, **partiel**, **supposé**.
   - `confirmé` = direct evidence exists (log, execution, config, file).
   - `absent` = no evidence found, not configured.
   - `partiel` = partially configured, missing key elements.
   - `supposé` = no direct evidence but plausible by convention — must be flagged.
4. Never extrapolate a complete workflow from partial evidence.
5. Never invent a connection between tools unless explicitly configured.
6. Never declare a workflow "end-to-end" without proof for every maillon.
7. Any block, limitation, or missing dependency must be documented.

### 5.2 Standard Audit Format

When auditing any workflow, always use this structure:

```
## Audit: [Workflow Name]

### 1. [Step name]
**Status: confirmé / absent / partiel / supposé**
Evidence: [specific, verifiable facts]
Config: [relevant configuration details]

### 2. [Step name]
...

### N. Synthèse
| Maillon | Statut |
|---|---|
| 1. ... | confirmé |
| 2. ... | absent |
...

**Total: X/Y confirmés — Confiance globale: XX%**
```

### 5.3 Standard Response Format (OpenCode)

When OpenCode responds to a Blueprint query, use this format:

```
[conclusion or answer in 1-2 lines]

[table or bullet list of actionable items]

[optional: 1-line next step]
```

Rules:
- No preamble, no postamble.
- No explanations unless asked.
- No emojis.
- If the answer is a single status or number, just output it.

### 5.4 Traceability

- Every artifact carries a unique identifier.
- Links between artifacts are explicit (e.g. `PLANE-123`, `SPEC-456`, `commit:abc123`).
- Artifacts without identifiers are considered untraceable.

### 5.5 Plane Synchronization

- Plane ticket status is the source of truth for progress.
- OpenCode updates ticket status at each key step (in progress, in review, done).
- n8n listens to Plane webhooks to trigger downstream workflows.
- A ticket is never closed until all acceptance criteria are verified.

### 5.6 Orchestration with n8n

- n8n automates inter-phase handoffs.
- Workflows are versioned in `.n8n/`.
- Each workflow has: input webhook, processing logic, error handling, output/response.
- A workflow with no processing logic between trigger and response is a stub, not a workflow.

### 5.7 Tool Activation Protocol

1. **Documentation** — consult official docs.
2. **System Scan** — check native, Docker, npm, Python, etc.
3. **Decision** — already installed → verify status and update `tool-status.md`; stopped → propose start; missing → propose install.
4. **Execution** — act only after confirmation.

### 5.8 Knowledge Graph with Graphify

- Graphify automatically indexes specs, tickets, modules, and decisions.
- Nodes are typed (Spec, Task, Module, Decision, PR).
- Edges represent relationships (derives_from, implements, validates, depends_on).

## 6. Minimum Viable Clone

To create a new project from this Blueprint:

1. Clone `G:\DevProjects\Blueprint AI Stack` → `G:\DevProjects\<Project Name>`.
2. Delete the `graphify-out/` directory.
3. Run `graphify update .` to rebuild the graph for the new project.
4. Update `README.md` and `AGENTS.md` with the new project name.
5. Verify every tool in the stack is accessible from the new location.
6. Run `graphify query "tool status"` to confirm all connections.

A clone is **viable** when:
- All tools respond (Plane API, n8n webhook, Graphify CLI, Spec Kit, OpenCode, GitHub token).
- The audit format from 5.1 produces valid results.
- At least one manual trigger → n8n → response cycle has been executed and logged.

A clone is **production-ready** when all 7 maillons of the standard audit return `confirmé` or `partiel` with documented remaining steps.

## 7. Non-Negotiable Rules

These rules apply to the master blueprint AND every clone. They cannot be relaxed:

1. **No single-indicator validation.** A 200 OK on a webhook does not validate a workflow.
2. **No implicit connections.** Every tool-to-tool link must be explicitly configured and tested.
3. **No speculative status.** Every status must be backed by evidence (log, execution, file, config).
4. **No silent fallback.** If a step fails, the system must produce a traceable error.
5. **No response without structure.** Every Blueprint audit uses the standard format (5.1).
6. **No premature E2E declaration.** All 7 maillons must be `confirmé` before declaring end-to-end.
7. **No clone without audit.** Every new clone must pass the minimum viable check (section 6) before being used.

## 8. Master Template Status

**Blueprint AI Stack** is the master template. It is not a real application.

To start a new project:
1. Clone this folder to the desired location.
2. Rename the copy with the actual application name.
3. Work only in the copy; the original blueprint remains untouched.

The `Blueprint AI Stack` folder must never contain application code.

## 9. Next Steps (Blueprint-Level)

1. Verify each tool individually (Plane API, n8n, Graphify, Spec Kit, OpenCode, GitHub).
2. Build and test the n8n workflow maillon by maillon.
3. Link VitePress as a spec source for n8n.
4. Implement OpenCode invocation from n8n.
5. Implement GitHub push/PR from n8n.
6. Implement Plane ticket update from n8n.
7. Run a full 7-maillon audit.
8. Clone and validate in a test project.
