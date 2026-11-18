import { redirect } from "next/navigation";

// The gift offer now routes straight to Contact (per Giulia) — the dedicated
// gift page is retired; anyone landing here is sent to the contact form.
export default function Gift() {
  redirect("/contact");
}
