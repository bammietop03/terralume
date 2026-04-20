import { Suspense } from "react";
import ResetPasswordPageClient from "./ResetPasswordPageClient";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordPageClient />
    </Suspense>
  );
}
