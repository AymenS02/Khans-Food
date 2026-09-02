"use client";

import { useEffect } from "react";

import { useCartStore } from "@/stores/cartStore";

export default function ClearCart() {
  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  useEffect(() => {
    /*
     * Only this component should be rendered
     * after the server/database confirms the
     * order has been successfully paid.
     */
    clearCart();

    /*
     * Clear checkout-specific session data so
     * the completed order cannot accidentally
     * be reused for another checkout.
     */
    sessionStorage.removeItem(
      "checkoutAttempt"
    );

    sessionStorage.removeItem(
      "checkoutPayment"
    );
  }, [clearCart]);

  return null;
}