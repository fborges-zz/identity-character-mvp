export type BackstoryAttemptStatus = "SUCCEEDED" | "FAILED";

export type BackstoryAttemptInputSnapshot = {
  faction: string;
  class: string;
  traits: string[];
  contextInput: string | null;
};

export type BackstoryAttempt = {
  userId: string;
  attemptId: string;
  status: BackstoryAttemptStatus;
  model: string;
  promptVersion: string;
  promptHash?: string;
  input: BackstoryAttemptInputSnapshot;
  outputText: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  latencyMs: number;
  createdAt: string;
};

export type GenerateBackstoryInput = BackstoryAttemptInputSnapshot;

export type GeneratedBackstory = {
  text: string;
  model: string;
  promptVersion: string;
};

