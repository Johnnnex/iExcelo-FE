import { Metadata } from "next";
import { Suspense } from "react";
import VerifyGiveback from "./VerifyGiveback";

export const metadata: Metadata = {
  title: "iExcelo - Sponsor | Verifying Payment",
};

export default function VerifyGivebackPage() {
  return (
    <Suspense>
      <VerifyGiveback />
    </Suspense>
  );
}
