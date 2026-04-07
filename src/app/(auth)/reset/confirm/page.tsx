import { Suspense } from "react";
import ConfirmReset from "./ConfirmReset";

export default function Page() {
  return (
    <Suspense>
      <ConfirmReset />
    </Suspense>
  );
}
