import { redirect } from "next/navigation";
import { requireClient } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import FirstLoginForm from "@/components/portal/client/FirstLoginForm";

export default async function FirstLoginPage() {
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  // If already onboarded, go straight to dashboard
  if (user.onboardingComplete) redirect("/client-portal/dashboard");

  // Fetch latest enquiry for brief review
  const enquiry = await prisma.enquiry.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <FirstLoginForm
      userId={user.id}
      userName={user.fullName}
      brief={enquiry?.brief ?? null}
      transactionType={enquiry?.transactionType ?? null}
    />
  );
}
