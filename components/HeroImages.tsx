"use client";

import {
  useLayoutEffect,
  useRef,
} from "react";

import Image from "next/image";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(
  ScrollTrigger
);

interface HeroImagesProps {
  variant:
    | "mobile"
    | "desktop";
}

export default function HeroImages({
  variant,
}: HeroImagesProps) {
  const containerRef =
    useRef<HTMLDivElement>(
      null
    );

  const hero1Ref =
    useRef<HTMLDivElement>(
      null
    );

  const hero2Ref =
    useRef<HTMLDivElement>(
      null
    );

  const hero3Ref =
    useRef<HTMLDivElement>(
      null
    );

  useLayoutEffect(() => {
    const ctx =
      gsap.context(() => {
        gsap.to(
          hero1Ref.current,
          {
            y: -190,
            ease: "none",

            scrollTrigger: {
              trigger:
                containerRef.current,

              start:
                "top 50%",

              end:
                "bottom top",

              scrub: true,
            },
          }
        );

        gsap.to(
          hero2Ref.current,
          {
            y: -190,
            ease: "none",

            scrollTrigger: {
              trigger:
                containerRef.current,

              start:
                "top 50%",

              end:
                "bottom top",

              scrub: true,
            },
          }
        );

        gsap.to(
          hero3Ref.current,
          {
            y: -190,
            ease: "none",

            scrollTrigger: {
              trigger:
                containerRef.current,

              start:
                "top 50%",

              end:
                "bottom top",

              scrub: true,
            },
          }
        );
      }, containerRef);

    return () =>
      ctx.revert();
  }, []);

  /* =============================================
     MOBILE
  ============================================= */

  if (
    variant === "mobile"
  ) {
    return (
      <div
        ref={containerRef}
        className="flex w-full items-end justify-center"
      >
        {/* LEFT IMAGE */}

        <div
          ref={hero1Ref}
          className="relative z-0 -mb-6 -mr-6 w-1/3 transform-gpu will-change-transform"
        >
          <div className="relative rotate-[-17deg]">
            {/* Stable mobile shadow */}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[5%] left-1/2 -z-10 h-[28%] w-[90%] -translate-x-1/2 rounded-full bg-black/55 blur-lg"
            />

            <Image
              src="/hero.png"
              alt="Catering food"
              width={300}
              height={300}
              className="relative block h-auto w-full object-contain"
            />
          </div>
        </div>

        {/* CENTER IMAGE */}

        <div
          ref={hero2Ref}
          className="relative z-10 w-1/3 transform-gpu will-change-transform"
        >
          <div className="relative">
            {/* Stable mobile shadow */}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[5%] left-1/2 -z-10 h-[28%] w-[90%] -translate-x-1/2 rounded-full bg-black/55 blur-lg"
            />

            <Image
              src="/hero2.png"
              alt="Catering food"
              width={300}
              height={300}
              className="relative block h-auto w-full object-contain"
            />
          </div>
        </div>

        {/* RIGHT IMAGE */}

        <div
          ref={hero3Ref}
          className="relative z-0 -mb-6 -ml-6 w-1/3 transform-gpu will-change-transform"
        >
          <div className="relative rotate-[17deg]">
            {/* Stable mobile shadow */}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[5%] left-1/2 -z-10 h-[28%] w-[90%] -translate-x-1/2 rounded-full bg-black/55 blur-lg"
            />

            <Image
              src="/hero3.png"
              alt="Catering food"
              width={300}
              height={300}
              className="relative block h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>
    );
  }

  /* =============================================
     DESKTOP
  ============================================= */

  return (
    <div
      ref={containerRef}
      className="relative w-[800px]"
    >
      {/* MAIN IMAGE */}

      <div
        ref={hero1Ref}
        className="relative z-0 transform-gpu will-change-transform"
      >
        <Image
          src="/hero.png"
          alt="Hero Image"
          width={800}
          height={400}
          className="block w-full rounded-full border-4 border-secondary bg-primary drop-shadow-[0_0_25px_rgba(0,0,0,0.5)]"
        />
      </div>

      {/* TOP OVERLAY */}

      <div
        ref={hero2Ref}
        className="absolute -left-4 -top-10 z-10 w-[38%] transform-gpu will-change-transform"
      >
        <Image
          src="/hero2.png"
          alt="Catering food"
          width={300}
          height={300}
          className="block w-full rotate-[-10deg] rounded-full border-4 border-secondary bg-primary object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.4)]"
        />
      </div>

      {/* BOTTOM / RIGHT OVERLAY */}

      <div
        ref={hero3Ref}
        className="absolute bottom-6 right-[-3rem] z-20 w-[35%] transform-gpu will-change-transform"
      >
        <Image
          src="/hero3.png"
          alt="Catering food"
          width={300}
          height={300}
          className="block w-full rotate-[17deg] rounded-full border-4 border-secondary bg-primary object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.4)]"
        />
      </div>
    </div>
  );
}