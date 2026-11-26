"use client";

import { useEffect, useRef } from "react";
import styles from "./AboutArtworks.module.css";

// Runs artwork only while visible. Every timer and animation is cleaned up.
function useArtwork(ref, setup) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let dispose = null;
    function update() {
      const shouldRun = visible && !document.hidden && !reduced.matches;
      if (shouldRun && !dispose) {
        const animations = new Set();
        const timers = new Set();
        const animate = (element, frames, options) => {
          const animation = element.animate(frames, options);
          animations.add(animation);
          animation.onfinish = () => { animation.cancel(); animations.delete(animation); };
          return animation;
        };
        const later = (callback, delay) => {
          const timer = window.setTimeout(() => { timers.delete(timer); callback(); }, delay);
          timers.add(timer);
        };
        setup(root, animate, later);
        dispose = () => {
          timers.forEach(timer => window.clearTimeout(timer));
          animations.forEach(animation => animation.cancel());
        };
      } else if (!shouldRun && dispose) { dispose(); dispose = null; }
    }
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      update();
    }, { threshold: 0.1 });
    observer.observe(root);
    reduced.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      dispose?.();
      reduced.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [ref, setup]);
}

const random = (min, max) => min + Math.random() * (max - min);

function curiousMotion(root, animate, later) {
  function glance() {
    root.style.setProperty("--gaze-x", `${random(-13, 10)}px`);
    root.style.setProperty("--gaze-y", `${random(-12, 7)}px`);
    root.style.setProperty("--tilt", `${random(-7, 7)}deg`);
    root.style.setProperty("--brow-left-y", `${random(-11, 1)}px`);
    root.style.setProperty("--brow-right-y", `${random(-14, -2)}px`);
    root.style.setProperty("--brow-left-angle", `${random(-17, 3)}deg`);
    root.style.setProperty("--brow-right-angle", `${random(-2, 18)}deg`);
    later(glance, random(550, 1250)); // Random pause between quick glances.
  }
  function blink() {
    root.querySelectorAll("[data-eye]").forEach(eye => animate(eye,
      [{ transform: "scaleY(1)" }, { transform: "scaleY(.08)" }, { transform: "scaleY(1)" }],
      { duration: random(180, 240), easing: "ease-in-out" }
    ));
    later(blink, random(2400, 6200));
  }
  later(glance, random(300, 650));
  later(blink, random(2200, 4000));
}

const layouts = [
  [[22,15,154,5],[22,39,66,10],[115,39,89,91],[22,62,69,4],[22,74,57,4],[22,104,50,18]],
  [[22,15,182,5],[63,39,93,10],[22,65,182,53],[65,132,88,4],[79,143,60,4],[83,156,52,14]],
  [[22,15,182,5],[22,37,116,10],[22,65,82,67],[121,68,83,4],[121,82,68,4],[121,108,57,18]],
  [[22,15,5,143],[46,33,101,11],[46,62,158,56],[46,131,106,4],[46,143,78,4],[164,130,40,20]],
];
const rectangle = ([x,y,w,h]) => `translate(${x}px,${y}px) rotate(0deg) scale(${w/20},${h/20})`;

function pickyMotion(root, animate) {
  const scatter = [[-5,0,-16],[40,-9,12],[174,15,22],[-6,124,-14],[160,149,15],[101,160,-18]];
  root.querySelectorAll("[data-piece]").forEach((piece, index) => {
    const frames = [];
    for (let n = 0; n < 4; n++) {
      const base = n * .25;
      const [x,y,rotation] = scatter[index];
      frames.push({ offset: base, transform: rectangle(layouts[n][index]), opacity: 1, easing: "cubic-bezier(.4,0,.2,1)" });
      frames.push({ offset: base + .1, transform: rectangle(layouts[n][index]), opacity: 1, easing: "cubic-bezier(.4,0,.2,1)" });
      frames.push({ offset: base + .16, transform: `translate(${x}px,${y}px) rotate(${rotation}deg) scale(1.4,.7)`, opacity: .45, easing: "cubic-bezier(.16,1,.3,1)" });
    }
    frames.push({ offset: 1, transform: rectangle(layouts[0][index]), opacity: 1 });
    animate(piece, frames, { duration: 16000, iterations: Infinity });
  });
}

function handsMotion(root, animate, later) {
  const ball = root.querySelector("[data-ball]");
  const cap = root.querySelector("[data-cap]");
  const ground = root.querySelector("[data-ground]");
  function launch() {
    const floorY = ground.offsetTop - ball.offsetTop - ball.offsetHeight + 1;
    const frames = [
      { offset: 0, transform: "translate(0,0)", opacity: 1 },
      { offset: .04, transform: "translate(0,5px)", opacity: 1 },
      { offset: .08, transform: "translate(0,0)", opacity: 1 },
    ];
    for (let n = 1; n <= 120; n++) {
      const t = n / 120;
      frames.push({ offset: .08 + .56*t, transform: `translate(${164*t}px,${430*t*t+(floorY-430)*t}px)`, opacity: 1 });
    }
    frames.push({ offset: .662, transform: `translate(164px,${floorY}px) scale(1.2,.78)`, opacity: 1 }, { offset: .68, transform: `translate(164px,${floorY}px)`, opacity: 1 });
    for (let n = 1; n <= 40; n++) {
      const t = n / 40;
      frames.push({ offset: .68+.16*t, transform: `translate(${164+16*t}px,${floorY-16*Math.sin(Math.PI*t)}px)`, opacity: 1 });
    }
    frames.push({ offset: .855, transform: `translate(180px,${floorY}px) scale(1.08,.92)`, opacity: 1 }, { offset: .875, transform: `translate(180px,${floorY}px)`, opacity: 1 }, { offset: .9, transform: `translate(180px,${floorY}px)`, opacity: 0 }, { offset: .92, transform: "translate(0,0)", opacity: 0 }, { offset: 1, transform: "translate(0,0)", opacity: 1 });
    animate(ball, frames, { duration: 2800, easing: "linear" });
    animate(cap, [{ offset: 0, transform: "translateY(0)" }, { offset: .04, transform: "translateY(5px)" }, { offset: .08, transform: "translateY(0)" }, { offset: 1, transform: "translateY(0)" }], { duration: 2800, easing: "linear" });
    later(launch, 4200);
  }
  later(launch, 650);
}

function Curious() {
  const ref = useRef(null);
  useArtwork(ref, curiousMotion);
  return <div ref={ref} className={styles.curiousCanvas}>
    <div className={styles.eyes}>
      {[0,1].map(index => <div key={index} className={styles.eyeWrap}>
        <i className={styles.brow} /><div data-eye className={styles.eye}><div className={styles.iris}><i className={styles.pupil} /></div></div>
      </div>)}
    </div>
  </div>;
}

function Picky() {
  const ref = useRef(null);
  useArtwork(ref, pickyMotion);
  return <div ref={ref} className={styles.pickyCanvas}>
    {layouts[0].map((rect,index) => <i key={index} data-piece className={styles.piece} style={{ transform: rectangle(rect) }} />)}
  </div>;
}

function HandsOn() {
  const ref = useRef(null);
  useArtwork(ref, handsMotion);
  return <div ref={ref} className={styles.handsCanvas}>
    <div data-ground className={styles.ground} /><div className={styles.stem} /><div className={styles.foot} />
    <div className={styles.ring} /><div data-ball className={styles.ball} /><div className={styles.ringFront} />
    <div className={styles.launcher} /><div data-cap className={styles.cap} />
  </div>;
}

export default function AboutArtwork({ index }) {
  const Component = [Curious, Picky, HandsOn][index];
  if (!Component) return null;
  return <div className={styles.artArea} aria-hidden="true">
    <div className={[styles.artScale, [styles.curiousScale, styles.pickyScale, styles.handsScale][index]].join(" ")}><Component /></div>
  </div>;
}
