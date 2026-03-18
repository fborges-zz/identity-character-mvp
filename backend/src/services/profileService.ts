import type { ProfileUpsertInput, UserProfile } from "../models/profile.js";
import type { ProfileRepository } from "../repositories/profileRepository.js";

export class ProfileService {
  constructor(private readonly repo: ProfileRepository) {}

  async upsert(input: ProfileUpsertInput): Promise<UserProfile> {
    return this.repo.upsert({
      userId: input.userId,
      faction: input.faction,
      class: input.class,
      traits: input.traits,
      contextInput: input.contextInput ?? null
    });
  }

  async getByUserId(userId: string): Promise<UserProfile | null> {
    return this.repo.getByUserId(userId);
  }
}

