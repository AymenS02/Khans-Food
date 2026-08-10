"use server";

import { connectToDatabase } from "@/lib/mongodb";
import Menu from "@/models/Menu";

export async function getMenuItems() {
  await connectToDatabase();

  const items = await Menu.find({
    isAvailable: true,
  })
    .sort({
      category: 1,
      name: 1,
    })
    .lean();

  return JSON.parse(JSON.stringify(items));
}