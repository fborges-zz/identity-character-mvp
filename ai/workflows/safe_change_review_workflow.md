# Safe Change Review Workflow

## Goal
Ensure all code changes are safe, non-destructive, and aligned with system architecture.

## When to Apply
- Before committing code
- Before merging changes
- After AI-generated code

## Process

### 1. Review Changes
- Inspect code diff carefully
- Identify unintended changes
- Look for large or unexpected modifications

### 2. Validate Core Areas

#### API Contracts
- Ensure request/response structure is unchanged unless intentional
- Validate field names and types

#### Data Models
- Ensure no breaking changes to schema
- Check compatibility with stored data

#### Dependencies
- Review package.json or dependency files
- Ensure no unintended upgrades or removals

### 3. Validate Behavior
- Ensure logic matches requirements
- Confirm error handling exists
- Confirm edge cases are handled

### 4. Architecture Alignment
- Ensure code follows architecture.md
- Avoid introducing new patterns without documentation

### 5. AI Output Validation
- Never trust generated code blindly
- Verify correctness and completeness
- Refactor if needed

## Output
- Safe, reviewed code ready for commit or PR

## Notes
- If a breaking change is required:
  - document it
  - explain impact
  - propose safer alternative if possible