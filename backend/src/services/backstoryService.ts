import { v7 as uuidv7 } from "uuid";

import type { BedrockClient } from "../clients/bedrockClient.js";
import type {
  BackstoryAttempt,
  GeneratedBackstory,
  GenerateBackstoryInput
} from "../models/backstory.js";
import type { BackstoryRepository } from "../repositories/backstoryRepository.js";
import { AppError } from "../utils/errors.js";
import type { Logger } from "../utils/logger.js";
import { nowIso } from "../utils/time.js";
import { buildBackstoryPrompt } from "./promptBuilder.js";

export class BackstoryService {
  constructor(
    private readonly deps: {
      bedrock: BedrockClient;
      backstoryRepo: BackstoryRepository;
      modelId: string;
      logger: Logger;
    }
  ) {}

  async generateDraft(opts: {
    userId: string;
    input: GenerateBackstoryInput;
  }): Promise<GeneratedBackstory> {
    const attemptId = uuidv7();
    const { prompt, promptHash, promptVersion } = buildBackstoryPrompt(opts.input);

    const start = Date.now();
    try {
      const result = await this.deps.bedrock.invokeTextModel({
        modelId: this.deps.modelId,
        body: {
          // This shape is provider/model specific; MVP keeps it simple.
          prompt
        }
      });

      const latencyMs = Date.now() - start;

      const attempt: BackstoryAttempt = {
        userId: opts.userId,
        attemptId,
        status: "SUCCEEDED",
        model: this.deps.modelId,
        promptVersion,
        promptHash,
        input: {
          faction: opts.input.faction,
          class: opts.input.class,
          traits: opts.input.traits,
          contextInput: opts.input.contextInput ?? null
        },
        outputText: result.text,
        errorCode: null,
        errorMessage: null,
        latencyMs,
        createdAt: nowIso()
      };

      await this.deps.backstoryRepo.writeAttempt(attempt);
      await this.deps.backstoryRepo.updateProfileDraft(opts.userId, result.text);

      this.deps.logger.info(
        {
          operation: "backstory.generate",
          attemptId,
          bedrock: { modelId: this.deps.modelId },
          promptVersion,
          promptHash,
          promptLength: prompt.length,
          backstoryLength: result.text.length,
          latencyMs,
          userId: opts.userId
        },
        "Backstory generated"
      );

      return { text: result.text, model: this.deps.modelId, promptVersion };
    } catch (err: any) {
      const latencyMs = Date.now() - start;

      const attempt: BackstoryAttempt = {
        userId: opts.userId,
        attemptId,
        status: "FAILED",
        model: this.deps.modelId,
        promptVersion,
        promptHash,
        input: {
          faction: opts.input.faction,
          class: opts.input.class,
          traits: opts.input.traits,
          contextInput: opts.input.contextInput ?? null
        },
        outputText: null,
        errorCode: err?.name ?? "BEDROCK_ERROR",
        errorMessage: typeof err?.message === "string" ? err.message : "Bedrock error",
        latencyMs,
        createdAt: nowIso()
      };

      try {
        await this.deps.backstoryRepo.writeAttempt(attempt);
      } catch (persistErr) {
        this.deps.logger.error(
          { operation: "backstory.persistAttemptFailed", attemptId, err: persistErr },
          "Failed to persist backstory attempt"
        );
      }

      this.deps.logger.error(
        {
          operation: "backstory.generate",
          attemptId,
          bedrock: { modelId: this.deps.modelId },
          promptVersion,
          promptHash,
          latencyMs,
          userId: opts.userId,
          err
        },
        "Backstory generation failed"
      );

      throw new AppError("Backstory generation failed", {
        code: "UPSTREAM_ERROR",
        statusCode: 502
      });
    }
  }

  async saveFinal(opts: { userId: string; text: string }): Promise<{ updatedAt: string }> {
    const { updatedAt } = await this.deps.backstoryRepo.saveFinal(opts.userId, opts.text);
    this.deps.logger.info(
      {
        operation: "backstory.saveFinal",
        userId: opts.userId,
        backstoryLength: opts.text.length,
        updatedAt
      },
      "Final backstory saved"
    );
    return { updatedAt };
  }
}

