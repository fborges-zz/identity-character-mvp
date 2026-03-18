/**
 * OpenAPI 3.0 spec for Identity Character MVP.
 * Aligned with docs/api_contracts.md.
 */
export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Identity Character MVP API",
    version: "0.1.0",
    description: "Profile creation and AI-generated backstory endpoints."
  },
  servers: [{ url: "/", description: "Current host" }],
  paths: {
    "/profiles": {
      post: {
        summary: "Create or update profile",
        description: "Create or update a user profile with faction, class, traits, and optional context.",
        operationId: "createProfile",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateProfileRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Profile created or updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateProfileResponse" }
              }
            }
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/profiles/{userId}/generate-backstory": {
      post: {
        summary: "Generate backstory",
        description: "Generate an AI draft backstory for the given profile inputs.",
        operationId: "generateBackstory",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/GenerateBackstoryRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Backstory draft generated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GenerateBackstoryResponse" }
              }
            }
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "502": {
            description: "Upstream (e.g. Bedrock) error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/profiles/{userId}/backstory": {
      put: {
        summary: "Save final backstory",
        description: "Persist the edited final backstory for the user.",
        operationId: "saveBackstory",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SaveBackstoryRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Final backstory saved",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SaveBackstoryResponse" }
              }
            }
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      CreateProfileRequest: {
        type: "object",
        required: ["userId", "faction", "class", "traits"],
        properties: {
          userId: { type: "string" },
          faction: { type: "string" },
          class: { type: "string" },
          traits: { type: "array", items: { type: "string" } },
          contextInput: { type: "string", nullable: true }
        }
      },
      Profile: {
        type: "object",
        properties: {
          userId: { type: "string" },
          faction: { type: "string" },
          class: { type: "string" },
          traits: { type: "array", items: { type: "string" } },
          contextInput: { type: "string", nullable: true }
        }
      },
      CreateProfileResponse: {
        type: "object",
        required: ["success", "profile"],
        properties: {
          success: { type: "boolean", example: true },
          profile: { $ref: "#/components/schemas/Profile" }
        }
      },
      GenerateBackstoryRequest: {
        type: "object",
        required: ["faction", "class", "traits"],
        properties: {
          faction: { type: "string" },
          class: { type: "string" },
          traits: { type: "array", items: { type: "string" } },
          contextInput: { type: "string", nullable: true }
        }
      },
      GenerateBackstoryResponse: {
        type: "object",
        required: ["success", "backstory"],
        properties: {
          success: { type: "boolean", example: true },
          backstory: {
            type: "object",
            required: ["text", "model", "promptVersion"],
            properties: {
              text: { type: "string" },
              model: { type: "string" },
              promptVersion: { type: "string" }
            }
          }
        }
      },
      SaveBackstoryRequest: {
        type: "object",
        required: ["text"],
        properties: {
          text: { type: "string" }
        }
      },
      SaveBackstoryResponse: {
        type: "object",
        required: ["success", "backstory"],
        properties: {
          success: { type: "boolean", example: true },
          backstory: {
            type: "object",
            required: ["text", "updatedAt"],
            properties: {
              text: { type: "string" },
              updatedAt: { type: "string", format: "date-time" }
            }
          }
        }
      },
      ErrorResponse: {
        type: "object",
        required: ["success", "error"],
        properties: {
          success: { type: "boolean", example: false },
          error: {
            type: "object",
            required: ["code"],
            properties: {
              code: {
                type: "string",
                enum: ["VALIDATION_ERROR", "NOT_FOUND", "UPSTREAM_ERROR", "INTERNAL_ERROR"]
              },
              message: { type: "string" },
              details: { type: "object" }
            }
          }
        }
      }
    }
  }
} as const;
