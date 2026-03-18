import { z } from "zod";

const EnvSchema = z.object({
  AWS_REGION: z.string().optional(),
  DDB_TABLE_NAME: z.string().min(1, "DDB_TABLE_NAME is required"),
  BEDROCK_MODEL_ID: z.string().min(1, "BEDROCK_MODEL_ID is required"),
  LOG_LEVEL: z.string().optional(),
  PORT: z.string().optional()
});

export type Env = z.infer<typeof EnvSchema>;

export function readEnv(rawEnv: NodeJS.ProcessEnv = process.env): Env {
  return EnvSchema.parse(rawEnv);
}

