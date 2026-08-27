"use server";

import { auth } from "@/auth";

import { connectToDatabase } from "@/lib/mongodb";

import CateringPackage from "@/models/CateringPackage";

export interface AdminCateringPackage {
  id: string;

  name: string;
  slug: string;

  description?: string;

  price: number;

  pricingType:
    | "flat"
    | "per_person";

  minimumGuests?: number;

  maximumGuests?: number;

  items: {
    cateringItem:
      string;

    name:
      string;

    quantity:
      number;
  }[];

  available: boolean;

  displayOrder: number;

  image?: string;
}

export async function getAdminCateringPackages(): Promise<
  AdminCateringPackage[]
> {
  const session =
    await auth();

  if (
    !session?.user ||
    session.user.role !==
      "admin"
  ) {
    throw new Error(
      "Unauthorized."
    );
  }

  await connectToDatabase();

  const packages =
    await CateringPackage.find({})
      .sort({
        displayOrder: 1,
        name: 1,
      })
      .lean();

  return packages.map(
    (pkg) => ({
      id:
        pkg._id.toString(),

      name:
        pkg.name,

      slug:
        pkg.slug,

      description:
        pkg.description,

      price:
        pkg.price,

      pricingType:
        pkg.pricingType,

      minimumGuests:
        pkg.minimumGuests,

      maximumGuests:
        pkg.maximumGuests,

      items:
        pkg.items.map(
          (item) => ({
            cateringItem:
              item.cateringItem.toString(),

            name:
              item.name,

            quantity:
              item.quantity,
          })
        ),

      available:
        pkg.available,

      displayOrder:
        pkg.displayOrder,

      image:
        pkg.image,
    })
  );
}