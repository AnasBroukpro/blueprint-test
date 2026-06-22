# Tool Status — Blueprint AI Stack

> Source of truth file for the operational status of tools and services.
> Updated manually after each activation or state change.

## Tool Status

| Tool | Status | Notes |
|---|---|---|
| **Spec Kit** | `active` | CLI at G:\Apps\Opencode\tools\, constitution.md + .specify/ created |
| **VitePress** | `bundled` | npm dependency shipped with the template (docs/ ready) |
| **Plane** | `active` | Existing Docker stack on G:\, accessible at http://localhost:8082 |
| **Graphify** | `active` | CLI v0.8.44 via uv, integrated with OpenCode, graph generated (94 nodes, 76 edges) |
| **n8n** | `active` | npm global v2.23.4, auto-start via Windows Startup (n8n-launch.vbs), running on http://localhost:5678 |
| **OpenCode (CLI)** | `active` | Already in use in this project |
| **GitHub** | `active` | Connected to OpenCode, token stored in secrets |

## Status Legend

| Status | Meaning |
|---|---|
| `active` | Tool is operational and ready |
| `bundled` | Included in the template, no external configuration needed |
| `not configured` | Tool identified but not yet configured |
| `pending` | Configuration in progress |
| `stopped` | Tool installed but currently stopped |
| `off` | Tool intentionally disabled |
