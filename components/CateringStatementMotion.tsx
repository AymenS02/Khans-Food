// components/CateringStatementMotion.tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CateringStatementMotion({
  children,
}: {
  children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
        },
      });

      tl.from("[data-catering-eyebrow]", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power3.out",
      })

        .from(
          "[data-catering-heading-line]",
          {
            yPercent: 120,
            duration: 0.8,
            stagger: 0.1,
            ease: "power4.out",
          },
          "-=0.2"
        )

        .from(
          "[data-catering-divider]",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.35"
        )

        .from(
          "[data-catering-diamond]",
          {
            opacity: 0,
            scale: 0,
            rotate: -90,
            duration: 0.4,
            ease: "back.out(2)",
          },
          "-=0.3"
        )

        .from(
          "[data-catering-copy]",
          {
            opacity: 0,
            y: 25,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.2"
        )

        .from(
          "[data-catering-button]",
          {
            opacity: 0,
            y: 20,
            scale: 0.96,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.25"
        )

        .from(
          "[data-occasion-card]",
          {
            opacity: 0,
            scale: 0.88,
            rotate: (index) =>
              index % 2 === 0
                ? -4
                : 4,
            y: 35,
            stagger: {
              each: 0.1,
              from: "start",
            },
            duration: 0.65,
            ease: "back.out(1.4)",
          },
          "-=0.6"
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef}>
      {children}
    </div>
  );
}