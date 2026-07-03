import type { Metadata } from "next";
import { Suspense } from "react";
import Password from "@/app/(dashboard)/student/settings/password/Password";

export const metadata: Metadata = { title: "Password & Security | iExcelo" };

export default function AffiliatePasswordPage() {
  return (
    <Suspense>
      <Password />
    </Suspense>
  );
}
