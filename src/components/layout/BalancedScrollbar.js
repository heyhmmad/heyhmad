"use client";

import { useEffect, useRef } from "react";
import styles from "./BalancedScrollbar.module.css";

// Motion controls. Higher damping means less bounce.
const STIFFNESS = 0.12;
const DAMPING = 0.48;
const THUMB_HEIGHT = 52;

export default function BalancedScrollbar() {
  const railRef = useRef(null);
  const thumbRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const rail = railRef.current;
    const thumb = thumbRef.current;
    const input = inputRef.current;
    if (!rail || !thumb || !input) return;

    const html = document.documentElement;
    const desktop = window.matchMedia(
      "(min-width: 769px) and (pointer: fine) and (forced-colors: none)"
    );
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const previousWidth = html.style.getPropertyValue("scrollbar-width");
    const previousPriority = html.style.getPropertyPriority("scrollbar-width");

    let enabled = false;
    let dragging = false;
    let maxScroll = 1;
    let travel = 1;
    let position = 0;
    let target = 0;
    let velocity = 0;
    let frame = 0;
    let last = 0;

    function restoreNative() {
      if (previousWidth) {
        html.style.setProperty("scrollbar-width", previousWidth, previousPriority);
      } else {
        html.style.removeProperty("scrollbar-width");
      }
    }

    function readScroll() {
      target = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      input.value = String(Math.round(target * 1000));
      input.setAttribute("aria-valuetext", `${Math.round(target * 100)} percent`);
    }

    function draw() {
      // Keep the thumb inside the rail, including at the page edges.
      const y = Math.max(0, Math.min(travel, position * travel));
      thumb.style.transform = `translate3d(0, ${y}px, 0)`;
    }

    function tick(now) {
      frame = 0;
      const dt = Math.min(40, last ? now - last : 16);
      last = now;

      if (dragging || reduced.matches) {
        position = target;
        velocity = 0;
      } else {
        // Small steps keep the spring consistent on different refresh rates.
        const steps = Math.max(1, Math.ceil(dt / 8));
        const step = dt / steps / 16;
        for (let i = 0; i < steps; i += 1) {
          velocity += ((target - position) * STIFFNESS - velocity * DAMPING) * step;
          position += velocity * step;
        }
      }

      if (Math.abs(target - position) < 0.0001 && Math.abs(velocity) < 0.0001) {
        position = target;
        velocity = 0;
      }
      draw();

      if (position !== target || velocity !== 0) {
        frame = window.requestAnimationFrame(tick);
      } else {
        last = 0;
      }
    }

    function schedule() {
      if (!enabled) return;
      readScroll();
      if (!frame) frame = window.requestAnimationFrame(tick);
    }

    function measure() {
      maxScroll = Math.max(0, html.scrollHeight - window.innerHeight);
      const shouldEnable = desktop.matches && maxScroll > 1 &&
        CSS.supports("scrollbar-width", "none");

      if (!shouldEnable) {
        enabled = false;
        rail.hidden = true;
        window.cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
        velocity = 0;
        dragging = false;
        restoreNative();
        return;
      }

      rail.hidden = false;
      const height = Math.min(THUMB_HEIGHT, rail.clientHeight);
      rail.style.setProperty("--thumb-height", `${height}px`);
      travel = Math.max(0, rail.clientHeight - height);
      html.style.setProperty("scrollbar-width", "none");
      enabled = true;
      readScroll();
      position = target;
      velocity = 0;
      draw();
    }

    function seek() {
      if (!enabled) return;
      const fraction = Number(input.value) / 1000;
      // Only dragging/keyboard use changes scroll. Normal page scrolling stays native.
      window.scrollTo({ top: fraction * maxScroll, behavior: "instant" });
      schedule();
    }

    function startDrag() {
      dragging = true;
      position = target;
      velocity = 0;
      draw();
    }

    function endDrag() {
      dragging = false;
    }

    input.addEventListener("input", seek);
    input.addEventListener("pointerdown", startDrag);
    input.addEventListener("lostpointercapture", endDrag);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    desktop.addEventListener("change", measure);
    reduced.addEventListener("change", schedule);

    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    measure();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      input.removeEventListener("input", seek);
      input.removeEventListener("pointerdown", startDrag);
      input.removeEventListener("lostpointercapture", endDrag);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      desktop.removeEventListener("change", measure);
      reduced.removeEventListener("change", schedule);
      restoreNative();
    };
  }, []);

  return (
    <div ref={railRef} className={styles.rail} hidden>
      <span ref={thumbRef} className={styles.thumb} aria-hidden="true" />
      <input
        ref={inputRef}
        className={styles.input}
        type="range"
        min="0"
        max="1000"
        step="1"
        defaultValue="0"
        aria-label="Page scroll position"
        aria-orientation="vertical"
      />
    </div>
  );
}
