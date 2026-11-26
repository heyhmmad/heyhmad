"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./Expertise.module.css";

const expertise = [
  {
    title: "Full-Stack Development",
    lines: ["Full-Stack", "Development"],
    description: "The part you see, the stuff behind it. I build the whole thing.",
    details: ["Frontend", "Backend", "API integration", "Databases"],
  },
  {
    title: "Web Design & UI/UX",
    lines: ["Web Design", "& UI/UX"],
    description: "A website that feels like you—and makes sense to the people using it.",
    details: ["Visual direction", "Interface design", "Prototypes", "Responsive layouts"],
  },
  {
    title: "Shopify Development",
    lines: ["Shopify", "Development"],
    description: "A store with its own character, built to let your products stand out.",
    details: ["Liquid", "Custom sections", "Theme customization", "Storefronts"],
  },
  {
    title: "Creative Frontend Development",
    lines: ["Creative Frontend", "Development"],
    description: "The scroll, the transitions, the little details that give your website personality.",
    details: ["Scroll experiences", "Typography", "Motion", "Microinteractions"],
  },
];

function AssembleHeading() {
  const headingRef = useRef(null);

  useLayoutEffect(() => {
    const heading = headingRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!heading || reduced.matches) return;
    // Easy controls: milliseconds for the movement and gap between letters.
    const duration = 1100;
    const stagger = 22;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [1, -1], [-1, 1]];
    const letters = Array.from(heading.querySelectorAll("[data-heading-letter]"));
    const animations = letters.map((letter, index) => {
      const [x, y] = directions[index % directions.length];
      const distance = Math.min(150, heading.clientWidth * 0.24);
      const animation = letter.animate([
        { transform: `translate(${x * distance}px, ${y * 80}px) rotate(${(index % 2 ? 1 : -1) * 24}deg)`, opacity: 0 },
        { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
      ], {
        duration,
        delay: index * stagger,
        easing: "cubic-bezier(.16, 1, .3, 1)",
        fill: "both",
      });
      animation.pause();
      animation.currentTime = 0;
      animation.onfinish = () => animation.cancel();
      return animation;
    });
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.6)) return;
      animations.forEach(animation => animation.play());
      observer.disconnect();
    }, { threshold: 0.6 });
    observer.observe(heading);
    function onMotionChange() {
      if (!reduced.matches) return;
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
    }
    reduced.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", onMotionChange);
      animations.forEach(animation => animation.cancel());
    };
  }, []);

  return (
    <h2 ref={headingRef} id="expertise-title" className={styles.heading} aria-label="What I bring to the table.">
      {["WHAT I BRING", "TO THE TABLE."].map((line, lineIndex) => (
        <span key={line} className={lineIndex ? styles.headingAccentLine : styles.headingLine} aria-hidden="true">
          {line.split(" ").map((word, wordIndex) => (
            <span className={styles.headingWord} key={word}>
              {wordIndex > 0 ? "\u00a0" : null}
              {Array.from(word).map((letter, index) => (
                <span key={index} className={styles.headingLetter} data-heading-letter>{letter}</span>
              ))}
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
}

// A small paper-cut pine: two triangle tiers and a trunk. `s` scales it.
function Pine({ x, y, s = 1 }) {
  return (
    <path
      d={`M${x} ${y - 120 * s}L${x - 26 * s} ${y - 60 * s}H${x + 26 * s}Z M${x} ${y - 82 * s}L${x - 34 * s} ${y - 12 * s}H${x + 34 * s}Z M${x - 4 * s} ${y - 12 * s}H${x + 4 * s}V${y + 4 * s}H${x - 4 * s}Z`}
    />
  );
}

// Layered paper-cut dusk landscape. Every <g data-art-layer> moves a little with
// the scroll progress: data-art-x / data-art-y = pixels travelled from start to end.
// Paths run past the bottom edge (y = 1000) so moving layers never expose a gap.
function ExpertiseArt() {
  const hillStroke = { stroke: "#F0F8FF", strokeOpacity: 0.4, strokeWidth: 3 };
  return (
    <div className={styles.art} aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" focusable="false">
        <defs>
          <linearGradient id="expertise-sky" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#C2E4FB" />
            <stop offset="62%" stopColor="#CDEBFF" />
          </linearGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#expertise-sky)" />

        <g data-art-layer data-art-y="-50">
          <circle cx="1180" cy="230" r="330" fill="#B6DDF7" opacity="0.22" />
          <circle cx="1180" cy="230" r="250" fill="#B6DDF7" opacity="0.38" />
          <circle cx="1180" cy="230" r="160" fill="#579ECB" />
        </g>

        <g data-art-layer data-art-x="90" fill="#FAFDFF">
          <rect x="800" y="140" width="190" height="40" rx="20" />
          <circle cx="835" cy="140" r="28" />
          <circle cx="878" cy="130" r="36" />
          <rect x="620" y="117" width="120" height="26" rx="13" />
          <circle cx="648" cy="117" r="18" />
          <circle cx="680" cy="112" r="22" />
        </g>

        <g data-art-layer data-art-x="-70" fill="#FAFDFF">
          <rect x="1380" y="80" width="170" height="38" rx="19" />
          <circle cx="1415" cy="80" r="28" />
          <circle cx="1458" cy="72" r="34" />
        </g>

        <g data-art-layer data-art-x="120" data-art-y="-30" fill="none" stroke="#42799D" strokeWidth="3" strokeLinecap="round">
          <path d="M940 270q12-14 24 0q12-14 24 0" />
          <path d="M1010 238q10-12 20 0q10-12 20 0" />
          <path d="M1330 320q12-14 24 0q12-14 24 0" />
        </g>

        <g data-art-layer data-art-y="-10">
          <path
            d="M0 440L150 340L300 410L470 300L650 420L840 330L1010 415L1200 320L1400 400L1600 340V1000H0Z"
            fill="#B6DDF7"
            {...hillStroke}
          />
        </g>

        <g data-art-layer data-art-y="-18">
          <path
            d="M0 470C200 410 400 460 600 430C820 396 1050 380 1300 430C1450 455 1530 440 1600 430V1000H0Z"
            fill="#80BAE9"
            {...hillStroke}
          />
        </g>

        <g data-art-layer data-art-y="-28">
          <path
            d="M0 560C220 500 440 550 680 515C900 485 1120 520 1340 510C1470 505 1540 520 1600 525V1000H0Z"
            fill="#579ECB"
            {...hillStroke}
          />
          <g fill="#42799D">
            <Pine x={38} y={610} />
            <Pine x={104} y={620} s={0.8} />
            <Pine x={1536} y={600} />
            <Pine x={1580} y={612} s={0.85} />
          </g>
        </g>

        <g data-art-layer data-art-y="-40">
          <path
            d="M0 650C240 600 480 640 720 612C960 585 1200 625 1420 610C1500 604 1560 612 1600 615V1000H0Z"
            fill="#42799D"
            {...hillStroke}
          />
          <g fill="#2F5979">
            <Pine x={24} y={715} s={1.2} />
            <Pine x={92} y={730} s={0.9} />
            <Pine x={1552} y={712} s={1.2} />
            <Pine x={1500} y={726} s={0.85} />
          </g>
        </g>

        <g data-art-layer data-art-y="-54">
          <path
            d="M0 740C260 700 540 735 800 715C1060 695 1320 730 1600 712V1000H0Z"
            fill="#2F5979"
            {...hillStroke}
          />
        </g>
      </svg>
    </div>
  );
}

// Ringed medallion for the card back: tick ring, rose ring, cream ring, sun diamond.
// It stays perfectly round at every card size.
function Medallion() {
  return (
    <svg className={styles.medallion} viewBox="-43 -43 86 86" focusable="false">
      <circle r="43" fill="#2F5979" />
      <circle r="41" fill="#FAFDFF" />
      <circle r="35" fill="none" stroke="#236EA8" strokeWidth="7" strokeDasharray="1.6 2.4" />
      <circle r="29" fill="#96C7E9" />
      <circle r="24" fill="#FAFDFF" />
      <circle r="20" fill="none" stroke="#236EA8" strokeWidth="1.5" />
      <path d="M0 -15L15 0L0 15L-15 0Z" fill="#579ECB" stroke="#236EA8" strokeWidth="1.5" />
      <circle r="5" fill="#236EA8" />
    </svg>
  );
}

export default function Expertise() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const stage = root.querySelector("[data-fan-stage]");
    const deck = root.querySelector("[data-fan-deck]");
    const cards = Array.from(root.querySelectorAll("[data-fan-card]"));
    const turns = cards.map(card => card.querySelector("[data-card-turn]"));
    const artLayers = Array.from(root.querySelectorAll("[data-art-layer]"));
    const desktop = window.matchMedia("(min-width: 1280px) and (min-height: 820px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Main controls. No wheel interception or artificial page scrolling.
    const scrollLength = 2.4;
    const smoothing = 85; // milliseconds
    const floatHeight = 25; // pixels up and down
    const floatDuration = 3; // seconds per float cycle
    const floatDelay = 0.25; // seconds between neighbouring cards
    const fanSpacing = 1; // 1 = full card width plus the normal gap
    const fanTilt = 8; // outer cards tilt by 12 degrees
    const flipStart = 0.44; // flip directly from the fully scattered pose
    const readingHold = 0.20; // extra scroll after the LAST card finishes
    const flipStagger = 0.08; // scroll delay between cards
    const flipDuration = 0.60; // scroll distance for each card's turn
    // Extend the scene when duration or stagger increases; never cut a flip short.
    const timelineLength = Math.max(
      1,
      flipStart + (cards.length - 1) * flipStagger + flipDuration + readingHold
    );
    const middle = (cards.length - 1) / 2;
    const clamp = value => Math.max(0, Math.min(1, value));
    const ease = value => {
      const t = clamp(value);
      return t * t * t * (t * (t * 6 - 15) + 10);
    };
    const mix = (from, to, progress) => from + (to - from) * progress;
    const current = cards.map(() => 0);

    let frame = 0;
    let lastTime = 0;
    let needsMeasure = true;
    let initialized = false;
    let isDesktop = false;
    let top = 0;
    let distance = 1;
    let width = 0;
    let gap = 18;
    let sceneHeight = 0;
    let floatTime = 0;
    let artProgress = -1;

    function clearTransforms() {
      cards.forEach(card => card.style.removeProperty("transform"));
      turns.forEach(turn => turn.style.removeProperty("transform"));
      artLayers.forEach(layer => layer.style.removeProperty("transform"));
      artProgress = -1;
    }

    // Background parallax: each layer drifts by its own data-art-x / data-art-y.
    function paintArt(progress) {
      if (Math.abs(progress - artProgress) < 0.0005) return;
      artProgress = progress;
      artLayers.forEach(layer => {
        const x = Number(layer.dataset.artX || 0) * progress;
        const y = Number(layer.dataset.artY || 0) * progress;
        layer.style.transform = `translate(${x}px, ${y}px)`;
      });
    }

    function measure() {
      isDesktop = desktop.matches && !reduced.matches;
      if (isDesktop) root.dataset.deck = "true";
      else delete root.dataset.deck;
      clearTransforms();

      if (isDesktop) {
        sceneHeight = stage.offsetHeight;
        distance = sceneHeight * scrollLength * timelineLength;
        root.style.setProperty("--scroll-distance", distance + "px");
        top = root.getBoundingClientRect().top + window.scrollY;
        width = cards[0].offsetWidth;
        gap = parseFloat(getComputedStyle(deck).columnGap) || 18;
      } else {
        root.style.removeProperty("--scroll-distance");
      }
      needsMeasure = false;
      initialized = false;
    }

    function paintDesktop(progress) {
      paintArt(progress);
      // Convert section progress into the automatically sized animation timeline.
      progress *= timelineLength;
      // Fan out, turn directly from that pose, then hold the readable fronts.
      const lift = ease(progress / 0.22);
      const fan = ease((progress - 0.06) / 0.48);

      cards.forEach((card, index) => {
        const flip = ease((progress - flipStart - index * flipStagger) / flipDuration);
        // Alignment happens with the turn, never as a separate movement beforehand.
        const spread = flip;
        const center = index - middle;
        const stackX = center * 5;
        const fanX = center * (width + gap) * fanSpacing;
        const finalX = center * (width + gap);
        const x = mix(mix(stackX, fanX, fan), finalX, spread);
        // Each card follows the previous one down and back up in a continuous wave.
        const phase = (floatTime - index * floatDelay) * Math.PI * 2 / floatDuration;
        const drift = Math.sin(phase) * floatHeight;
        const y = 65 * (1 - lift) + Math.abs(center) * 12 * fan * (1 - spread) + drift;
        const rotation = mix(mix(center * 2, center * fanTilt, fan), 0, spread);
        const scale = mix(mix(0.86, 0.94, lift), 1, spread);

        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`;
        turns[index].style.transform = `rotateY(${180 * (1 - flip)}deg)`;
      });
    }

    function update(time) {
      frame = 0;
      if (document.hidden) { lastTime = 0; return; }
      if (needsMeasure) measure();
      if (reduced.matches) {
        clearTransforms();
        lastTime = 0;
        return;
      }

      // Read stable document geometry before writing any transforms.
      const target = isDesktop
        ? cards.map(() => clamp((window.scrollY - top) / distance))
        : cards.map(card => clamp((window.innerHeight * 0.92 - card.getBoundingClientRect().top) / (window.innerHeight * 0.44)));
      const delta = lastTime ? Math.min(64, time - lastTime) : 16;
      const blend = 1 - Math.exp(-delta / smoothing);
      let moving = false;

      current.forEach((value, index) => {
        if (!initialized || (isDesktop && (target[index] <= 0 || target[index] >= 0.97))) {
          current[index] = target[index];
        } else {
          current[index] += (target[index] - value) * blend;
        }
        if (Math.abs(target[index] - current[index]) < 0.0001) current[index] = target[index];
        else moving = true;
      });

      const visible = isDesktop && window.scrollY + window.innerHeight > top &&
        window.scrollY < top + distance + sceneHeight;
      const floating = visible;
      if (floating) floatTime += delta / 1000;

      if (isDesktop) paintDesktop(current[0]);
      else turns.forEach((turn, index) => {
        turn.style.transform = `rotateY(${180 * (1 - ease(current[index]))}deg)`;
      });

      initialized = true;
      lastTime = moving || floating ? time : 0;
      if (moving || floating) schedule();
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }
    function onResize() {
      needsMeasure = true;
      schedule();
    }
    function onVisibilityChange() {
      window.cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      if (!document.hidden) schedule();
    }

    const observer = new ResizeObserver(onResize);
    observer.observe(stage);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    desktop.addEventListener("change", onResize);
    reduced.addEventListener("change", onResize);
    document.addEventListener("visibilitychange", onVisibilityChange);
    update(performance.now());

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      desktop.removeEventListener("change", onResize);
      reduced.removeEventListener("change", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      delete root.dataset.deck;
      root.style.removeProperty("--scroll-distance");
      clearTransforms();
    };
  }, []);


  return (
    <section id="expertise" ref={rootRef} className={styles.expertise} aria-labelledby="expertise-title">
      <div data-fan-stage className={styles.stage}>
        <ExpertiseArt />
        <AssembleHeading />

        <ol data-fan-deck className={styles.deck}>
          {expertise.map((item, index) => (
            <li key={item.title} data-fan-card className={styles.card} style={{ zIndex: index + 1 }}>
              <div data-card-turn className={styles.turn}>
                <div className={styles.back} aria-hidden="true">
                  <div className={`${styles.layer} ${styles.l0}`}>
                    <div className={`${styles.layer} ${styles.l1}`}>
                      <div className={`${styles.layer} ${styles.l2}`}>
                        <div className={`${styles.layer} ${styles.l3}`}>
                          <div className={`${styles.layer} ${styles.l4}`}>
                            <div className={styles.weave} />
                            <Medallion />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <article className={styles.front} aria-labelledby={`expertise-card-${index}`}>
                  <h3 id={`expertise-card-${index}`} className={styles.title}>
                    {item.lines.map(line => <span key={line}>{line}</span>)}
                  </h3>
                  <p className={styles.description}>{item.description}</p>
                  <ul className={styles.details} aria-label="Capabilities">
                    {item.details.map(detail => <li key={detail}>{detail}</li>)}
                  </ul>
                  <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                </article>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
