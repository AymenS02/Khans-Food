"use server";

import { auth } from "@/auth";

import { connectToDatabase } from "@/lib/mongodb";

import Category from "@/models/Category";

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
}

export async function getAdminCategories(): Promise<
  AdminCategory[]
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

  const categories =
    await Category.find({})
      .sort({
        name: 1,
      })
      .lean();

  return categories.map(
    (category) => ({
      id:
        category._id.toString(),

      name:
        category.name,

      slug:
        category.slug,
    })
  );
}