import { redirect } from "next/navigation";

// The standalone Workshops landing page was folded into the Culture page
// (per Giulia). Redirect old links to the workshops section there.
export default function WorkshopsPage() {
  redirect("/zh/culture#workshops");
}
