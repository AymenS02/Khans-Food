"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import CateringItem from "@/models/CateringItem";

import { cateringItemSchema } from "@/features/catering/validators/cateringItemSchema";

import { createSlug } from "@/lib/utils/createSlug";

export interface UpdateCateringItemActionState {
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

export async function updateCateringItem(
  _previousState:
    UpdateCateringItemActionState,

  formData: FormData
): Promise<UpdateCateringItemActionState> {
  const session =
    await auth();

  if (
    !session?.user ||
    session.user.role !== "admin"
  ) {
    return {
      success: false,
      message:
        "You are not authorized to update catering items.",
    };
  }

  const cateringItemId =
    formData.get(
      "cateringItemId"
    );

  if (
    typeof cateringItemId !== "string" ||
    !Types.ObjectId.isValid(
      cateringItemId
    )
  ) {
    return {
      success: false,
      message:
        "Invalid catering item.",
    };
  }

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

  await connectToDatabase();

  const cateringItem =
    await CateringItem.findById(
      cateringItemId
    );

  if (!cateringItem) {
    return {
      success: false,
      message:
        "Catering item not found.",
    };
  }

  const duplicate =
    await CateringItem.findOne({
      slug,

      _id: {
        $ne:
          cateringItem._id,
      },
    })
      .select("_id")
      .lean();

  if (duplicate) {
    return {
      success: false,
      message:
        "Another catering item with this name already exists.",
    };
  }

  cateringItem.name =
    name;

  cateringItem.slug =
    slug;

  cateringItem.description =
    description ||
    undefined;

  cateringItem.price =
    price;

  cateringItem.pricingType =
    pricingType;

  cateringItem.category =
    category ||
    undefined;

  cateringItem.displayOrder =
    displayOrder;

  try {
    await cateringItem.save();
  } catch (error) {
    if (
      isDuplicateKeyError(
        error
      )
    ) {
      return {
        success: false,
        message:
          "Another catering item with this name already exists.",
      };
    }

    console.error(
      "Unable to update catering item:",
      error
    );

    return {
      success: false,
      message:
        "Unable to update catering item.",
    };
  }

  revalidateCatering();

  return {
    success: true,
    message:
      `${name} was updated successfully.`,
  };
}

function revalidateCatering() {
  revalidatePath(
    "/admin/catering/items"
  );

  revalidatePath(
    "/catering"
  );

  revalidatePath(
    "/catering/custom"
  );
}

function isDuplicateKeyError(
  error: unknown
): error is {
  code: number;
} {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (
      error as {
        code?: unknown;
      }
    ).code === 11000
  );
}