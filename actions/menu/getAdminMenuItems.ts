"use server";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import MenuItem from "@/models/MenuItem";
import Category from "@/models/Category";

export interface AdminMenuItem {
  id: string;

  name: string;
  slug: string;

  description?: string;

  price: number;

  category: {
    id: string;
    name: string;
  };

  available: boolean;

  displayOrder: number;
}

export async function getAdminMenuItems(): Promise<
  AdminMenuItem[]
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

  /*
   * Referencing Category here ensures its
   * Mongoose model is registered before
   * populate() runs.
   */
  void Category;

  const items =
    await MenuItem.find({})
      .populate(
        "categoryId",
        "name"
      )
      .sort({
        displayOrder: 1,
        name: 1,
      })
      .lean();

  return items.map(
    (item) => {
      const category =
        item.categoryId as unknown as {
          _id: {
            toString(): string;
          };

          name: string;
        };

      if (
        !category?._id ||
        !category.name
      ) {
        throw new Error(
          `Menu item "${item.name}" has an invalid category.`
        );
      }

      return {
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

        category: {
          id:
            category._id.toString(),

          name:
            category.name,
        },

        available:
          item.available,

        displayOrder:
          item.displayOrder,
      };
    }
  );
}