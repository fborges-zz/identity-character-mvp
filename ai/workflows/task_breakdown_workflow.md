# Task Breakdown Workflow

## Goal
Convert high-level requirements into clear, actionable engineering tasks using AI assistance.

## Inputs
- docs/requirements.md
- docs/architecture.md
- docs/api_contracts.md

## Process

### 1. Understand the feature
- Identify the core objective
- Identify inputs and outputs
- Identify dependencies

### 2. Use AI to generate tasks
Ask AI to:
- break feature into backend tasks
- identify API endpoints
- identify validation requirements
- identify infrastructure needs

### 3. Structure tasks
Each task must include:
- clear title
- concise description
- expected outcome

### 4. Identify risks
Use AI to identify:
- edge cases
- failure scenarios
- performance concerns

### 5. Add acceptance criteria
For key tasks:
- define success conditions
- define validation steps

## Output
A structured list of tasks ready to be added to Linear.

## Notes
- Do not accept AI-generated tasks blindly
- Validate against architecture and scope
- Prefer small, testable tasks