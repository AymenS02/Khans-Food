"use server";

import { connection } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";

import MenuItem from "@/models/MenuItem";

import type { MenuItem as MenuItemDTO } from "@/features/menu/types/menu";

export async function getMenuItems(): Promise<
  MenuItemDTO[]
> {
  await connection();
  await connectToDatabase();

  const items =
    await MenuItem.find({
      available: true,
    })
      .sort({
        displayOrder: 1,
        name: 1,
      })
      .lean();

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

    available:
      item.available,

    displayOrder:
      item.displayOrder,
  }));
}