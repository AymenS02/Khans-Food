import React from 'react'
import Link from 'next/link'

const Footer = () => {

  return (
    <footer className="w-full border-t border-stone-200 bg-stone-50 px-6 py-8 text-stone-600">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {/* Clinic info */}
        <div className="space-y-1">
          <p className="font-semibold text-stone-800">Limeworth X-Ray & Ultrasound</p>
          <p className="text-sm">123 Limeworth Ave, Toronto, ON</p>
          <p className="text-sm">(416) 555-0134</p>
          <p className="text-sm">info@limeworthimaging.ca</p>
        </div>

        {/* Business hours */}
        <div className="space-y-1 text-sm">
          <p className="font-semibold text-stone-800">Hours</p>
          <div className="grid grid-cols-[auto_auto] gap-x-4">
            <span>Mon – Fri</span>
            <span className="text-right font-mono">8:00 AM – 6:00 PM</span>
            <span>Saturday</span>
            <span className="text-right font-mono">9:00 AM – 2:00 PM</span>
            <span>Sunday</span>
            <span className="text-right font-mono">Closed</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto mt-8 flex max-w-5xl items-center justify-between border-t border-stone-200 pt-4 text-xs text-stone-400">
        <span>&copy; {new Date().getFullYear()} Limeworth X-Ray & Ultrasound. All rights reserved.</span>

        {/* Secret admin access — a small unlabeled dot, easy to miss */}
        <Link href="/admin">
          <button
            type="button"
            aria-label=""
            className="h-2 w-2 rounded-full bg-stone-200 transition-colors hover:bg-teal-500"
          />
        </Link>
      </div>
    </footer>
  )
}

export default Footer