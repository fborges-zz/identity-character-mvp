import type { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

import type { BackstoryAttempt } from "../models/backstory.js";
import { nowIso } from "../utils/time.js";
import { BACKSTORY_FINAL_SK, backstoryAttemptSk, userPk } from "./keys.js";

type BackstoryAttemptItem = {
  PK: string;
  SK: string;
} & BackstoryAttempt;

type BackstoryFinalItem = {
  PK: string;
  SK: string;
  userId: string;
  text: string;
  updatedAt: string;
};

export class BackstoryRepository {
  constructor(
    private readonly ddb: DynamoDBDocumentClient,
    private readonly tableName: string
  ) {}

  async writeAttempt(attempt: BackstoryAttempt): Promise<void> {
    const item: BackstoryAttemptItem = {
      PK: userPk(attempt.userId),
      SK: backstoryAttemptSk(attempt.attemptId),
      ...attempt
    };
    await this.ddb.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item
      })
    );
  }

  async saveFinal(userId: string, text: string): Promise<{ updatedAt: string }> {
    const updatedAt = nowIso();
    const item: BackstoryFinalItem = {
      PK: userPk(userId),
      SK: BACKSTORY_FINAL_SK,
      userId,
      text,
      updatedAt
    };
    await this.ddb.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item
      })
    );
    return { updatedAt };
  }

  async updateProfileDraft(
    userId: string,
    draftText: string
  ): Promise<{ updatedAt: string }> {
    const updatedAt = nowIso();
    await this.ddb.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { PK: userPk(userId), SK: "PROFILE" },
        UpdateExpression:
          "SET #generatedBackstoryDraft = :draft, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#generatedBackstoryDraft": "generatedBackstoryDraft",
          "#updatedAt": "updatedAt"
        },
        ExpressionAttributeValues: {
          ":draft": draftText,
          ":updatedAt": updatedAt
        }
      })
    );
    return { updatedAt };
  }
}

