import { Metadata } from "next";
import { Suspense } from "react";
import SignUp from "./SignUp";

export const metadata: Metadata = {
  title: "iExcelo - Sign Up",
};

export default function Page() {
  return (
    <Suspense>
      <SignUp />
    </Suspense>
  );
}
