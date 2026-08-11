import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { createCheckout } from "@/actions/checkout/createCheckout";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const session = await auth();

    const result = await createCheckout({
      ...body,
      customerId: session?.user?.id,
    });

    if (!result.success) {
      return NextResponse.json(result, {
        status: 400,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Checkout API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to process checkout.",
      },
      { status: 500 }
    );
  }
}