import { redirect } from "next/navigation";
import StudentShell from "./StudentShell";

export const metadata = { title: "Student Portal — La Dante HK" };
// Evaluate the gate per request so the env flag takes effect on the next deploy.
export const dynamic = "force-dynamic";

// The student portal is still a mock (placeholder "Clara Chan" data, not wired to
// real sessions), so it's gated OFF for the demo/launch. Re-enable by setting the
// STUDENT_PORTAL=on environment variable in Vercel once it's built for real.
const STUDENT_PORTAL_ON = process.env.STUDENT_PORTAL === "on";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  if (!STUDENT_PORTAL_ON) redirect("/");
  return <StudentShell>{children}</StudentShell>;
}
