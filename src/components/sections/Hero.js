import Image from "next/image";
import HeroCanyon from "./HeroCanyon";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-title">
      <HeroCanyon />
      <div className={styles.topLine}>WEB DESIGNER AND DEVELOPER</div>
      <div data-hero-content className={styles.composition}>
        <div className={styles.identity}>
          <h1 id="hero-title" className={styles.heading}>
            <span className={styles.yours}>YOURS,</span>
            <span className={styles.name}>HAMMAD</span>
          </h1>
          <p className={styles.tagline}>
            <span>I TURN IDEAS INTO</span>
            <span>A FEELING.</span>
          </p>
          <a className={styles.workLink} href="#work">See my work <span aria-hidden="true">↗</span></a>
        </div>
        <div className={styles.portrait}>
          <Image
            src="/images/hammad-portrait-cutout.png"
            alt="Hammad wearing an olive overshirt"
            fill
            preload
            sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 40vw"
            className={styles.portraitImage}
          />
        </div>
      </div>
    </section>
  );
}
