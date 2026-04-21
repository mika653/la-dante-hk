export default function FrameCard({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return <div className={`frame ${className}`}>{children}</div>;
}
