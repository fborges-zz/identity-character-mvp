import type { Router } from "express";
import express from "express";

import type { BackstoryService } from "../services/backstoryService.js";
import { AppError } from "../utils/errors.js";
import { GenerateBackstoryRequestSchema, SaveBackstoryRequestSchema } from "../validators/backstoryValidator.js";

export function buildBackstoryRouter(opts: { backstoryService: BackstoryService }) {
  const router: Router = express.Router();

  router.post("/profiles/:userId/generate-backstory", async (req, res, next) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        throw new AppError("userId is required", {
          code: "VALIDATION_ERROR",
          statusCode: 400
        });
      }

      const parsed = GenerateBackstoryRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError("Invalid request", {
          code: "VALIDATION_ERROR",
          statusCode: 400,
          details: parsed.error.flatten()
        });
      }

      const backstory = await opts.backstoryService.generateDraft({
        userId,
        input: {
          faction: parsed.data.faction,
          class: parsed.data.class,
          traits: parsed.data.traits,
          contextInput: parsed.data.contextInput ?? null
        }
      });

      res.json({ success: true, backstory });
    } catch (err) {
      next(err);
    }
  });

  router.put("/profiles/:userId/backstory", async (req, res, next) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        throw new AppError("userId is required", {
          code: "VALIDATION_ERROR",
          statusCode: 400
        });
      }

      const parsed = SaveBackstoryRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError("Invalid request", {
          code: "VALIDATION_ERROR",
          statusCode: 400,
          details: parsed.error.flatten()
        });
      }

      const { updatedAt } = await opts.backstoryService.saveFinal({
        userId,
        text: parsed.data.text
      });

      res.json({ success: true, backstory: { text: parsed.data.text, updatedAt } });
    } catch (err) {
      next(err);
    }
  });

  return router;
}

