import { Metadata } from "next";
import { Suspense } from "react";
import OnboardingPage from "./Onboarding";

export const metadata: Metadata = {
  title: "iExcelo - Onboarding",
};

export default function Page() {
  return (
    <Suspense>
      <OnboardingPage />
    </Suspense>
  );
}
