import { redirect } from "next/navigation";

// The Library page was removed from the Culture section (per Bill). Redirect any
// old links/bookmarks to the Culture page instead of 404ing.
export default function Library() {
  redirect("/culture");
}
