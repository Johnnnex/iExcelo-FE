import type { Metadata } from "next";
import { Suspense } from "react";
import Password from "./Password";

export const metadata: Metadata = { title: "Password & Security | iExcelo" };

export default function PasswordPage() {
  return (
    <Suspense>
      <Password />
    </Suspense>
  );
}
