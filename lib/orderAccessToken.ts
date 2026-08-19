import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

function getOrderAccessSecret() {
  const secret =
    process.env.ORDER_ACCESS_SECRET;

  if (!secret) {
    throw new Error(
      "Missing ORDER_ACCESS_SECRET environment variable."
    );
  }

  return secret;
}

/*
 * =========================================================
 * REGULAR CHECKOUT SUCCESS TOKEN
 * =========================================================
 */

export function createOrderAccessToken(
  orderId: string,
  checkoutAttemptId: string
) {
  return createToken(
    `checkout-success:${orderId}:${checkoutAttemptId}`
  );
}

export function verifyOrderAccessToken(
  orderId: string,
  checkoutAttemptId: string,
  providedToken: string
) {
  return verifyToken(
    `checkout-success:${orderId}:${checkoutAttemptId}`,
    providedToken
  );
}

/*
 * =========================================================
 * GUEST CATERING PAYMENT TOKEN
 * =========================================================
 *
 * This token grants access to the payment flow for a
 * specific approved catering Order.
 *
 * It is intentionally separate from the regular checkout
 * success token even though both use the same server secret.
 */

export function createCateringPaymentAccessToken(
  orderId: string,
  cateringRequestId: string
) {
  return createToken(
    `catering-payment:${orderId}:${cateringRequestId}`
  );
}

export function verifyCateringPaymentAccessToken(
  orderId: string,
  cateringRequestId: string,
  providedToken: string
) {
  return verifyToken(
    `catering-payment:${orderId}:${cateringRequestId}`,
    providedToken
  );
}

/*
 * =========================================================
 * INTERNAL HELPERS
 * =========================================================
 */

function createToken(
  payload: string
) {
  return createHmac(
    "sha256",
    getOrderAccessSecret()
  )
    .update(payload)
    .digest("hex");
}

function verifyToken(
  payload: string,
  providedToken: string
) {
  /*
   * SHA-256 represented as hexadecimal is
   * always 64 characters.
   */
  if (
    !/^[a-f0-9]{64}$/i.test(
      providedToken
    )
  ) {
    return false;
  }

  const expectedToken =
    createToken(payload);

  const expectedBuffer =
    Buffer.from(
      expectedToken,
      "hex"
    );

  const providedBuffer =
    Buffer.from(
      providedToken,
      "hex"
    );

  if (
    expectedBuffer.length !==
    providedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    expectedBuffer,
    providedBuffer
  );
}