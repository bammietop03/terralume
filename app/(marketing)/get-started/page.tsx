import GetStartedClient from "./getStartedClient";

export default async function GetStartedPage({
  searchParams,
}: {
  searchParams: Promise<{ service: string }>;
}) {
  const { service } = await searchParams;
  return (
    <GetStartedClient service={service as "real-estate" | "renewable-energy"} />
  );
}