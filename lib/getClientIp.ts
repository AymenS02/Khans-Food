import {
  headers,
} from "next/headers";

export async function getClientIp() {
  const headerStore =
    await headers();

  /*
   * Prefer Vercel's explicit forwarding
   * header when deployed there.
   */
  const vercelForwardedFor =
    headerStore.get(
      "x-vercel-forwarded-for"
    );

  if (vercelForwardedFor) {
    return vercelForwardedFor
      .split(",")[0]
      .trim();
  }

  /*
   * Standard fallback.
   */
  const forwardedFor =
    headerStore.get(
      "x-forwarded-for"
    );

  if (forwardedFor) {
    return forwardedFor
      .split(",")[0]
      .trim();
  }

  const realIp =
    headerStore.get(
      "x-real-ip"
    );

  if (realIp) {
    return realIp.trim();
  }

  /*
   * Local development normally doesn't
   * provide a public client IP.
   */
  return "local-development";
}