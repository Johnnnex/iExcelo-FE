import { Metadata } from "next";
import { Suspense } from "react";
import ActivateAccount from "./ActivateAccount";

export const metadata: Metadata = {
  title: "iExcelo - Activate Your Account",
};

export default function Page() {
  return (
    <Suspense>
      <ActivateAccount />
    </Suspense>
  );
}
