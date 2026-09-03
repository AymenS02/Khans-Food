"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  const featureRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const titleElement = titleRef.current;
    if (!titleElement) return;

    const state = {
      characters: 0,
    };

    const animation = gsap.to(state, {
      characters: title.length,
      duration: 1,
      ease: "none",
      snap: {
        characters: 1,
      },

      onUpdate: () => {
        titleElement.textContent = title.slice(
          0,
          state.characters
        );
      },

      scrollTrigger: {
        trigger: featureRef.current,
        start: "top 80%",
        once: true,
      },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [title]);

  return (
    <div
      ref={featureRef}
      className="px-4 py-10 sm:px-7"
    >
      <p className="font-sans text-xs font-semibold text-primary">
        {number}
      </p>

      <div className="relative mt-3">
        {/* Invisible full title keeps layout stable */}
        <h3 className="invisible font-rye text-xl">
          {title}
        </h3>

        {/* GSAP types this over top */}
        <h3
          ref={titleRef}
          className="absolute inset-0 font-rye text-xl"
        />
      </div>

      <p className="mt-2 max-w-xs font-sans text-sm leading-6 text-background/55">
        {description}
      </p>
    </div>
  );
}

export default Feature;