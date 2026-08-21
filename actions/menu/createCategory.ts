"use server";

import {
  revalidatePath,
} from "next/cache";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import Category from "@/models/Category";

import { categorySchema } from "@/features/menu/validators/categorySchema";

export interface CategoryActionState {
  success: boolean;

  message: string;

  fieldErrors?: {
    name?: string[];
  };
}

export async function createCategory(
  _previousState:
    CategoryActionState,

  formData: FormData
): Promise<CategoryActionState> {
  /*
   * ==========================================
   * 1. SECURITY
   * ==========================================
   *
   * The admin layout protecting the PAGE
   * is not enough.
   *
   * Server Actions must protect themselves.
   */

  const session =
    await auth();

  if (
    !session?.user ||
    session.user.role !==
      "admin"
  ) {
    return {
      success: false,
      message:
        "You are not authorized to create categories.",
    };
  }

  /*
   * ==========================================
   * 2. VALIDATE INPUT
   * ==========================================
   */

  const parsed =
    categorySchema.safeParse({
      name:
        formData.get(
          "name"
        ),
    });

  if (!parsed.success) {
    return {
      success: false,

      message:
        "Please fix the category information.",

      fieldErrors:
        parsed.error.flatten()
          .fieldErrors,
    };
  }

  const name =
    parsed.data.name;

  /*
   * ==========================================
   * 3. CREATE SLUG
   * ==========================================
   */

  const slug =
    createSlug(name);

  if (!slug) {
    return {
      success: false,
      message:
        "Unable to create a valid category slug.",
    };
  }

  await connectToDatabase();

  /*
   * ==========================================
   * 4. PREVENT DUPLICATES
   * ==========================================
   */

  const existingCategory =
    await Category.findOne({
      slug,
    })
      .select("_id")
      .lean();

  if (existingCategory) {
    return {
      success: false,

      message:
        "A category with this name already exists.",
    };
  }

  /*
   * ==========================================
   * 5. CREATE CATEGORY
   * ==========================================
   */

  try {
    await Category.create({
      name,
      slug,
    });
  } catch (error) {
    /*
     * Still handle duplicate-key errors.
     *
     * Why?
     *
     * Two requests could theoretically
     * pass findOne() at nearly the same
     * time.
     */

    if (
      isDuplicateKeyError(
        error
      )
    ) {
      return {
        success: false,

        message:
          "A category with this name already exists.",
      };
    }

    console.error(
      "Unable to create category:",
      error
    );

    return {
      success: false,

      message:
        "Unable to create category.",
    };
  }

  /*
   * ==========================================
   * 6. REFRESH RELEVANT PAGES
   * ==========================================
   */

  revalidatePath(
    "/admin/menu/categories"
  );

  revalidatePath(
    "/menu"
  );

  return {
    success: true,

    message:
      `${name} was created successfully.`,
  };
}

/*
 * ==========================================
 * HELPERS
 * ==========================================
 */

function createSlug(
  value: string
) {
  return value
    .trim()
    .toLowerCase()

    /*
     * Chicken & Rice
     *
     * becomes:
     *
     * chicken-rice
     */
    .replace(
      /['’]/g,
      ""
    )

    .replace(
      /[^a-z0-9]+/g,
      "-"
    )

    .replace(
      /^-+|-+$/g,
      ""
    );
}

function isDuplicateKeyError(
  error: unknown
): error is {
  code: number;
} {
  return (
    typeof error ===
      "object" &&
    error !== null &&
    "code" in error &&
    (
      error as {
        code?: unknown;
      }
    ).code === 11000
  );
}