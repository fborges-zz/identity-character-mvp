# Identity Character MVP — Architecture

<!-- System design, components, data flow, and infrastructure overview. -->

# Identity & Character MVP — Architecture

## Overview
This system is a backend-focused MVP that supports user profile creation and AI-assisted character backstory generation.

## AWS Components
- API entrypoint via lightweight backend service
- DynamoDB for profile and backstory persistence
- AWS Bedrock for text generation
- IAM roles for secure service access
- CloudWatch for logs and monitoring
- Terraform for infrastructure provisioning

## Logical Flow
1. User submits profile attributes
2. Backend validates payload
3. Profile data is stored or updated in DynamoDB
4. User requests AI-generated backstory
5. Backend builds generation prompt
6. Request is sent to AWS Bedrock
7. Draft response is returned
8. User edits and saves final backstory
9. Final result is persisted

## Data Model Overview
### User Profile
- userId
- faction
- class
- traits
- contextInput
- generatedBackstoryDraft
- finalBackstory
- createdAt
- updatedAt

## Design Principles
- simplicity over complexity
- explicit contracts
- safe changes
- reproducible infrastructure
- human review over blind AI acceptance