// Holidays now live in the shared `closures` table (see lib/closures-actions.ts)
// so every computer sees one list, instead of the old per-browser localStorage
// store. This file stays as the import path for the type, the seed, and the pure
// scheduler helpers, which are defined storage-agnostically in closures-shared.
export { HK_HOLIDAYS_SEED, holidaySet, holidayNameMap } from "@/lib/closures-shared";
export type { Holiday } from "@/lib/closures-shared";
