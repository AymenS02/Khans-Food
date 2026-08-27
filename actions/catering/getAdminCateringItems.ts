"use server";

import { auth } from "@/auth";

import { connectToDatabase } from "@/lib/mongodb";

import CateringItem from "@/models/CateringItem";

export interface AdminCateringItem {
  id: string;

  name: string;
  slug: string;

  description?: string;

  price: number;

  pricingType:
    | "flat"
    | "per_person";

  category?: string;

  available: boolean;

  displayOrder: number;

  image?: string;
}

export async function getAdminCateringItems(): Promise<
  AdminCateringItem[]
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

  const items =
    await CateringItem.find({})
      .sort({
        displayOrder: 1,
        name: 1,
      })
      .lean();

  return items.map(
    (item) => ({
      id:
        item._id.toString(),

      name:
        item.name,

      slug:
        item.slug,

      description:
        item.description,

      price:
        item.price,

      pricingType:
        item.pricingType,

      category:
        item.category,

      available:
        item.available,

      displayOrder:
        item.displayOrder,

      image:
        item.image,
    })
  );
}