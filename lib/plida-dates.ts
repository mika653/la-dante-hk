// PLIDA exam days now live in the shared `closures` table (see
// lib/closures-actions.ts) so every computer sees one list, instead of the old
// per-browser localStorage store. This file stays as the import path for the
// type, the seed, and the pure helper, defined in closures-shared.
export { PLIDA_DATES_SEED, plidaDateSet } from "@/lib/closures-shared";
export type { PlidaDate } from "@/lib/closures-shared";
