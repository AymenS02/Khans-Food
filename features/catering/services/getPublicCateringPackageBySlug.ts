import { connectToDatabase } from "@/lib/mongodb";
import CateringPackage from "@/models/CateringPackage";

import type { PublicCateringPackage } from "../types/catering";

export async function getPublicCateringPackageBySlug(
  slug: string
): Promise<PublicCateringPackage | null> {
  await connectToDatabase();

  const cateringPackage =
    await CateringPackage.findOne({
      slug,
      available: true,
    }).lean();

  if (!cateringPackage) {
    return null;
  }

  return {
    id: cateringPackage._id.toString(),

    name: cateringPackage.name,
    slug: cateringPackage.slug,

    description:
      cateringPackage.description,

    image:
      cateringPackage.image,

    price:
      cateringPackage.price,

    pricingType:
      cateringPackage.pricingType,

    minimumGuests:
      cateringPackage.minimumGuests,

    maximumGuests:
      cateringPackage.maximumGuests,

    items: cateringPackage.items.map(
      (item) => ({
        name: item.name,
        quantity: item.quantity,
      })
    ),
  };
}