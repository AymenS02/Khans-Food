"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollLine() {
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    const animation = gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, []);

  return (
    <svg
      viewBox="-600 100 1920 1080"      
      fill="none"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen text-secondary"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        ref={pathRef}
        d="M171.074 0.495728C171.074 0.495728 717.733 65.9129 673.074 256.996C628.415 448.079 -257.69 287.538 75.0737 602.996C407.837 918.454 612.635 1191.01 654.074 816.996C695.513 442.983 72.5735 795.996 201.074 1067C329.574 1338 942.574 1158.5 620.074 1364"
        stroke="currentColor"
        strokeWidth="40"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}