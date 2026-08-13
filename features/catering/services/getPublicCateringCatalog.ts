import { connectToDatabase } from "@/lib/mongodb";

import CateringItem from "@/models/CateringItem";
import CateringPackage from "@/models/CateringPackage";

import type {
  PublicCateringCatalog,
  PublicCateringItem,
  PublicCateringPackage,
} from "../types/catering";

export async function getPublicCateringCatalog(): Promise<PublicCateringCatalog> {
  await connectToDatabase();

  const [
    cateringItems,
    cateringPackages,
  ] = await Promise.all([
    CateringItem.find({
      available: true,
    })
      .sort({
        displayOrder: 1,
        name: 1,
      })
      .lean(),

    CateringPackage.find({
      available: true,
    })
      .sort({
        displayOrder: 1,
        name: 1,
      })
      .lean(),
  ]);

  const items: PublicCateringItem[] =
    cateringItems.map((item) => ({
      id: item._id.toString(),

      name: item.name,
      slug: item.slug,

      description:
        item.description,

      image:
        item.image,

      price:
        item.price,

      pricingType:
        item.pricingType,

      category:
        item.category,

      minimumQuantity:
        item.minimumQuantity,
    }));

  const packages: PublicCateringPackage[] =
    cateringPackages.map(
      (cateringPackage) => ({
        id:
          cateringPackage._id.toString(),

        name:
          cateringPackage.name,

        slug:
          cateringPackage.slug,

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

        items:
          cateringPackage.items.map(
            (item) => ({
              name: item.name,
              quantity:
                item.quantity,
            })
          ),
      })
    );

  return {
    packages,
    items,
  };
}