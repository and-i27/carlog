import Link from "next/link";

export default async function VehicleTodoPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return (
    <section className="mainContent">
      <h1 className="heading text-left">To-do</h1>
      <p className="text-sm text-[color:var(--muted)]">
        Upcoming tasks and reminders for this vehicle.
      </p>
      <Link href={`/vehicle/${id}`} className="button w-fit">
        Back to vehicle
      </Link>
    </section>
  );
}
