# Identity Character MVP — Working Rules

<!-- Conventions, patterns, and rules for development and AI-assisted workflows. -->

# Working Rules

## Documentation First
Before implementation, review:
- docs/requirements.md
- docs/architecture.md
- docs/api_contracts.md
- docs/tasks.md

## AI Usage
Use AI for:
- task breakdown
- acceptance criteria
- scaffolding
- risk and edge-case discovery

Do not accept AI output blindly.
All generated code and proposals must be validated against project architecture and contracts.

## Safe Change Rules
Before commit or merge:
- review diffs for destructive changes
- inspect dependency changes carefully
- verify API contract consistency
- verify data model consistency
- avoid accidental refactors

## Documentation Sync
When implementation changes behavior or structure, update the relevant docs and decision logs.

## Delivery Focus
Prefer small, clear, testable changes over large broad rewrites.