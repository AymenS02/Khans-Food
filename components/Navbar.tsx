'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const openHamburger = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed top-0 left-1/2 z-50 w-full -translate-x-1/2">
      <div className="relative mx-auto w-[90%] md:max-w-[70%] shadow-2xl">
        {/* Navbar */}
        <nav
          className={`rounded-b-[18px] bg-foreground text-white px-5 transition-all duration-300 ${
            isMenuOpen ? "h-100" : "h-16"
          }`}
        >
          {/* Top navbar */}
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden items-center gap-8 md:flex semi-bold text-lg">
              <Link href="/">Home</Link>
              <Link href="/menu">Menu</Link>
              <Link href="/catering">Catering</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>

            {/* Cart Icon */}
            <Link href="/cart" className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.22-5.45 1.22-5.45H6.28M7.5 14.25 5.106 5.272M7.5 17.25a1.5 1.5 0 1 1-3 0m12 0a1.5 1.5 0 1 1-3 0"
                />
              </svg>
            </Link>

            {/* Hamburger */}
            <button 
              onClick={openHamburger} 
              className="md:hidden flex h-8 w-6 flex-col justify-center gap-[5px]"
            >
              <span className="h-0.5 rounded-full bg-primary" />
              <span className="h-0.5 rounded-full bg-primary" />
              <span className="h-0.5 rounded-full bg-primary" />
            </button>

          </div>


          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-5 py-6 pl-10 text-2xl font-semibold">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>

              <Link href="/menu" onClick={() => setIsMenuOpen(false)}>
                Menu
              </Link>

              <Link href="/catering" onClick={() => setIsMenuOpen(false)}>
                Catering
              </Link>

              <Link href="/faq" onClick={() => setIsMenuOpen(false)}>
                FAQ
              </Link>

              <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>

              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>

              <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                Cart
              </Link>
            </div>
          </div>

        </nav>

        {/* LEFT OUTSIDE CORNER */}
        <svg
          viewBox="0 0 20 20"
          className="absolute top-0 -right-5 h-5 w-5 fill-foreground"
          preserveAspectRatio="none"
        >
          <path d="M0 0L20 0C8.954 0 0 8.954 0 20Z" />
        </svg>

        {/* RIGHT OUTSIDE CORNER */}
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