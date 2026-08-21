"use client";

import { useEffect } from "react";

export function useReloadOnPaymentPageRestore() {
  useEffect(() => {
    function handlePageShow(
      event: PageTransitionEvent
    ) {
      /*
       * If the browser restored this payment
       * page from its back/forward cache,
       * force a real reload.
       *
       * This makes the server re-check the
       * current Order + PaymentIntent instead
       * of resurrecting an old Stripe Element.
       */
      if (event.persisted) {
        window.location.reload();
      }
    }

    window.addEventListener(
      "pageshow",
      handlePageShow
    );

    return () => {
      window.removeEventListener(
        "pageshow",
        handlePageShow
      );
    };
  }, []);
}