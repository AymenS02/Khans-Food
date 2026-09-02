"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HeroImagesProps {
  variant: "mobile" | "desktop";
}

export default function HeroImages({ variant }: HeroImagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const hero1Ref = useRef<HTMLDivElement>(null);
  const hero2Ref = useRef<HTMLDivElement>(null);
  const hero3Ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // First image
      gsap.to(hero1Ref.current, {
        y: -190,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 50%",
          end: "bottom top",
          scrub: true,
        },
      });

      // Second image
      gsap.to(hero2Ref.current, {
        y: -190,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 50%",
          end: "bottom top",
          scrub: true,
        },
      });

      // Third image
      gsap.to(hero3Ref.current, {
        y: -190,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 50%",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (variant === "mobile") {
    return (
      <div
        ref={containerRef}
        className="flex w-full items-end justify-center"
      >
        <div
          ref={hero1Ref}
          className="relative z-0 -mb-6 -mr-6 w-1/3"
        >
          <Image
            src="/hero.png"
            alt="Catering food"
            width={300}
            height={300}
            className="w-full rotate-[-17deg] object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.4)]"
          />
        </div>

        <div
          ref={hero2Ref}
          className="relative z-10 w-1/3"
        >
          <Image
            src="/hero2.png"
            alt="Catering food"
            width={300}
            height={300}
            className="w-full object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.4)]"
          />
        </div>

        <div
          ref={hero3Ref}
          className="relative z-0 -mb-6 -ml-6 w-1/3"
        >
          <Image
            src="/hero3.png"
            alt="Catering food"
            width={300}
            height={300}
            className="w-full rotate-[17deg] object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.4)]"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-[800px]"
    >
      {/* Main image */}
      <div ref={hero1Ref} className="relative z-0">
        <Image
          src="/hero.png"
          alt="Hero Image"
          width={800}
          height={400}
          className="w-full rounded-full border-4 border-secondary bg-primary drop-shadow-[0_0_25px_rgba(0,0,0,0.5)]"
        />
      </div>

      {/* Top overlay */}
      <div
        ref={hero2Ref}
        className="absolute -top-10 -left-4 z-10 w-[38%]"
      >
        <Image
          src="/hero2.png"
          alt="Catering food"
          width={300}
          height={300}
          className="w-full rotate-[-10deg] rounded-full border-4 border-secondary bg-primary object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.4)]"
        />
      </div>

      {/* Bottom/right overlay */}
      <div
        ref={hero3Ref}
        className="absolute right-[-3rem] bottom-6 z-20 w-[35%]"
      >
        <Image
          src="/hero3.png"
          alt="Catering food"
          width={300}
          height={300}
          className="w-full rotate-[17deg] rounded-full border-4 border-secondary bg-primary object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.4)]"
        />
      </div>
    </div>
  );
}