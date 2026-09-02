"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import { signOut } from "next-auth/react";

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useCartStore } from "@/stores/cartStore";

interface NavbarProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

export default function Navbar({
  isLoggedIn,
  isAdmin,
}: NavbarProps) {
  const [
    isMenuOpen,
    setIsMenuOpen,
  ] = useState(false);

  const [
    isCartAnimating,
    setIsCartAnimating,
  ] = useState(false);

  const prefersReducedMotion =
    usePrefersReducedMotion();

  const items =
    useCartStore(
      (state) => state.items
    );

  const totalItems =
    items.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  const previousTotalRef =
    useRef(totalItems);

  useEffect(() => {
    if (
      totalItems >
        previousTotalRef.current &&
      !prefersReducedMotion
    ) {
      setIsCartAnimating(
        true
      );

      const timeout =
        window.setTimeout(
          () => {
            setIsCartAnimating(
              false
            );
          },
          320
        );

      return () => {
        window.clearTimeout(
          timeout
        );
      };
    }

    previousTotalRef.current =
      totalItems;
  }, [
    totalItems,
    prefersReducedMotion,
  ]);

  useEffect(() => {
    previousTotalRef.current =
      totalItems;
  }, [totalItems]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut =
    async () => {
      closeMenu();

      await signOut({
        callbackUrl: "/",
      });
    };

  return (
    <div className="fixed left-1/2 top-0 z-50 w-full -translate-x-1/2">
      <div className="relative mx-auto w-[94%] shadow-2xl md:w-fit">
        {/* =========================================
            NAVBAR
        ========================================= */}

        <nav className="rounded-b-[18px] border-x border-b border-background/10 bg-foreground px-4 font-sans text-background transition-all duration-300 sm:px-5">
          <div className="flex h-16 items-center justify-between gap-5 sm:gap-10 md:gap-14">
            {/* =====================================
                BRAND
            ===================================== */}

            <Link
              href="/"
              onClick={
                closeMenu
              }
              className="group flex shrink-0 items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            >
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-background/10">
                <Image
                  src="/logo.png"
                  alt="Khans Food"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
            </Link>

            {/* =====================================
                DESKTOP NAVIGATION
            ===================================== */}

            <div className="hidden items-center gap-6 md:flex lg:gap-7">
              <NavLink href="/">
                Home
              </NavLink>

              <NavLink href="/menu">
                Menu
              </NavLink>

              <NavLink href="/catering">
                Catering
              </NavLink>

              <NavLink href="/faq">
                FAQ
              </NavLink>

              <NavLink href="/contact">
                Contact
              </NavLink>

              {!isLoggedIn && (
                <NavLink href="/login">
                  Login
                </NavLink>
              )}

              {isLoggedIn && (
                <NavLink href="/account">
                  Account
                </NavLink>
              )}

              {isAdmin && (
                <NavLink href="/admin">
                  Admin
                </NavLink>
              )}

              {isLoggedIn && (
                <button
                  type="button"
                  onClick={
                    handleSignOut
                  }
                  className="cursor-pointer whitespace-nowrap font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-background/65 outline-none transition hover:text-primary focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  Logout
                </button>
              )}
            </div>

            {/* =====================================
                ACTIONS
            ===================================== */}

            <div className="flex shrink-0 items-center gap-3">
              {/* CART */}

              <Link
                href="/cart"
                aria-label={`Cart, ${totalItems} item${
                  totalItems === 1
                    ? ""
                    : "s"
                }`}
                className={`relative inline-flex min-h-10 items-center gap-2 rounded-full border border-background/20 px-3 py-1.5 font-sans text-background outline-none transition duration-200 hover:border-primary/50 hover:bg-background/[0.06] focus-visible:ring-2 focus-visible:ring-primary/70 ${
                  isCartAnimating
                    ? "scale-110"
                    : "scale-100"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={
                    1.7
                  }
                  stroke="currentColor"
                  aria-hidden="true"
                  className="h-[18px] w-[18px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.22-5.45 1.22-5.45H6.28M7.5 14.25 5.106 5.272M7.5 17.25a1.5 1.5 0 1 1-3 0m12 0a1.5 1.5 0 1 1-3 0"
                  />
                </svg>

                <span className="hidden text-[11px] font-semibold uppercase tracking-[0.1em] sm:inline">
                  Cart
                </span>

                {totalItems > 0 && (
                  <span
                    className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-center text-[10px] font-bold leading-none text-white transition ${
                      isCartAnimating
                        ? "scale-125"
                        : "scale-100"
                    }`}
                  >
                    {
                      totalItems
                    }
                  </span>
                )}
              </Link>

              {/* MOBILE MENU BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setIsMenuOpen(
                    (open) =>
                      !open
                  )
                }
                aria-expanded={
                  isMenuOpen
                }
                aria-controls="mobile-navigation"
                aria-label={
                  isMenuOpen
                    ? "Close menu"
                    : "Open menu"
                }
                className="flex h-10 w-10 items-center justify-center border border-background/20 outline-none transition hover:border-primary/50 hover:bg-background/[0.06] focus-visible:ring-2 focus-visible:ring-primary/70 md:hidden"
              >
                <span className="sr-only">
                  {isMenuOpen
                    ? "Close menu"
                    : "Open menu"}
                </span>

                <span className="relative block h-4 w-5">
                  <span
                    className={`absolute left-0 top-0 h-px w-5 bg-primary transition duration-300 ${
                      isMenuOpen
                        ? "translate-y-[7px] rotate-45"
                        : ""
                    }`}
                  />

                  <span
                    className={`absolute left-0 top-[7px] h-px w-5 bg-primary transition duration-300 ${
                      isMenuOpen
                        ? "opacity-0"
                        : "opacity-100"
                    }`}
                  />

                  <span
                    className={`absolute bottom-0 left-0 h-px w-5 bg-primary transition duration-300 ${
                      isMenuOpen
                        ? "-translate-y-[8px] -rotate-45"
                        : ""
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>

          {/* =====================================
              MOBILE NAVIGATION
          ===================================== */}

          <div
            id="mobile-navigation"
            className={`overflow-hidden transition-all duration-300 md:hidden ${
              isMenuOpen
                ? "max-h-[650px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-background/15 pb-5 pt-3">
              <MobileNavLink
                number="01"
                href="/"
                onClick={
                  closeMenu
                }
              >
                Home
              </MobileNavLink>

              <MobileNavLink
                number="02"
                href="/menu"
                onClick={
                  closeMenu
                }
              >
                Menu
              </MobileNavLink>

              <MobileNavLink
                number="03"
                href="/catering"
                onClick={
                  closeMenu
                }
              >
                Catering
              </MobileNavLink>

              <MobileNavLink
                number="04"
                href="/faq"
                onClick={
                  closeMenu
                }
              >
                FAQ
              </MobileNavLink>

              <MobileNavLink
                number="05"
                href="/contact"
                onClick={
                  closeMenu
                }
              >
                Contact
              </MobileNavLink>

              {!isLoggedIn && (
                <MobileNavLink
                  number="06"
                  href="/login"
                  onClick={
                    closeMenu
                  }
                >
                  Login
                </MobileNavLink>
              )}

              {isLoggedIn && (
                <MobileNavLink
                  number="06"
                  href="/account"
                  onClick={
                    closeMenu
                  }
                >
                  Account
                </MobileNavLink>
              )}

              {isAdmin && (
                <MobileNavLink
                  number="07"
                  href="/admin"
                  onClick={
                    closeMenu
                  }
                >
                  Admin
                </MobileNavLink>
              )}

              {isLoggedIn && (
                <button
                  type="button"
                  onClick={
                    handleSignOut
                  }
                  className="group flex min-h-12 w-full items-center border-b border-background/10 px-1 font-sans outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <span className="w-9 shrink-0 text-[9px] font-bold text-primary">
                    {isAdmin
                      ? "08"
                      : "07"}
                  </span>

                  <span className="text-xs font-semibold uppercase tracking-[0.13em] text-background/75 transition group-hover:text-primary">
                    Logout
                  </span>

                  <span className="ml-auto text-background/25 transition group-hover:text-primary">
                    →
                  </span>
                </button>
              )}

              <Link
                href="/cart"
                onClick={
                  closeMenu
                }
                className="mt-5 flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white"
              >
                <span>
                  View Cart
                </span>

                <span className="flex items-center gap-3">
                  {totalItems > 0 && (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-center text-[10px] font-bold leading-none text-primary">
                      {
                        totalItems
                      }
                    </span>
                  )}

                  <span>
                    →
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </nav>

        {/* =========================================
            RIGHT CURVE
        ========================================= */}

        <svg
          viewBox="0 0 20 20"
          className="pointer-events-none absolute -right-[19px] top-0 block h-5 w-5 fill-foreground"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 0L20 0C8.954 0 0 8.954 0 20Z" />
        </svg>

        {/* =========================================
            LEFT CURVE
        ========================================= */}

        <svg
          viewBox="0 0 20 20"
          className="pointer-events-none absolute -left-[19px] top-0 block h-5 w-5 -scale-x-100 fill-foreground"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 0L20 0C8.954 0 0 8.954 0 20Z" />
        </svg>
      </div>
    </div>
  );
}

/* =============================================
   DESKTOP NAV LINK
============================================= */

function NavLink({
  href,
  children,
}: {
  href: string;
  children:
    React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative whitespace-nowrap font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-background/65 outline-none transition after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:text-background hover:after:w-full focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      {children}
    </Link>
  );
}

/* =============================================
   MOBILE NAV LINK
============================================= */

function MobileNavLink({
  number,
  href,
  onClick,
  children,
}: {
  number: string;
  href: string;
  onClick: () => void;
  children:
    React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex min-h-12 items-center border-b border-background/10 px-1 font-sans outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      <span className="w-9 shrink-0 text-[9px] font-bold text-primary">
        {number}
      </span>

      <span className="text-xs font-semibold uppercase tracking-[0.13em] text-background/75 transition group-hover:text-primary">
        {children}
      </span>

      <span className="ml-auto text-background/25 transition-transform group-hover:translate-x-1 group-hover:text-primary">
        →
      </span>
    </Link>
  );
}