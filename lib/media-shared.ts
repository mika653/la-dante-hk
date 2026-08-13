// Small pure helpers shared by the Media Library page and the MediaPicker.
// (Kept out of media-actions.ts because that's a "use server" file.)

export function isImage(contentType: string | null | undefined): boolean {
  return !!contentType && contentType.startsWith("image/");
}

export function fmtSize(bytes: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export type MediaKind = "all" | "image" | "document";
