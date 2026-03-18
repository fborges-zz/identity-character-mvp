import { describe, expect, it } from "vitest";
import request from "supertest";

import { createApp } from "../src/server.js";

describe("MVP endpoints", () => {
  it("POST /profiles validates input", async () => {
    process.env.DDB_TABLE_NAME = "test";
    process.env.BEDROCK_MODEL_ID = "test";

    const app = createApp({
      profileService: {
        // @ts-expect-error test stub
        upsert: async () => {
          throw new Error("should not be called");
        }
      }
    });

    const res = await request(app).post("/profiles").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /profiles/{userId}/generate-backstory returns backstory", async () => {
    process.env.DDB_TABLE_NAME = "test";
    process.env.BEDROCK_MODEL_ID = "test";

    const app = createApp({
      backstoryService: {
        // @ts-expect-error test stub
        generateDraft: async () => ({
          text: "draft backstory",
          model: "bedrock-model",
          promptVersion: "v1"
        })
      }
    });

    const res = await request(app)
      .post("/profiles/u1/generate-backstory")
      .send({
        faction: "Faction",
        class: "Class",
        traits: ["Brave"],
        contextInput: "ctx"
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      backstory: { text: "draft backstory", model: "bedrock-model", promptVersion: "v1" }
    });
  });

  it("PUT /profiles/{userId}/backstory persists final backstory", async () => {
    process.env.DDB_TABLE_NAME = "test";
    process.env.BEDROCK_MODEL_ID = "test";

    const app = createApp({
      backstoryService: {
        // @ts-expect-error test stub
        saveFinal: async () => ({ updatedAt: "2026-01-01T00:00:00.000Z" })
      }
    });

    const res = await request(app)
      .put("/profiles/u1/backstory")
      .send({ text: "final backstory" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.backstory.text).toBe("final backstory");
    expect(res.body.backstory.updatedAt).toBe("2026-01-01T00:00:00.000Z");
  });
});

