"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";

import { useCartStore } from "@/stores/cartStore";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

interface NavbarProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

export default function Navbar({ isLoggedIn, isAdmin }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  const prefersReducedMotion = usePrefersReducedMotion();

  const items = useCartStore((state) => state.items);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const previousTotalRef = useRef(totalItems);

  useEffect(() => {
    if (totalItems > previousTotalRef.current && !prefersReducedMotion) {
      setIsCartAnimating(true);

      const timeout = window.setTimeout(() => {
        setIsCartAnimating(false);
      }, 320);

      return () => {
        window.clearTimeout(timeout);
      };
    }

    previousTotalRef.current = totalItems;
  }, [totalItems, prefersReducedMotion]);

  useEffect(() => {
    previousTotalRef.current = totalItems;
  }, [totalItems]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    closeMenu();

    await signOut({
      callbackUrl: "/",
    });
  };

  return (
    <div className="fixed top-0 left-1/2 z-50 w-full -translate-x-1/2">
      <div className="relative mx-auto w-[92%] shadow-2xl md:w-fit">
        <nav className="rounded-b-[18px] bg-foreground px-5 text-white transition-all duration-300">
          <div className="flex h-16 items-center justify-between gap-6 sm:gap-16">
            <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
              <Image src="/logo.png" alt="Khans Food" width={34} height={34} className="rounded-lg" />
              <span className="hidden text-sm font-semibold uppercase tracking-[0.15em] sm:inline">
                Khans Food
              </span>
            </Link>

            <div className="hidden items-center gap-7 text-base font-semibold md:flex">
              <Link href="/">Home</Link>
              <Link href="/menu">Menu</Link>
              <Link href="/catering">Catering</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/contact">Contact</Link>

              {!isLoggedIn && <Link href="/login">Login</Link>}
              {!isLoggedIn && <Link href="/register">Create Account</Link>}
              {isLoggedIn && <Link href="/account">Account</Link>}
              {isAdmin && <Link href="/admin">Admin</Link>}

              {isLoggedIn && (
                <button type="button" onClick={handleSignOut} className="cursor-pointer">
                  Logout
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/cart"
                className={`relative inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 font-semibold text-white transition ${
                  isCartAnimating ? "scale-110" : "scale-100"
                }`}
                aria-label={`Cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.22-5.45 1.22-5.45H6.28M7.5 14.25 5.106 5.272M7.5 17.25a1.5 1.5 0 1 1-3 0m12 0a1.5 1.5 0 1 1-3 0"
                  />
                </svg>
                <span className="hidden text-sm sm:inline">Cart</span>
                <span
                  className={`inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-bold text-white transition ${
                    isCartAnimating ? "scale-125" : "scale-100"
                  }`}
                >
                  {totalItems}
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="flex h-8 w-6 flex-col justify-center gap-[5px] md:hidden"
              >
                <span className="h-0.5 rounded-full bg-primary" />
                <span className="h-0.5 rounded-full bg-primary" />
                <span className="h-0.5 rounded-full bg-primary" />
              </button>
            </div>
          </div>

          <div
            id="mobile-navigation"
            className={`overflow-hidden transition-all duration-300 md:hidden ${
              isMenuOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-4 py-6 pl-2 text-lg font-semibold">
              <Link href="/" onClick={closeMenu}>Home</Link>
              <Link href="/menu" onClick={closeMenu}>Menu</Link>
              <Link href="/catering" onClick={closeMenu}>Catering</Link>
              <Link href="/faq" onClick={closeMenu}>FAQ</Link>
              <Link href="/contact" onClick={closeMenu}>Contact</Link>
              <Link href="/cart" onClick={closeMenu}>Cart ({totalItems})</Link>

              {!isLoggedIn && <Link href="/login" onClick={closeMenu}>Login</Link>}
              {!isLoggedIn && <Link href="/register" onClick={closeMenu}>Create Account</Link>}
              {isLoggedIn && <Link href="/account" onClick={closeMenu}>Account</Link>}
              {isAdmin && <Link href="/admin" onClick={closeMenu}>Admin</Link>}

              {isLoggedIn && (
                <button type="button" onClick={handleSignOut} className="w-fit text-left">
                  Logout
                </button>
              )}
            </div>
          </div>
        </nav>

        <svg viewBox="0 0 20 20" className="absolute top-0 -right-5 h-5 w-5 fill-foreground" preserveAspectRatio="none">
          <path d="M0 0L20 0C8.954 0 0 8.954 0 20Z" />
        </svg>

        <svg
          viewBox="0 0 20 20"
          className="absolute top-0 -left-5 h-5 w-5 -scale-x-100 fill-foreground"
          preserveAspectRatio="none"
        >
          <path d="M0 0L20 0C8.954 0 0 8.954 0 20Z" />
        </svg>
      </div>
    </div>
  );
}
