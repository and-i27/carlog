import Link from "next/link";
import { client } from "@/sanity/lib/client";

type CarListItem = {
  _id: string;
  name: string;
  make?: string;
  model?: string;
  year?: number;
  plate?: string;
  notes?: string;
};

export default async function DashboardPage() {
  const cars: CarListItem[] = await client.fetch(
    `*[_type == "car"] | order(_createdAt desc)[0...12]{
      _id, name, make, model, year, plate, notes
    }`
  );

  return (
    <section className="mainContent">
      <h1 className="heading">Welcome Back</h1>
      <p className="text-sm text-[color:var(--muted)]">
        Quick overview of your vehicles and recent activity.
      </p>

      {cars.length === 0 ? (
        <div className="rounded-lg border border-[color:var(--border)] bg-white p-6 text-sm text-[color:var(--muted)]">
          No vehicles yet. Add your first vehicle to start tracking services and
          costs.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((vehicle) => (
            <Link
              key={vehicle._id}
              href={`/vehicle/${vehicle._id}`}
              className="rounded-lg border border-[color:var(--border)] bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 h-32 w-full rounded-md border border-dashed border-[color:var(--border)] bg-gray-50" />
              <div className="text-base font-semibold">
                {vehicle.name || `${vehicle.make ?? ""} ${vehicle.model ?? ""}`.trim()}
              </div>
              <div className="mt-2 text-sm text-[color:var(--muted)]">
                {vehicle.year ? `${vehicle.year} - ` : ""}
                {vehicle.plate ?? "No plate"}
                {vehicle.notes ? ` - ${vehicle.notes}` : ""}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold">Upcoming tasks</div>
          <div className="mt-4 grid gap-3 text-sm text-[color:var(--muted)]">
            <div className="flex items-center justify-between">
              <span>Oil change - Audi A4</span>
              <span className="text-black">In 1,200 km</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Brake check - Skoda Octavia</span>
              <span className="text-black">Next week</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Inspection - BMW 320d</span>
              <span className="text-black">May 2026</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[color:var(--border)] bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold">Recent services</div>
          <div className="mt-4 grid gap-3 text-sm text-[color:var(--muted)]">
            <div className="flex items-center justify-between">
              <span>Brake pads - Renault Clio</span>
              <span className="text-black">EUR 180</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Winter tires - Volkswagen Golf</span>
              <span className="text-black">EUR 420</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Oil & filter - Audi A4</span>
              <span className="text-black">EUR 95</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[color:var(--border)] bg-white p-5 text-sm text-[color:var(--muted)]">
        Scroll down for more insights and upcoming maintenance reminders.
      </div>
    </section>
  );
}
