import crypto from "node:crypto";

import type { GenerateBackstoryInput } from "../models/backstory.js";

export const BACKSTORY_PROMPT_VERSION = "v1";

export function buildBackstoryPrompt(input: GenerateBackstoryInput): {
  prompt: string;
  promptHash: string;
  promptVersion: string;
} {
  const prompt = [
    "You are a character backstory generator for a game-like setting.",
    "Generate a vivid but concise backstory in plain text.",
    "",
    "Character inputs:",
    `- Faction: ${input.faction}`,
    `- Class: ${input.class}`,
    `- Traits: ${input.traits.join(", ")}`,
    `- Additional context: ${input.contextInput ?? "(none)"}`,
    "",
    "Constraints:",
    "- 2-5 short paragraphs",
    "- Include a clear motivation and a past conflict",
    "- Avoid explicit violence or graphic content",
    "- Do not output JSON, only plain text"
  ].join("\n");

  const promptHash = crypto.createHash("sha256").update(prompt).digest("hex");
  return { prompt, promptHash, promptVersion: BACKSTORY_PROMPT_VERSION };
}

