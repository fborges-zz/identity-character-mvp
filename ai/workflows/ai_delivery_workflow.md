# Identity Character MVP — AI Delivery Workflow

<!-- Documentation for AI-assisted development and delivery workflows. -->

# AI Delivery Workflow

## Goal
Use AI to accelerate delivery planning, improve clarity, and reduce repetitive engineering work without losing architectural control.

## Workflow

### 1. Read project context
Before planning or implementation, review:
- docs/requirements.md
- docs/architecture.md
- docs/api_contracts.md
- docs/tasks.md
- memory-bank/project_summary.md
- memory-bank/working_rules.md

### 2. Break down work
Use AI to:
- convert requirements into implementation tasks
- identify dependencies
- identify risks and edge cases
- draft acceptance criteria

### 3. Scaffold safely
Use AI to scaffold:
- models
- service stubs
- validators
- Terraform skeletons
Do not accept output blindly.

### 4. Validate changes
Before considering work complete:
- verify API contracts
- verify data model consistency
- review for unintended destructive changes
- inspect dependency changes
- ensure architecture alignment

### 5. Sync docs
If behavior or structure changes, update:
- architecture.md
- api_contracts.md
- tasks.md
- decisions.md