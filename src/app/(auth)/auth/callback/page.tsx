import { Metadata } from "next";
import { Suspense } from "react";
import AuthCallbackPage from "./Callback";

export const metadata: Metadata = {
  title: "iExcelo - Finishing sign in...",
};

export default function Page() {
  return (
    <Suspense>
      <AuthCallbackPage />
    </Suspense>
  );
}
