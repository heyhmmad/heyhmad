    import styles from "./AboutBackground.module.css";

/* Artwork from your about-arches.html, without its fixed-width page layout. */
export default function AboutBackground() {
  return (
    <div className={styles.background} aria-hidden="true">
      <svg className={styles.scene} viewBox="0 0 1360 900" preserveAspectRatio="none" focusable="false">
        <g className={styles.arches}>
          <circle cx="680" cy="980" r="740" fill="#B6DDF7" />
          <circle cx="680" cy="980" r="640" fill="#80BAE9" />
          <circle cx="680" cy="980" r="540" fill="#579ECB" />
          <circle cx="680" cy="980" r="440" fill="#42799D" />
          <circle cx="680" cy="980" r="340" fill="#42799D" />
          <circle cx="680" cy="980" r="240" fill="#2F5979" />
        </g>
        <circle cx="110" cy="330" r="46" fill="#A6D3F2" opacity="0.8" />
        <circle cx="170" cy="400" r="18" fill="#236EA8" opacity="0.7" />
        <circle cx="1250" cy="390" r="38" fill="#A6D3F2" opacity="0.8" />
        <circle cx="1190" cy="450" r="14" fill="#236EA8" opacity="0.7" />
      </svg>
      <div className={styles.scallopTop} />
      <div className={styles.scallopBottom} />
    </div>
  );
}

