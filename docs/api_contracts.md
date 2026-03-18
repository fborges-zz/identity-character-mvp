# Identity Character MVP — API Contracts

<!-- Request/response schemas, endpoints, and integration boundaries. -->

## Conventions

- **Content-Type**: `application/json`
- **Auth**: TBD (MVP may start unauthenticated; add auth headers once `docs/architecture.md` defines the auth approach)
- **Error shape**: TBD (standardize once implementation starts)

## Create Profile

### POST `/profiles`

#### Request body

```json
{
  "userId": "string",
  "faction": "string",
  "class": "string",
  "traits": ["string"],
  "contextInput": "string"
}
```

#### Response body (200)

```json
{
  "success": true,
  "profile": {
    "userId": "string",
    "faction": "string",
    "class": "string",
    "traits": ["string"],
    "contextInput": "string"
  }
}
```

## Generate Backstory

### POST `/profiles/{userId}/generate-backstory`

#### Request body

```json
{
  "faction": "string",
  "class": "string",
  "traits": ["string"],
  "contextInput": "string"
}
```

#### Response body (200)

```json
{
  "success": true,
  "backstory": {
    "text": "string",
    "model": "string",
    "promptVersion": "string"
  }
}
```