import type { Router } from "express";
import express from "express";

import type { ProfileService } from "../services/profileService.js";
import { AppError } from "../utils/errors.js";
import { CreateProfileRequestSchema } from "../validators/profileValidator.js";

export function buildProfilesRouter(opts: { profileService: ProfileService }) {
  const router: Router = express.Router();

  router.post("/profiles", async (req, res, next) => {
    try {
      const parsed = CreateProfileRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError("Invalid request", {
          code: "VALIDATION_ERROR",
          statusCode: 400,
          details: parsed.error.flatten()
        });
      }

      const profile = await opts.profileService.upsert(parsed.data);
      res.json({ success: true, profile });
    } catch (err) {
      next(err);
    }
  });

  return router;
}

