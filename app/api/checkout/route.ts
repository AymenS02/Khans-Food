import { NextResponse } from "next/server";

import { createCheckout } from "@/actions/checkout/createCheckout";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const result =
      await createCheckout(body);

    if (!result.success) {
      return NextResponse.json(
        result,
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "Checkout API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to process checkout.",
      },
      { status: 500 }
    );
  }
}