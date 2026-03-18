export function userPk(userId: string) {
  return `USER#${userId}`;
}

export const PROFILE_SK = "PROFILE";
export const BACKSTORY_FINAL_SK = "BACKSTORY_FINAL";

export function backstoryAttemptSk(attemptId: string) {
  return `BACKSTORY_ATTEMPT#${attemptId}`;
}

