import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";

type CarDetail = {
  _id: string;
  name: string;
  make?: string;
  model?: string;
  year?: number;
  plate?: string;
  vin?: string;
  odometer?: number;
  notes?: string;
};

export default async function VehiclePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const car: CarDetail | null = await client.fetch(
    `*[_type == "car" && _id == $id][0]{
      _id, name, make, model, year, plate, vin, odometer, notes
    }`,
    { id }
  );

  if (!car) return notFound();

  const title =
    car.name || `${car.make ?? ""} ${car.model ?? ""}`.trim() || "Vehicle";

  return (
    <section className="mainContent">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-[color:var(--muted)]">Vehicle</p>
        <h1 className="heading text-left">{title}</h1>
        <p className="text-sm text-[color:var(--muted)]">
          {car.notes || "Service history, inspections and documents in one place."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href={`/vehicle/${car._id}/services`} className="buttonPrimary w-auto">
            Services
          </Link>
          <Link href={`/vehicle/${car._id}/todo`} className="button w-auto">
            To-do
          </Link>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold">Overview</div>
          <div className="mt-4 grid gap-3 text-sm text-[color:var(--muted)]">
            <div className="flex items-center justify-between">
              <span>Make</span>
              <span className="text-black">{car.make ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Model</span>
              <span className="text-black">{car.model ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Year</span>
              <span className="text-black">{car.year ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Plate</span>
              <span className="text-black">{car.plate ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>VIN</span>
              <span className="text-black">{car.vin ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Odometer (km)</span>
              <span className="text-black">
                {car.odometer ? car.odometer.toLocaleString("en-US") : "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[color:var(--border)] bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold">Actions</div>
          <div className="mt-4 grid gap-3">
            <Link href={`/vehicle/${car._id}/services`} className="button">
              Add service record
            </Link>
            <Link href={`/vehicle/${car._id}/todo`} className="button">
              Create a maintenance task
            </Link>
            <button className="button" type="button">
              Upload document
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[color:var(--border)] bg-white p-5 text-sm text-[color:var(--muted)]">
        Keep your invoices, inspection reports, and service history attached to this vehicle.
      </div>
    </section>
  );
}
