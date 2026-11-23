// Workshop display settings, stored in site_config. Shared (no "use server").
export type WorkshopSettings = { homeLimit: number };
export const WORKSHOP_SETTINGS_KEY = "workshop-settings";
export const DEFAULT_WORKSHOP_SETTINGS: WorkshopSettings = { homeLimit: 4 };
