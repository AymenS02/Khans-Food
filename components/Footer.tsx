import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/catering", label: "Catering" },
  { href: "/contact", label: "Contact" },
  { href: "/account", label: "Account" },
  { href: "/faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/10 bg-foreground text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-12">
        <div>
          <p className="text-2xl font-bold">Khans Food</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/75">
            Fresh pickup meals and dependable catering packages for offices, events, and family gatherings.
          </p>
          <Link
            href="/catering"
            className="mt-5 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Plan Catering
          </Link>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/70">Navigate</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/85 transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/70">Need help?</h2>
          <p className="mt-4 text-sm leading-6 text-white/75">
            Questions about pickup times, catering requests, or payments?
          </p>
          <Link href="/faq" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
            Read FAQ →
          </Link>
          <Link href="/contact" className="mt-2 block text-sm font-semibold text-primary hover:underline">
            Contact us →
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-4 text-center text-xs text-white/60 sm:px-8 lg:px-12">
        © {new Date().getFullYear()} Khans Food. All rights reserved.
      </div>
    </footer>
  );
}
