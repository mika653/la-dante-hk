import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdminFresh } from "@/lib/auth-guards";

// Client-side direct-to-Blob uploads. The browser uploads the file straight to
// Vercel Blob (bypassing the ~4.5 MB serverless request-body limit, so large
// PDFs/brochures work); this route only issues a short-lived, scoped token
// after checking the caller is a signed-in owner/manager. The DB row is written
// by recordMedia() once the upload resolves on the client.
const ALLOWED = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/avif",
  "application/pdf",
];

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        await requireAdminFresh(); // throws -> caught below -> 401
        return {
          allowedContentTypes: ALLOWED,
          maximumSizeInBytes: 25 * 1024 * 1024, // 25 MB
          addRandomSuffix: true,
        };
      },
      // Fired by Vercel Blob's servers in production; we record the row from the
      // client instead (works in local dev too), so this stays a no-op.
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 401 });
  }
}
