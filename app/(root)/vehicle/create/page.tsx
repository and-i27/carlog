"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCar } from "./action";

export default function CreateVehiclePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createCar(formData);

    if (!result.success) {
      setError(result.error);
      setSaving(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <section className="authPage">
      <section className="authSection">
        <div className="mb-6 text-2xl font-semibold text-black">Add vehicle</div>
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Name *</label>
            <input id="name" name="name" type="text" className="authInput" required />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="make">Make</label>
            <input id="make" name="make" type="text" className="authInput" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="model">Model</label>
            <input id="model" name="model" type="text" className="authInput" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="year">Year</label>
            <input id="year" name="year" type="number" className="authInput" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="plate">License plate</label>
            <input id="plate" name="plate" type="text" className="authInput" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="vin">VIN</label>
            <input id="vin" name="vin" type="text" className="authInput" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="odometer">Odometer (km)</label>
            <input id="odometer" name="odometer" type="number" className="authInput" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="image">Image</label>
            <input id="image" name="image" type="file" accept="image/*" className="authInput" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" rows={3} className="authInput" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button className="buttonPrimary" disabled={saving} type="submit">
            {saving ? "Saving..." : "Save vehicle"}
          </button>
        </form>
      </section>
    </section>
  );
}
