# identity-character-mvp

**Identity & Character MVP** (AI + AWS + Terraform)

## Repository structure

| Path | Purpose |
|------|---------|
| `docs/` | Requirements, architecture, API contracts, tasks, QA checklist, release notes |
| `memory-bank/` | Project summary, decisions, constraints, working rules (AI context) |
| `backend/` | API, services, models, validators, utils, tests |
| `infra/terraform/` | Terraform configuration (DynamoDB, Bedrock, etc.) |
| `ai/prompts/` | Prompts for backstory generation |
| `ai/workflows/` | AI-assisted development and delivery workflow docs |

---

## Cursor Rules & Skills Setup (How to Recreate This System)

This repository uses **project-scoped Cursor rules and AI workflows**, but the `.cursor/` directory is intentionally not included.

This is by design:

- avoids leaking internal configurations
- keeps the repo clean and portable
- allows each team or developer to customize their setup

---

## Why project-scoped rules matter

Instead of relying on personal habits, this approach ensures:

- consistent AI behavior across developers
- alignment with architecture and requirements
- safer code generation and modifications
- repeatable engineering workflows

> The goal is to treat AI as part of the engineering system — not as an individual tool.

---

## How to set up Cursor rules

Inside your project root, create:

```
.cursor/rules/
```

Then create a file such as:

```
.cursor/rules/project_rules.md
```

### Recommended rules

Add rules like the following:

```markdown
# Project Rules

## Context Awareness
- Always read:
  - docs/requirements.md
  - docs/architecture.md
  - docs/api_contracts.md
  - memory-bank/

## Safe Changes
- Never introduce breaking changes without explanation
- Validate impact on:
  - API contracts
  - data models
  - dependencies

## Pre-Commit Review
Before committing:
- review code diff
- check for unintended refactors
- validate package/dependency changes

## AI Usage
Use AI for:
- task breakdown
- acceptance criteria
- scaffolding
- edge case detection

Do NOT:
- accept AI output blindly
- bypass architecture decisions

## Code Quality
- keep modules small and focused
- prefer simplicity over complexity
- document important decisions
```

---

## How to define Skills (Team-Level AI Behavior)

Skills are repeatable AI workflows or behaviors that developers can reuse.

You can define them in:

```
.cursor/skills/
```

Example skill files:

```markdown
# Safe Change Review Skill

Before applying any change:
1. Read architecture.md
2. Compare against API contracts
3. Check for destructive changes
4. Validate dependencies
5. Confirm no unintended refactors

# Task Breakdown Skill

When given a feature:
1. Break into backend/API tasks
2. Identify validation logic
3. Identify infrastructure needs
4. Define acceptance criteria
5. Identify edge cases

# Acceptance Criteria Skill

For each task:
- define success conditions
- include edge cases
- include validation rules
- ensure testability
```

---

## How this connects to ai/workflows/

The `ai/workflows/` folder defines the **process**. The Cursor rules and skills define **how developers execute** that process.

| Layer | Purpose |
|-------|---------|
| `docs/` | What to build |
| `memory-bank/` | Context |
| `.cursor/rules` | Guardrails |
| `.cursor/skills` | Execution patterns |
| `ai/workflows/` | Process definition |

### How teams should use this

- Define project rules once
- Share skills across the team
- Enforce workflows during development
- Review AI-generated output consistently

---

## Customization per project

You should adapt rules depending on:

- backend vs frontend
- microservices vs monolith
- data-heavy systems
- real-time systems

**Examples:**

- add performance rules for high-scale systems
- add security validation rules for auth systems
- add data consistency rules for data pipelines

---

## Key principle

**AI should be guided, constrained, and validated — not trusted blindly.**

This setup ensures:

- alignment across developers
- higher quality outputs
- safer iterations
- faster delivery

---

## Optional: Team Standardization

In a team environment, you can:

- version control `.cursor/rules`
- share `.cursor/skills`
- enforce workflows in PR reviews

This turns AI usage into a team-level capability, not an individual advantage.
