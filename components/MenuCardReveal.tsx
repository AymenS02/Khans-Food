"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MenuCardReveal({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        {
          x: "100vw",

          // makes it feel like it's rolling in
          rotate: index % 2 === 0 ? -18 : 18,
        },
        {
          x: 0,
          rotate: 0,
          duration: 2.0,
          delay: index * 0.12,
          ease: "power3.out",

          scrollTrigger: {
            trigger: card,
            start: "top 65%",
            once: true,
          },
        }
      );
    }, card);

    return () => ctx.revert();
  }, [index]);

  return <div ref={cardRef}>{children}</div>;
}