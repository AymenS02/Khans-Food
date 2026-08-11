import {
  NextResponse,
} from "next/server";

import { auth } from "@/auth";

import { createCheckout } from "@/actions/checkout/createCheckout";

import { checkoutRequestSchema } from "@/features/checkout/validators/checkoutRequestSchema";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const parsed =
      checkoutRequestSchema.safeParse(
        body
      );

    if (!parsed.success) {
      console.error(
        "Invalid checkout request:",
        parsed.error.issues
      );

      return NextResponse.json(
        {
          success: false,
          error:
            parsed.error.issues[0]
              ?.message ??
            "Invalid checkout information.",
        },
        {
          status: 400,
        }
      );
    }

    const session =
      await auth();

    const result =
      await createCheckout({
        ...parsed.data,

        customerId:
          session?.user?.id,
      });

    if (!result.success) {
      return NextResponse.json(
        result,
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      result
    );
  } catch (error) {
    console.error(
      "Checkout API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to process checkout.",
      },
      {
        status: 500,
      }
    );
  }
}