"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

import { connectToDatabase } from "@/lib/mongodb";

import CateringItem from "@/models/CateringItem";

import { cateringItemSchema } from "@/features/catering/validators/cateringItemSchema";

import { createSlug } from "@/lib/utils/createSlug";

export interface CreateCateringItemActionState {
  success: boolean;

  message: string;

  fieldErrors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    pricingType?: string[];
    category?: string[];
    displayOrder?: string[];
  };
}

export async function createCateringItem(
  _previousState:
    CreateCateringItemActionState,

  formData: FormData
): Promise<CreateCateringItemActionState> {
  /*
   * ==========================================
   * 1. AUTHORIZATION
   * ==========================================
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
        "You are not authorized to create catering items.",
    };
  }

  /*
   * ==========================================
   * 2. VALIDATE INPUT
   * ==========================================
   */

  const parsed =
    cateringItemSchema.safeParse({
      name:
        formData.get("name"),

      description:
        formData.get(
          "description"
        ) || undefined,

      price:
        formData.get("price"),

      pricingType:
        formData.get(
          "pricingType"
        ),

      category:
        formData.get(
          "category"
        ) || undefined,

      displayOrder:
        formData.get(
          "displayOrder"
        ),
    });

  if (!parsed.success) {
    return {
      success: false,

      message:
        "Please fix the catering item information.",

      fieldErrors:
        parsed.error.flatten()
          .fieldErrors,
    };
  }

  const {
    name,
    description,
    price,
    pricingType,
    category,
    displayOrder,
  } = parsed.data;

  const slug =
    createSlug(name);

  if (!slug) {
    return {
      success: false,

      message:
        "Unable to create a valid catering item slug.",
    };
  }

  /*
   * ==========================================
   * 3. AVAILABILITY
   * ==========================================
   */

  const available =
    formData.get(
      "available"
    ) === "on";

  await connectToDatabase();

  /*
   * ==========================================
   * 4. DUPLICATE CHECK
   * ==========================================
   */

  const existingItem =
    await CateringItem.findOne({
      slug,
    })
      .select("_id")
      .lean();

  if (existingItem) {
    return {
      success: false,

      message:
        "A catering item with this name already exists.",
    };
  }

  /*
   * ==========================================
   * 5. CREATE
   * ==========================================
   */

  try {
    await CateringItem.create({
      name,
      slug,

      description:
        description ||
        undefined,

      price,

      pricingType,

      category:
        category ||
        undefined,

      available,

      displayOrder,
    });
  } catch (error) {
    if (
      isDuplicateKeyError(
        error
      )
    ) {
      return {
        success: false,

        message:
          "A catering item with this name already exists.",
      };
    }

    console.error(
      "Unable to create catering item:",
      error
    );

    return {
      success: false,

      message:
        "Unable to create catering item.",
    };
  }

  /*
   * ==========================================
   * 6. REFRESH
   * ==========================================
   */

  revalidatePath(
    "/admin/catering/items"
  );

  revalidatePath(
    "/catering"
  );

  revalidatePath(
    "/catering/custom"
  );

  return {
    success: true,

    message:
      `${name} was created successfully.`,
  };
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