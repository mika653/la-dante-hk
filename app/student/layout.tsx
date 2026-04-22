import StudentShell from "./StudentShell";

export const metadata = { title: "Student Portal — La Dante HK" };

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentShell>{children}</StudentShell>;
}
