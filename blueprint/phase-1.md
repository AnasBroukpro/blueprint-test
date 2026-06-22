# Phase 1: Project Foundation

## Before / After

| Before | After |
|---|---|
| Empty folder, no structure | Spec Kit operational, VitePress documentation in place |
| No connected tools | Plane, Graphify, n8n configured and linked |
| No defined process | Clear workflow: need → Spec Kit → VitePress → Plane → feasibility → human review → OpenCode |
| No traceability | Every artifact carries an ID and explicit links |

### Before

The initial base is an empty project folder. No tools are installed or configured. No development process exists.

### After

The enhanced base includes:

- **Spec Kit** — spec writing and versioning
- **VitePress** — clear, structured spec documentation
- **Plane** — tickets, statuses, progress tracking
- **Graphify** — project dependency mapping, updated after each Plane step
- **Feasibility** — technical analysis before any commitment
- **Human review** — peer validation before execution
- **OpenCode** — local development only after validation
- **n8n** — status and progress sync between Plane and local tools

## Description

Set up the minimal stack structure: tools, connections, conventions. By the end of this phase, the team can execute a complete cycle: need → Spec Kit → VitePress → Plane → feasibility → human review → OpenCode. This phase prepares the ground for the entire development cycle, from idea to delivery.

## Workflow

```
 1. need ──────────> Express the need
 2. Spec Kit ────────> Write the spec
 3. VitePress ───────> Publish documentation
 4. Plane ───────────> todo
 5. Graphify ────────> Map project dependencies
 6. Feasibility ─────> Technical analysis
 7. Human review ───> Spec review and approval
 8. Plane ───────────> in progress
 9. OpenCode ────────> Local development
10. Plane ───────────> review (human validation + tests)
11. Plane ───────────> done
```

## Plane Statuses

| Status | When |
|---|---|
| `todo` | Ticket created from spec, ready to be picked up |
| `in progress` | Development in progress on the dedicated branch |
| `review` | Code shipped, human validation + tests in progress |
| `done` | Validated, merged, ticket closed |

## Rules

### OpenCode only codes after validation

OpenCode only intervenes after the human spec review and the ticket transitioning to `in progress`. No code is written before explicit agreement.

### Plane remains the source of truth for progress

A Plane ticket's status is authoritative. Every action (development, review, merge) must be reflected in Plane before moving to the next step.

### n8n syncs statuses and progress

n8n listens to Plane webhooks and syncs status changes with local tools. It can notify OpenCode, update Graphify, or trigger a check. Plane remains the reference; n8n is the automation bridge without human substitution.
