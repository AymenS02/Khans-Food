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
      .populate({
        path: "categoryId",
        select: "name",
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
      item.categoryId &&
      typeof item.categoryId === "object" &&
      "_id" in item.categoryId
        ? item.categoryId._id.toString()
        : item.categoryId.toString(),

    categoryName:
      item.categoryId &&
      typeof item.categoryId === "object" &&
      "name" in item.categoryId
        ? item.categoryId.name
        : undefined,

    available:
      item.available,

    displayOrder:
      item.displayOrder,
  }));
}