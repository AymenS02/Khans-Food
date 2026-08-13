import { connectToDatabase } from "@/lib/mongodb";
import CateringItem from "@/models/CateringItem";

import type { PublicCateringItem } from "../types/catering";

export async function getPublicCateringItems(): Promise<
  PublicCateringItem[]
> {
  await connectToDatabase();

  const cateringItems =
    await CateringItem.find({
      available: true,
    })
      .sort({
        displayOrder: 1,
        name: 1,
      })
      .lean();

  return cateringItems.map((item) => ({
    id: item._id.toString(),

    name: item.name,
    slug: item.slug,

    description: item.description,
    image: item.image,

    price: item.price,
    pricingType: item.pricingType,

    category: item.category,

    minimumQuantity:
      item.minimumQuantity,
  }));
}