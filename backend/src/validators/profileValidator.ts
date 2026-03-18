import { z } from "zod";

function nonEmptyTrimmedMax(maxLen: number) {
  return z
    .string()
    .max(maxLen)
    .transform((s) => s.trim())
    .refine((s) => s.length > 0, "Required");
}

export const CreateProfileRequestSchema = z.object({
  userId: nonEmptyTrimmedMax(128),
  faction: nonEmptyTrimmedMax(64),
  class: nonEmptyTrimmedMax(64),
  traits: z
    .array(nonEmptyTrimmedMax(64))
    .min(1, "At least one trait is required")
    .max(20, "Too many traits"),
  contextInput: z
    .string()
    .max(2000, "contextInput too long")
    .transform((s) => s.trim())
    .optional()
    .nullable()
});

export type CreateProfileRequest = z.infer<typeof CreateProfileRequestSchema>;

