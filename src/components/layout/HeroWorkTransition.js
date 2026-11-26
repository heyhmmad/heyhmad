"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./HeroWorkTransition.module.css";

function setupHeroWorkTransition(root) {
  if (!root) return;

  const hero = root.querySelector("#home");
  const work = root.querySelector("#work");
  const content = root.querySelector("[data-hero-content]");
  const portrait = content?.querySelector("img");

  if (!hero || !work || !content || !portrait) return;

  gsap.registerPlugin(ScrollTrigger);

  const media = gsap.matchMedia();

  media.add(
    {
      desktop: "(min-width: 1025px) and (min-height: 700px)",
      motion: "(prefers-reduced-motion: no-preference)",
    },
    ({ conditions }) => {
      if (!conditions.motion) return;

      if (conditions.desktop) {
        // Hold Hero while Work rises over it.
        const handoff = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "hero-work-handoff",
            trigger: hero,
            start: "top top",
            end: () => `+=${hero.offsetHeight}`,
            pin: hero,
            pinSpacing: false,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        handoff.to(
          portrait,
          { opacity: 0, y: -18, duration: 0.35 },
          0
        );

        handoff.to(content, { opacity: 0, duration: 1 }, 0);
      } else {
        // Keep normal touch scrolling.
        gsap.to(portrait, {
          opacity: 0,
          y: -12,
          ease: "none",
          scrollTrigger: {
            id: "hero-work-mobile-handoff",
            trigger: hero,
            start: "bottom 25%",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }
    }
  );

  return () => {
    media.revert();
  };
}

export default function HeroWorkTransition({ children }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => setupHeroWorkTransition(rootRef.current), []);

  return (
    <div ref={rootRef} className={styles.flow}>
      {children}
    </div>
  );
}