"use client";

import { useState } from "react";
import { createVehicleService } from "@/app/(root)/vehicle/[id]/services/action";

type AddVehicleServiceFormProps = {
  carId: string;
  currentOdometer?: number;
};

export default function AddVehicleServiceForm({
  carId,
  currentOdometer,
}: AddVehicleServiceFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;

    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const odometerRaw = String(formData.get("odometer") || "").trim();
    const odometer = odometerRaw ? Number(odometerRaw) : undefined;

    if (
      typeof currentOdometer === "number" &&
      Number.isFinite(odometer) &&
      typeof odometer === "number" &&
      odometer < currentOdometer
    ) {
      const confirmed = window.confirm(
        `Vnesli ste manj kilometrov (${odometer}) kot jih ima vozilo trenutno (${currentOdometer}). Ali res želite nadaljevati?`
      );

      if (!confirmed) {
        return;
      }
    }

    setSaving(true);

    const result = await createVehicleService(carId, formData);

    if (!result.success) {
      setError(result.error);
      setSaving(false);
      return;
    }

    if (result.redirectTo) {
      window.location.assign(result.redirectTo);
      return;
    }

    setSaving(false);
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="serviceType">Service type</label>
          <select id="serviceType" name="serviceType" className="authInput" defaultValue="regular">
            <option value="regular">Redni servis</option>
            <option value="extraordinary">Izredni servis</option>
            <option value="small">Mali servis</option>
            <option value="major">Veliki servis</option>
            <option value="repair">Popravilo</option>
            <option value="other">Drugo</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="date">Date</label>
          <input id="date" name="date" type="datetime-local" className="authInput" required />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="title">Service title</label>
          <input id="title" name="title" type="text" className="authInput" required />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={3} className="authInput" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="odometer">Odometer (km)</label>
          <input id="odometer" name="odometer" type="number" className="authInput" />
          {typeof currentOdometer === "number" && (
            <p className="text-xs text-[color:var(--muted)]">
              Trenutno vozilo: {currentOdometer.toLocaleString("sl-SI")} km
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cost">Cost</label>
          <input id="cost" name="cost" type="number" step="0.01" className="authInput" />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="currency">Currency</label>
          <input id="currency" name="currency" type="text" className="authInput" defaultValue="EUR" />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button className="buttonPrimary w-auto px-6" disabled={saving} type="submit">
          {saving ? "Saving..." : "Add service"}
        </button>
      </div>
    </form>
  );
}
