// Plain constants shared by the registration form and its server action.
// Kept out of the "use server" file, which may only export async functions.

export const AGE_GROUPS = ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+"] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];
