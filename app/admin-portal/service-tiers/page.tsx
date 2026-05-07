import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/actions/auth";
import { getAllServiceTiers } from "@/app/actions/service-tiers";
import ServiceTiersManager from "@/components/portal/admin/ServiceTiersManager";

export const metadata = { title: "Service Tiers — Terralume Admin Portal" };

export default async function ServiceTiersPage() {
  const user = await requireAdmin().catch(() => null);
  if (!user) redirect("/admin-login");

  const tiers = await getAllServiceTiers();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <ServiceTiersManager initialTiers={tiers} />
    </div>
  );
}
