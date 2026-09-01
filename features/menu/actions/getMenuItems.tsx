"use server";

import { connection } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";

import MenuItem from "@/models/MenuItem";
import Category from "@/models/Category";

import type { MenuItem as MenuItemDTO } from "@/features/menu/types/menu";

export async function getMenuItems(): Promise<
  MenuItemDTO[]
> {
  await connection();
  await connectToDatabase();

  const [items, categories] =
    await Promise.all([
      MenuItem.find({
        available: true,
      })
        .sort({
          displayOrder: 1,
          name: 1,
        })
        .lean(),
      Category.find({
        isActive: true,
      })
        .select({
          _id: 1,
          name: 1,
        })
        .lean(),
    ]);

  const categoryNameById = new Map(
    categories.map((category) => [
      category._id.toString(),
      category.name,
    ])
  );

  return items.map((item) => ({
    _id:
      item._id.toString(),

    name:
      item.name,

    slug:
      item.slug,

    description:
      item.description,

    price:
      item.price,

    image:
      item.image,

    categoryId:
      item.categoryId.toString(),

    categoryName:
      categoryNameById.get(
        item.categoryId.toString()
      ),

    available:
      item.available,

    displayOrder:
      item.displayOrder,
  }));
}