import pino from "pino";

export type Logger = ReturnType<typeof createLogger>;

export function createLogger() {
  const level = process.env.LOG_LEVEL ?? "info";
  return pino({
    level,
    base: undefined
  });
}

