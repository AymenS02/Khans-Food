"use server";

import { connectToDatabase } from "@/lib/mongodb";
import Menu from "@/models/MenuItem";

export async function getMenuItems() {
  await connectToDatabase();

  const items = await Menu.find({
    available: true,
  })
    .sort({
      category: 1,
      name: 1,
    })
    .lean();

  return JSON.parse(JSON.stringify(items));
}