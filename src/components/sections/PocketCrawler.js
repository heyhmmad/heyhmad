"use client";

import { useEffect, useRef } from "react";
import styles from "./PocketCrawler.module.css";

export default function PocketCrawler() {
  const buttonRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!button || !ctx) return;

    // Main controls.
    const size = 1; // 1 = normal; try 1.2 for a larger crawler
    const followSpeed = 0.0009;
    const hopStrength = 13;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const W = 1000;
    const H = 300;
    const floor = 242;
    const ground = floor - 48 * size;
    const mouse = { x: 430, y: ground - 20 };
    let x = 430, y = ground, vx = 0, vy = 0, phase = 0;
    let frame = 0, last = 0, visible = false, stopped = false;
    let blue, white, black, line;

    function ellipse(cx, cy, rx, ry, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    function eye(cx, cy, dx, dy) {
      ellipse(cx, cy, 14, 18, white);
      ellipse(cx + dx, cy + dy, 6, 9, black);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(70, floor + 10);
      ctx.lineTo(930, floor + 10);
      ctx.stroke();

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size, size);
      ctx.lineCap = "round";
      ctx.strokeStyle = blue;
      ctx.lineWidth = 7;
      for (let i = 0; i < 3; i++) {
        const walk = reduced.matches ? 0 : Math.sin(phase * 4 + i * 1.8) * Math.min(12, Math.abs(vx) * 4);
        ctx.beginPath();
        ctx.moveTo(-32 + i * 30, 15);
        ctx.lineTo(-65 + i * 40, 33 + walk * 0.3);
        ctx.lineTo(-68 + i * 43 + walk, 46);
        ctx.stroke();
      }

      ellipse(0, 7, 64, 33, blue);
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(-28, -8);
      ctx.quadraticCurveTo(-45, -42, -32, -62);
      ctx.moveTo(25, -9);
      ctx.quadraticCurveTo(44, -41, 32, -66);
      ctx.stroke();

      const gazeX = Math.max(-5, Math.min(5, (mouse.x - x) * 0.025));
      const gazeY = Math.max(-3, Math.min(3, (mouse.y - y) * 0.025));
      eye(-32, -63, gazeX, gazeY);
      eye(32, -67, gazeX, gazeY);
      ctx.strokeStyle = black;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-7, 9);
      ctx.quadraticCurveTo(0, 16, 8, 9);
      ctx.stroke();
      ellipse(-14, -4, 18, 5, "#579ECB");
      ctx.restore();
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
      const palette = getComputedStyle(button);
      blue = palette.getPropertyValue("--portfolio-accent").trim() || "#236EA8";
      white = palette.getPropertyValue("--portfolio-foreground").trim() || "#173854";
      black = palette.getPropertyValue("--portfolio-background").trim() || "#F0F8FF";
      line = palette.getPropertyValue("--portfolio-line").trim() || "#91ABC0";
      draw();
    }

    function tick(now) {
      frame = 0;
      if (stopped || !visible || document.hidden || reduced.matches) { last = 0; return; }
      const dt = last ? Math.min(2, (now - last) / 16.667) : 1;
      last = now;
      phase += dt * 0.04;
      if (Math.abs(mouse.x - x) > 35) vx += (mouse.x - x) * followSpeed * dt;
      vx *= Math.pow(0.97, dt);
      vx = Math.max(-10, Math.min(10, vx));
      x += vx * dt;
      vy += 0.48 * dt;
      y += vy * dt;
      if (y > ground) { y = ground; vy = vy > 2 ? -vy * 0.43 : 0; }
      const edge = 85 * size;
      if (x < edge) { x = edge; vx = Math.abs(vx) * 0.6; }
      if (x > W - edge) { x = W - edge; vx = -Math.abs(vx) * 0.6; }
      draw();
      frame = requestAnimationFrame(tick);
    }

    function start() {
      if (!frame && !stopped && visible && !document.hidden && !reduced.matches) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    }

    function move(event) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = Math.max(90 * size, Math.min(W - 90 * size, (event.clientX - rect.left) / rect.width * W));
      mouse.y = Math.max(20, Math.min(H, (event.clientY - rect.top) / rect.height * H));
      if (reduced.matches) draw();
      start();
    }

    function hop() {
      if (reduced.matches) return;
      vy = -hopStrength;
      start();
    }

    function syncMotion() {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (reduced.matches) { y = ground; vx = vy = 0; draw(); }
      start();
    }

    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) start();
      else { cancelAnimationFrame(frame); frame = 0; last = 0; }
    });
    observer.observe(button);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    button.addEventListener("pointermove", move);
    button.addEventListener("pointerdown", move);
    button.addEventListener("click", hop);
    reduced.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);
    resize();

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      button.removeEventListener("pointermove", move);
      button.removeEventListener("pointerdown", move);
      button.removeEventListener("click", hop);
      reduced.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncMotion);
    };
  }, []);

  return (
    <button ref={buttonRef} type="button" className={styles.playground}
      aria-label="Play with the pocket crawler. Move your pointer to lead it. Click, tap, or press Enter to make it hop.">
      <canvas ref={canvasRef} className={styles.canvas} width="1000" height="300" aria-hidden="true" />
    </button>
  );
}
