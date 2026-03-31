import Link from "next/link";

export default async function VehicleServicesPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return (
    <section className="mainContent">
      <h1 className="heading text-left">Services</h1>
      <p className="text-sm text-[color:var(--muted)]">
        Service history and costs for this vehicle.
      </p>
      <Link href={`/vehicle/${id}`} className="button w-fit">
        Back to vehicle
      </Link>
    </section>
  );
}
