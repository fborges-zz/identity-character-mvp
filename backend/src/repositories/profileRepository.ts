import type { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

import type { UserProfile } from "../models/profile.js";
import { nowIso } from "../utils/time.js";
import { PROFILE_SK, userPk } from "./keys.js";

type ProfileItem = {
  PK: string;
  SK: string;
  userId: string;
  faction: string;
  class: string;
  traits: string[];
  contextInput: string | null;
  generatedBackstoryDraft?: string | null;
  finalBackstory?: string | null;
  createdAt: string;
  updatedAt: string;
};

function toProfile(item: ProfileItem): UserProfile {
  return {
    userId: item.userId,
    faction: item.faction,
    class: item.class,
    traits: item.traits,
    contextInput: item.contextInput ?? null,
    generatedBackstoryDraft: item.generatedBackstoryDraft ?? null,
    finalBackstory: item.finalBackstory ?? null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

export class ProfileRepository {
  constructor(
    private readonly ddb: DynamoDBDocumentClient,
    private readonly tableName: string
  ) {}

  async getByUserId(userId: string): Promise<UserProfile | null> {
    const res = await this.ddb.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { PK: userPk(userId), SK: PROFILE_SK }
      })
    );
    if (!res.Item) return null;
    return toProfile(res.Item as ProfileItem);
  }

  async upsert(input: {
    userId: string;
    faction: string;
    class: string;
    traits: string[];
    contextInput: string | null;
  }): Promise<UserProfile> {
    const existing = await this.getByUserId(input.userId);
    const now = nowIso();
    if (!existing) {
      const item: ProfileItem = {
        PK: userPk(input.userId),
        SK: PROFILE_SK,
        userId: input.userId,
        faction: input.faction,
        class: input.class,
        traits: input.traits,
        contextInput: input.contextInput,
        generatedBackstoryDraft: null,
        finalBackstory: null,
        createdAt: now,
        updatedAt: now
      };
      await this.ddb.send(
        new PutCommand({
          TableName: this.tableName,
          Item: item,
          ConditionExpression: "attribute_not_exists(PK)"
        })
      );
      return toProfile(item);
    }

    await this.ddb.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { PK: userPk(input.userId), SK: PROFILE_SK },
        UpdateExpression:
          "SET #faction = :faction, #class = :class, #traits = :traits, #contextInput = :contextInput, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#faction": "faction",
          "#class": "class",
          "#traits": "traits",
          "#contextInput": "contextInput",
          "#updatedAt": "updatedAt"
        },
        ExpressionAttributeValues: {
          ":faction": input.faction,
          ":class": input.class,
          ":traits": input.traits,
          ":contextInput": input.contextInput,
          ":updatedAt": now
        }
      })
    );

    const updated = await this.getByUserId(input.userId);
    if (!updated) {
      // Should be impossible; defensive.
      throw new Error("Profile upsert failed to read back profile");
    }
    return updated;
  }
}

