# Acceptance Criteria Workflow

## Goal
Define clear, testable success conditions for each task using AI assistance.

## When to Apply
- During task creation
- Before implementation
- During QA review

## Process

### 1. Understand the task
- What is the expected outcome?
- What does success look like?

### 2. Use AI to generate criteria
Ask AI to:
- define success conditions
- identify edge cases
- identify failure scenarios

### 3. Define criteria structure

Each acceptance criteria should be:
- clear and specific
- testable
- measurable

### 4. Include key dimensions

#### Functional
- feature works as expected

#### Validation
- inputs are validated
- errors handled properly

#### Edge Cases
- empty inputs
- invalid inputs
- system failures

#### Performance (if relevant)
- response time
- retry behavior

### 5. Validate criteria
- ensure alignment with requirements.md
- ensure feasibility within scope

## Output
Clear acceptance criteria that define when a task is complete.

## Example

Task: Generate backstory

Acceptance Criteria:
- backstory is generated based on input
- response is returned within acceptable latency
- failure returns safe error message
- result can be edited and saved

## Notes
- Avoid vague criteria
- Prefer explicit validation conditions