"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import styles from "./About.module.css";
import AboutArtwork from "./AboutArtworks";
import AboutBackground from "./AboutBackground";

const principles = [
  {
    title: "A little curious.",
    description:
      "“What happens if we try this?” is usually where it starts.",
  },
  {
    title: "A bit picky.",
    description:
      "If something feels off, I’ll probably keep messing with it.",
  },
  {
    title: "Hands on.",
    description:
      "I’d rather try the idea and see what happens than talk about it forever.",
  },
];

// Keep words together while animating each word separately.
function WordStaggerText({ as: Tag, text, className, kind }) {
  return (
    <Tag className={className} aria-label={text} data-stagger-text={kind}>
      {text.split(" ").map((word, index) => (
        <Fragment key={index}>
          {index > 0 ? " " : null}
          <span className={styles.wordClip} aria-hidden="true">
            <span data-stagger-word className={styles.staggerWord}>{word}</span>
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}

export default function About() {
  const principlesRef = useRef(null);

  useLayoutEffect(() => {
    const root = principlesRef.current;
    if (!root || !("IntersectionObserver" in window)) return;

    // Animation controls, in milliseconds.
    const duration = 500;
    const headingGap = 90;
    const paragraphGap = 45;
    const pause = 120;

    const items = Array.from(root.querySelectorAll("[data-principle]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let stopped = false;
    const animations = [];
    const waiting = new Map();
    const visible = new Map();

    items.forEach(item => {
      item.dataset.wordReady = "true";
      visible.set(item, new Promise(resolve => waiting.set(item, resolve)));
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        waiting.get(entry.target)?.();
        waiting.delete(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    async function revealText(element, gap, delay) {
      const words = Array.from(element.querySelectorAll("[data-stagger-word]"));
      const group = words.map((word, index) => {
        const animation = word.animate(
          [
            { transform: "translateY(115%)" },
            { transform: "translateY(0)" },
          ],
          {
            duration,
            delay: delay + index * gap,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "both",
          }
        );
        animations.push(animation);
        return animation.finished;
      });
      await Promise.all(group);
    }

    // All headings together, followed by all paragraphs together.
    async function runSequence() {
      try {
        if (!items.length) return;
        await visible.get(items[0]);
        if (stopped) return;
        await Promise.all(items.map(item =>
          revealText(item.querySelector('[data-stagger-text="heading"]'), headingGap, 0)
        ));
        if (stopped) return;
        await Promise.all(items.map(item =>
          revealText(item.querySelector('[data-stagger-text="paragraph"]'), paragraphGap, pause)
        ));
      } catch (error) {
        // Cancelling during cleanup rejects animation.finished.
        if (!stopped) stop();
      }
    }

    function stop() {
      stopped = true;
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      waiting.forEach(resolve => resolve());
      waiting.clear();
      items.forEach(item => delete item.dataset.wordReady);
    }

    function onMotionChange() {
      if (reducedMotion.matches) stop();
    }

    items.forEach(item => observer.observe(item));
    reducedMotion.addEventListener("change", onMotionChange);
    runSequence();

    return () => {
      stop();
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <section
      id="about"
      className={styles.about}
      aria-labelledby="about-title"
    >
      <AboutBackground />
      {/* Editorial introduction */}
      <div className={styles.introduction}>
        <h2 id="about-title" className={styles.heading}>
          <span>YOU DREAM IT UP.</span>
          <span className={styles.headingAccent}>
            I’LL WORK IT OUT<span className={styles.period}>.</span>
          </span>
        </h2>

        <p className={styles.description}>
          Hey, I’m <strong>Hammad.</strong> I design websites, build them,
          and care a little too much about the details. You don’t need
          to have it all figured out. Bring the rough idea—we’ll give
          it some character and make it work.
        </p>
      </div>

      {/* Personal working principles */}
      <ol ref={principlesRef} className={styles.principles}>
        {principles.map((principle, index) => (
          <li key={principle.title} data-principle className={styles.principle}>
            <span className={styles.number} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>

            <WordStaggerText
              as="h3" text={principle.title} className={styles.principleTitle} kind="heading"
            />

            <WordStaggerText
              as="p" text={principle.description} className={styles.principleDescription} kind="paragraph"
            />

            <AboutArtwork index={index} />
          </li>
        ))}
      </ol>
    </section>
  );
}
