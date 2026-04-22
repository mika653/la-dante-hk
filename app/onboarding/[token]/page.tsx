import OnboardingClient from "./OnboardingClient";

export const metadata = { title: "Welcome to La Dante HK — Onboarding" };

export default async function OnboardingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <OnboardingClient token={token} />;
}
