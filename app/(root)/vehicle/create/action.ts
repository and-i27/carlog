"use server";

import { auth } from "@/auth";
import { serverClient } from "@/sanity/lib/serverClient";

export type CreateCarResult = { success: boolean; error: string | null };

export async function createCar(formData: FormData): Promise<CreateCarResult> {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
      return { success: false, error: "You must be logged in." };
    }

    const name = String(formData.get("name") || "").trim();
    const make = String(formData.get("make") || "").trim();
    const model = String(formData.get("model") || "").trim();
    const yearRaw = String(formData.get("year") || "").trim();
    const plate = String(formData.get("plate") || "").trim();
    const vin = String(formData.get("vin") || "").trim();
    const odometerRaw = String(formData.get("odometer") || "").trim();
    const notes = String(formData.get("notes") || "").trim();
    const imageFile = formData.get("image");

    if (!name) {
      return { success: false, error: "Name is required." };
    }

    const year = yearRaw ? Number(yearRaw) : undefined;
    const odometer = odometerRaw ? Number(odometerRaw) : undefined;

    let user = await serverClient.fetch(
      `*[_type == "user" && email == $email][0]{ _id }`,
      { email }
    );

    if (!user?._id) {
      const created = await serverClient.create({
        _type: "user",
        name: session?.user?.name ?? "User",
        email,
        provider: "system",
      });
      user = { _id: created._id };
    }

    let imageRef: { _type: "image"; asset: { _type: "reference"; _ref: string } } | undefined;
    if (imageFile instanceof File && imageFile.size > 0) {
      const asset = await serverClient.assets.upload("image", imageFile, {
        filename: imageFile.name,
      });
      imageRef = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
    }

    await serverClient.create({
      _type: "car",
      name,
      owner: { _type: "reference", _ref: user._id },
      make: make || undefined,
      model: model || undefined,
      year: Number.isFinite(year) ? year : undefined,
      plate: plate || undefined,
      vin: vin || undefined,
      odometer: Number.isFinite(odometer) ? odometer : undefined,
      notes: notes || undefined,
      image: imageRef,
    });

    return { success: true, error: null };
  } catch (err) {
    console.error("CREATE CAR ERROR:", err);
    return { success: false, error: "Failed to create vehicle." };
  }
}
