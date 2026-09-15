"use client";

import { useState } from "react";

interface CopyPaymentLinkProps {
  orderId: string;
  guestPaymentToken: string;
}

export default function CopyPaymentLink({
  orderId,
  guestPaymentToken,
}: CopyPaymentLinkProps) {
  const [copied, setCopied] =
    useState(false);

  const handleCopy = async () => {
    const paymentLink =
      `${window.location.origin}/catering/pay/${orderId}?token=${guestPaymentToken}`;

    try {
      await navigator.clipboard.writeText(
        paymentLink
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Could not copy payment link:",
        error
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="mt-2 rounded-xl border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-700 hover:text-white"
    >
      {copied
        ? "Link copied!"
        : "Copy payment link"}
    </button>
  );
}