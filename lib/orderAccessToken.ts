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

export function createOrderAccessToken(
  orderId: string,
  checkoutAttemptId: string
) {
  return createHmac(
    "sha256",
    getOrderAccessSecret()
  )
    .update(
      `${orderId}:${checkoutAttemptId}`
    )
    .digest("hex");
}

export function verifyOrderAccessToken(
  orderId: string,
  checkoutAttemptId: string,
  providedToken: string
) {
  /*
   * SHA-256 represented as hex should
   * always be exactly 64 hex characters.
   */
  if (
    !/^[a-f0-9]{64}$/i.test(
      providedToken
    )
  ) {
    return false;
  }

  const expectedToken =
    createOrderAccessToken(
      orderId,
      checkoutAttemptId
    );

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