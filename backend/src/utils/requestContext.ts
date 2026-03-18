import type { Request, Response } from "express";

export type RequestContext = {
  requestId: string;
  userId?: string;
};

const kContext = Symbol.for("identityCharacter.requestContext");

export function setRequestContext(req: Request, ctx: RequestContext) {
  (req as any)[kContext] = ctx;
}

export function getRequestContext(req: Request): RequestContext | undefined {
  return (req as any)[kContext] as RequestContext | undefined;
}

export function getRequestId(req: Request): string | undefined {
  return getRequestContext(req)?.requestId;
}

export function attachResponseContext(res: Response, ctx: RequestContext) {
  res.setHeader("x-request-id", ctx.requestId);
}

