export type UserProfile = {
  userId: string;
  faction: string;
  class: string;
  traits: string[];
  contextInput: string | null;
  generatedBackstoryDraft: string | null;
  finalBackstory: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProfileUpsertInput = {
  userId: string;
  faction: string;
  class: string;
  traits: string[];
  contextInput?: string | null;
};

