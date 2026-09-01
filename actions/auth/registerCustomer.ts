"use server";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/services/password.service";
import { registerSchema, type RegisterInput } from "@/validators/auth.validator";

export interface RegisterCustomerResult {
  success: boolean;
  message: string;
  fieldErrors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    phone?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
}

export async function registerCustomer(input: RegisterInput): Promise<RegisterCustomerResult> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const firstName = parsed.data.firstName.trim();
  const lastName = parsed.data.lastName.trim();
  const email = parsed.data.email.trim().toLowerCase();
  const phone = parsed.data.phone?.trim() || undefined;

  await connectToDatabase();

  const existingUser = await User.findOne({ email }).select("_id").lean();

  if (existingUser) {
    return {
      success: false,
      message: "An account with this email already exists.",
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  try {
    await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: passwordHash,
      role: "customer",
      isActive: true,
      emailVerified: false,
    });

    return {
      success: true,
      message: "Account created successfully.",
    };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    console.error("Unable to register customer:", error);

    return {
      success: false,
      message: "Unable to create account right now.",
    };
  }
}

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === 11000;
}
