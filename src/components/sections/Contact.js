"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./Contact.module.css";

const lines = ["GOT SOMETHING", "IN MIND?", "LET’S TALK."];
const contactEmail = "highprofile175@gmail.com";

function ContactPostage() {
  return (
    <div className={styles.postage} aria-hidden="true">
      <div className={styles.stamp}>
        <div className={styles.stampArt}><i /></div>
      </div>
      <svg className={styles.postmark} viewBox="0 0 160 100" focusable="false">
        <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M96 34H156M96 50H156M96 66H156" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function Contact() {
  const headingRef = useRef(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const pendingRef = useRef(false);

  useEffect(() => {
    function resetSending() {
      pendingRef.current = false;
      setSending(false);
      setMessage("");
    }
    window.addEventListener("pageshow", resetSending);
    return () => window.removeEventListener("pageshow", resetSending);
  }, []);

  useLayoutEffect(() => {
    const heading = headingRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!heading || motion.matches) return;

    // Change these two numbers to adjust the Mask Rise timing.
    const duration = 900;
    const wordDelay = 95;
    const words = Array.from(heading.querySelectorAll("[data-contact-word]"));
    const animations = words.map((word, index) => {
      const animation = word.animate(
        [
          { transform: "translateY(112%)" },
          { transform: "translateY(0)" },
        ],
        {
          duration,
          delay: index * wordDelay,
          easing: "cubic-bezier(.16, 1, .3, 1)",
          fill: "both",
        }
      );
      animation.pause();
      animation.currentTime = 0;
      return animation;
    });

    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        animations.forEach(animation => animation.play());
        observer.disconnect();
      },
      { threshold: 0.2 }
    );
    observer.observe(heading);

    function onMotionChange() {
      if (!motion.matches) return;
      animations.forEach(animation => animation.finish());
      observer.disconnect();
    }
    motion.addEventListener("change", onMotionChange);

    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      motion.removeEventListener("change", onMotionChange);
    };
  }, []);

  function handleBackToTop(event) {
    // Preserve opening the link in a new tab with modifier keys.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState(null, "", "#home");
    // The hero is pinned during its transition; its anchor can point below page top.
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  function handleSubmit(event) {
    const fields = new FormData(event.currentTarget);
    if (pendingRef.current || fields.get("_honey")) {
      event.preventDefault();
      return;
    }
    if (!["name", "email", "message"].every(key => String(fields.get(key) || "").trim())) {
      event.preventDefault();
      setMessage("Please fill in your name, email, and project details.");
      return;
    }
    pendingRef.current = true;
    setSending(true);
    setMessage("Opening FormSubmit…");
  }

  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-heading">
      <div className={styles.scallops} aria-hidden="true" />

      <div className={styles.layout}>
        <div className={styles.intro}>
          <h2
            ref={headingRef}
            id="contact-heading"
            className={styles.heading}
            aria-label="Got something in mind? Let’s talk."
          >
            {lines.map((line, lineIndex) => (
              <span
                key={line}
                className={`${styles.headingLine} ${lineIndex === 2 ? styles.accent : ""}`}
                aria-hidden="true"
              >
                {line.split(" ").map((word, wordIndex) => (
                  <span key={word}>
                    {wordIndex > 0 ? "\u00a0" : null}
                    <span className={styles.wordMask}>
                      <span data-contact-word className={styles.word}>{word}</span>
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h2>

          <p className={styles.description}>
            An idea, a question, or something you haven’t quite figured out yet—tell me about it.
          </p>
          <ContactPostage />
        </div>

        <div className={styles.formSide}>
          <h3 className={styles.formHeading}>SEND A QUICK MESSAGE</h3>
          <form className={styles.form} action={`https://formsubmit.co/${contactEmail}`} method="post" onSubmit={handleSubmit} aria-busy={sending}>
            <input type="hidden" name="_subject" value="New enquiry — Yours, Hammad" />
            <input type="hidden" name="_template" value="table" />
            <input type="text" name="_honey" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ display: "none" }} />
            <label className={styles.field}>
              YOUR NAME
              <input className={styles.input} name="name" autoComplete="name" placeholder="What should I call you?" required />
            </label>
            <label className={styles.field}>
              EMAIL ADDRESS
              <input className={styles.input} type="email" name="email" autoComplete="email" placeholder="Where can I reach you?" required />
            </label>
            <label className={styles.field}>
              PROJECT DETAILS
              <textarea className={styles.textarea} name="message" placeholder="Tell me about your idea, goals, or what you’re looking to build…" required />
            </label>
            <button className={styles.send} type="submit" disabled={sending}>
              <span>{sending ? "SENDING…" : "SEND MESSAGE"}</span>
              <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M5 19 19 5M5 5h14v14" />
              </svg>
            </button>
            <p className={styles.status} role="status">{message}</p>
          </form>
        </div>
      </div>

      <footer className={styles.footer}>
        <span>Yours, Hammad.</span>
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        <a href="#home" onClick={handleBackToTop}>Back to top</a>
      </footer>
    </section>
  );
}
