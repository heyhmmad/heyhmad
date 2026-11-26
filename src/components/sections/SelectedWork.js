"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./SelectedWork.module.css";
import WorkCloudClimb, { WorkCloudBridge, createCloudPainter } from "./WorkCloudClimb";

const projects = [
  {
    name: "Black Diamond Limo",
    title: ["BLACK", "DIAMOND", "LIMO"],
    description:
      "A website for a premium limousine service, with a focus on its fleet and booking experience.",
    category: "LIMOUSINE SERVICE",
    image: "black-diamond-limo.png",
    width: 1900,
    height: 1080,
    url: "https://blackdiamondlimo.net/",
  },
  {
    name: "Detenx",
    title: ["DETENX"],
    description:
      "A digital presence bringing custom software, development services, and business tools together.",
    category: "SOFTWARE COMPANY",
    image: "detenx.png",
    width: 1900,
    height: 1080,
    url: "https://empire-snowy.vercel.app/",
  },
  {
    name: "Growth Hub",
    title: ["GROWTH", "HUB"],
    description:
      "A digital studio website connecting bold design with technology and business growth.",
    category: "DIGITAL STUDIO",
    image: "growth-hub.png",
    width: 1903,
    height: 1080,
    url: "https://www.growthhubva.com/",
  },
  {
    name: "Skipnest",
    title: ["SKIP", "NEST"],
    description:
      "A platform presenting property intelligence, live map data, and AI‑powered outreach.",
    category: "AI PLATFORM",
    image: "skipnest.png",
    width: 1906,
    height: 1080,
    url: "https://www.skipnest.com/",
  },
];

const total = projects.length;
const pad = (n) => String(n).padStart(2, "0");
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/* Each slide holds for a moment, then glides to the next one. */
const HOLD = 0.22;

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function ProjectFrame({ project, index }) {
  return (
    <div className={styles.showcaseFrame}>
      <span className={styles.paperBack} aria-hidden="true" />
      <span className={styles.paperMid} aria-hidden="true" />
      <div className={styles.imageFrame}>
        <div className={styles.imageInner}>
          <Image
            src={"/images/work/" + project.image}
            alt={project.name + " homepage"}
            width={project.width}
            height={project.height}
            sizes="(max-width: 900px) 88vw, 48vw"
            loading={index < 2 ? "eager" : "lazy"}
            className={styles.image}
          />
          <span className={styles.wash} aria-hidden="true" />
        </div>
      </div>

      <span className={styles.edgeLabel} aria-hidden="true">
        {hostOf(project.url).toUpperCase()}
      </span>

      {project.url && (
        <a
          className={styles.frameLink}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={"Explore " + project.name + " website"}
        >
          <span>EXPLORE WEBSITE</span>
          <svg
            className={styles.arrow}
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      )}
    </div>
  );
}

export default function SelectedWork() {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const slides = Array.from(stage.querySelectorAll("[data-slide]"));
    const animated = window.matchMedia(
      "(min-width: 901px) and (min-height: 701px) and (prefers-reduced-motion: no-preference)"
    );

    let frame = 0;
    let current = -1;
    let exitBlend = 0; // Background transition only; does not affect the wall.
    let target = 0;      // where the scroll says we should be
    let position = 0;    // where the wall actually is (smoothed)
    let last = 0;
    let stageHeight = stage.offsetHeight;
    let trackHeight = track.offsetHeight;
    const states = slides.map(() => ({ visible: null, z: -1 }));
    const paintClouds = createCloudPainter(stage, total);

    function measure() {
      stageHeight = stage.offsetHeight;
      trackHeight = track.offsetHeight;
    }

    // Reads scroll once per scroll event and converts it to a slide position.
    function readTarget() {
      const top = track.getBoundingClientRect().top;
      const travel = Math.max(1, trackHeight - stageHeight);
      // Begin near the end of Work; finish as the pinned stage leaves.
      // 0.16 = lead-in; 0.55 = fade distance, both in stage heights.
      exitBlend = clamp((-top - travel + stageHeight * 0.16) / (stageHeight * 0.55), 0, 1);
      const raw = clamp(-top / travel, 0, 1) * (total - 1);
      const base = Math.min(Math.floor(raw), total - 1);
      const t = clamp((raw - base - HOLD) / (1 - HOLD * 2), 0, 1);
      target = base + t * t * (3 - 2 * t);
    }

    function clearSlides() {
      slides.forEach((slide) => {
        slide.style.removeProperty("--offset");
        slide.style.removeProperty("--dist");
        slide.style.visibility = "";
        slide.style.zIndex = "";
        slide.inert = false;
      });
    }

    function render() {
      paintClouds(position, exitBlend);
      slides.forEach((slide, index) => {
        const offset = index - position;
        const dist = Math.abs(offset);
        const state = states[index];

        slide.style.setProperty("--offset", offset.toFixed(4));
        slide.style.setProperty("--dist", Math.min(dist, 2).toFixed(4));

        const visible = dist <= 1.7;
        if (visible !== state.visible) {
          state.visible = visible;
          slide.style.visibility = visible ? "visible" : "hidden";
        }
        const z = 100 - Math.round(dist * 10);
        if (z !== state.z) {
          state.z = z;
          slide.style.zIndex = String(z);
        }
      });

      const next = Math.round(position);
      if (next !== current) {
        current = next;
        slides.forEach((slide, index) => {
          slide.inert = index !== next;
        });
        setActive(next);
      }
    }

    // Glide toward the target. Frame-rate independent easing.
    function tick(now) {
      frame = 0;
      const dt = Math.min(64, now - last || 16);
      last = now;

      if (!animated.matches) {
        position = target;
      } else {
        const ease = 1 - Math.exp(-dt / 120);
        position += (target - position) * ease;
        if (Math.abs(target - position) < 0.0008) position = target;
      }

      render();
      if (position !== target) frame = window.requestAnimationFrame(tick);
    }

    function schedule() {
      if (!animated.matches) return;
      readTarget();
      if (!frame) {
        last = performance.now();
        frame = window.requestAnimationFrame(tick);
      }
    }

    function onResize() {
      measure();
      if (!animated.matches) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        current = -1;
        states.forEach((state) => { state.visible = null; state.z = -1; });
        clearSlides();
        paintClouds(0);
        return;
      }
      readTarget();
      position = target;
      render();
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    animated.addEventListener("change", onResize);
    const observer = new ResizeObserver(onResize);
    observer.observe(stage);

    // Start exactly where the page already is, no swing on load.
    onResize();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      animated.removeEventListener("change", onResize);
      observer.disconnect();

      clearSlides();
    };
  }, []);

  function goTo(index) {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    if (!window.matchMedia(
      "(min-width: 901px) and (min-height: 701px) and (prefers-reduced-motion: no-preference)"
    ).matches) return;

    const travel = Math.max(1, track.offsetHeight - stage.offsetHeight);
    const top =
      window.scrollY +
      track.getBoundingClientRect().top +
      (index / (total - 1)) * travel;

    window.scrollTo({
      top,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  return (
    <section
      id="work"
      className={styles.work}
      aria-labelledby="work-title"
      style={{ "--count": total }}
    >


      {/* Tall track gives the pinned stage its scroll distance. */}
      <div ref={trackRef} className={styles.track}>
        <div ref={stageRef} className={styles.stage}>
          <WorkCloudClimb />

          <header className={styles.intro}>
            <h2 id="work-title" className={styles.heading}>
              LET YOUR WORK SPEAK<span className={styles.period}>.</span>
            </h2>
          </header>

          <div className={styles.wall}>
            {projects.map((project, index) => (
              <article
                key={project.image}
                data-slide
                className={styles.slide}
                aria-labelledby={`project-title-${index}`}
                style={{ "--offset": index }}
              >
                {/* LEFT — number */}
                <div className={styles.numberPanel}>
                  <p className={styles.projectNumber}>
                    {pad(index + 1)}
                    <span> / {pad(total)}</span>
                  </p>
                  <p className={styles.category}>{project.category}</p>
                </div>

                {/* CENTER — image */}
                <div className={styles.visual}>
                  <ProjectFrame project={project} index={index} />
                </div>

                {/* RIGHT — title */}
                <div className={styles.titlePanel}>
                  <h3 id={`project-title-${index}`} className={styles.projectTitle}>
                    {project.title.map((line, lineIndex) => (
                      <span
                        key={line}
                        className={
                          lineIndex === project.title.length - 1
                            ? styles.accent
                            : undefined
                        }
                      >
                        {line}
                      </span>
                    ))}
                  </h3>

                  <p className={styles.description}>{project.description}</p>

                </div>
              </article>
            ))}
          </div>

          <nav className={styles.dots} aria-label="Selected work projects">
            {projects.map((project, index) => (
              <button
                key={project.image}
                type="button"
                className={styles.dot}
                aria-label={`Show project ${index + 1}: ${project.name}`}
                aria-current={active === index ? "true" : undefined}
                onClick={() => goTo(index)}
              >
                <span />
              </button>
            ))}
          </nav>
        </div>
      </div>
      <WorkCloudBridge />
    </section>
  );
}
