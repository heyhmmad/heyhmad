"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./FloatingNav.module.css";

const links = ["Home", "Work", "Expertise", "About", "Contact"].map(label => ({
  label,
  id: label.toLowerCase(),
}));

export default function FloatingNav() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const root = useRef(null);
  const trigger = useRef(null);
  const jumpRef = useRef(null);

  useEffect(() => () => jumpRef.current?.(), []);

  useEffect(() => {
    if (!open) return;
    function dismissOutside(event) {
      if (!root.current?.contains(event.target)) setOpen(false);
    }
    function dismissEscape(event) {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus({ preventScroll: true });
    }
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("focusin", dismissOutside);
    document.addEventListener("keydown", dismissEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("focusin", dismissOutside);
      document.removeEventListener("keydown", dismissEscape);
    };
  }, [open]);

  function navigate(event, id, updateHistory = true) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const section = document.getElementById(id);
    if (!section) return;
    event.preventDefault();
    jumpRef.current?.();
    if (updateHistory) window.history.pushState(null, "", `#${id}`);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let previousTime = 0;
    let stable = 0;
    let previousTarget = -1;
    const startTime = performance.now();

    function stop() {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", onKey);
      jumpRef.current = null;
    }
    function onKey(event) {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) stop();
    }
    function tick(time) {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      // Recheck the destination while Expertise changes height above it.
      const sectionTop = id === "home" ? 0 : section.getBoundingClientRect().top + window.scrollY - 24;
      const target = Math.max(0, Math.min(maxScroll, sectionTop));
      const delta = previousTime ? Math.min(64, time - previousTime) : 16;
      previousTime = time;
      const blend = reduced ? 1 : 1 - Math.exp(-delta / 95);
      const next = window.scrollY + (target - window.scrollY) * blend;
      window.scrollTo({ top: next, behavior: "instant" });
      stable = Math.abs(target - window.scrollY) < 2 && Math.abs(target - previousTarget) < 1 ? stable + 1 : 0;
      previousTarget = target;
      if (time - startTime > 4000) {
        window.scrollTo({ top: target, behavior: "instant" });
        stop();
      } else if (stable >= 12) stop();
      else frame = requestAnimationFrame(tick);
    }
    jumpRef.current = stop;
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", onKey);
    frame = requestAnimationFrame(tick);
  }

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (links.some(link => link.id === id)) {
      navigate({ preventDefault() {} }, id, false);
    }
  }, []);

  useEffect(() => {
    const sections = links
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;

    let frame = 0;

    function update() {
      frame = 0;
      // The active section crosses this line, 35% down the screen.
      const marker = window.innerHeight * 0.35;
      let current = sections[0].id;

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      }

      // The last section may be too short to reach the marker.
      const documentHeight = document.documentElement.scrollHeight;
      const atBottom = window.scrollY > 0 &&
        window.scrollY + window.innerHeight >= documentHeight - 4;
      if (atBottom) current = sections[sections.length - 1].id;

      setActive(previous => previous === current ? previous : current);
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    // Recheck when expanding sections change the page layout.
    const resizeObserver = new ResizeObserver(schedule);
    sections.forEach(section => resizeObserver.observe(section));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    window.addEventListener("pageshow", schedule);
    update();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      window.removeEventListener("pageshow", schedule);
    };
  }, []);

  return (
    <nav ref={root} className={styles.nav} aria-label="Portfolio sections">
      <button ref={trigger} type="button" className={styles.toggle}
        aria-expanded={open} aria-controls={panelId}
        onClick={() => setOpen(previous => !previous)}>
        <span className={styles.icon} aria-hidden="true"><i /><i /><i /></span>
        Menu
      </button>
      <div className={styles.panel} id={panelId} hidden={!open}>
        {links.map(({ id, label }) => (
          <a key={id} href={`#${id}`} className={styles.link}
            aria-current={active === id ? "location" : undefined}
            onClick={event => {
              navigate(event, id);
              if (!event.defaultPrevented) return;
              setOpen(false);
              trigger.current?.focus({ preventScroll: true });
            }}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
