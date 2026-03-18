# Identity Character MVP — API Contracts

<!-- Request/response schemas, endpoints, and integration boundaries. -->

## Conventions

- **Content-Type**: `application/json`
- **Auth**: TBD (MVP may start unauthenticated; add auth headers once `docs/architecture.md` defines the auth approach)
- **Error shape** (non-2xx):

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | NOT_FOUND | UPSTREAM_ERROR | INTERNAL_ERROR",
    "message": "string (optional)",
    "details": {}
  }
}
```

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

## Save Final Backstory

### PUT `/profiles/{userId}/backstory`

#### Request body

```json
{
  "text": "string"
}
```

#### Response body (200)

```json
{
  "success": true,
  "backstory": {
    "text": "string",
    "updatedAt": "string"
  }
}
```