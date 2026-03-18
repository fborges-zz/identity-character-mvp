import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import { v7 as uuidv7 } from "uuid";

import { readEnv } from "./config/env.js";
import { openApiSpec } from "./openapi.js";
import { createDynamoDbDocumentClient } from "./clients/dynamodbClient.js";
import { BedrockClient } from "./clients/bedrockClient.js";
import { buildBackstoryRouter } from "./routes/backstory.js";
import { buildProfilesRouter } from "./routes/profiles.js";
import { BackstoryRepository } from "./repositories/backstoryRepository.js";
import { ProfileRepository } from "./repositories/profileRepository.js";
import { BackstoryService } from "./services/backstoryService.js";
import { ProfileService } from "./services/profileService.js";
import { isAppError } from "./utils/errors.js";
import { createLogger } from "./utils/logger.js";
import {
  attachResponseContext,
  setRequestContext
} from "./utils/requestContext.js";

const logger = createLogger();

export function createApp(overrides?: {
  profileService?: ProfileService;
  backstoryService?: BackstoryService;
}) {
  const env = readEnv();
  const app = express();

  app.use(express.json({ limit: "1mb" }));
  app.use(
    pinoHttp({
      logger,
      genReqId: () => uuidv7(),
      customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
      }
    })
  );

  app.use((req, res, next) => {
    const requestId = (req as any).id as string | undefined;
    const userId = req.params.userId || req.body?.userId;
    if (requestId) {
      const ctx = { requestId, userId };
      setRequestContext(req, ctx);
      attachResponseContext(res, ctx);
    }
    next();
  });

  const ddb = createDynamoDbDocumentClient();
  const profileRepo = new ProfileRepository(ddb, env.DDB_TABLE_NAME);
  const backstoryRepo = new BackstoryRepository(ddb, env.DDB_TABLE_NAME);

  const profileService = overrides?.profileService ?? new ProfileService(profileRepo);
  const backstoryService =
    overrides?.backstoryService ??
    new BackstoryService({
      bedrock: new BedrockClient(),
      backstoryRepo,
      modelId: env.BEDROCK_MODEL_ID,
      logger
    });

  app.use(buildProfilesRouter({ profileService }));
  app.use(buildBackstoryRouter({ backstoryService }));
  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.get("/openapi.json", (_req, res) => res.json(openApiSpec));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

  app.use((_req, res) => {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND" } });
  });

  app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      if (isAppError(err)) {
        res.status(err.statusCode).json({
          success: false,
          error: { code: err.code, message: err.message, details: err.details }
        });
        return;
      }

      logger.error({ err }, "Unhandled error");
      res.status(500).json({
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Internal server error" }
      });
    }
  );

  return app;
}

// Run server only when this file is the entry point (e.g. tsx watch src/server.ts).
const currentPath = fileURLToPath(import.meta.url);
const entryPath = process.argv[1] ? path.resolve(process.cwd(), process.argv[1]) : "";
if (entryPath === currentPath) {
  const { config } = await import("dotenv");
  config(); // load .env from backend root so npm run dev works with a .env file
  const port = Number(process.env.PORT ?? 3000);
  createApp().listen(port, () => {
    logger.info({ port }, "Server listening");
  });
}

