import styles from "./WorkCloudClimb.module.css";

/* Background controls only. Project scrolling remains in SelectedWork.js. */
const CLOUD_TRAVEL = [40, 80, 140, 220];
const CLOUD_DRIFT = [10, 20, 35, 55];
const CLOUD_SCALE = [0.6, 0.85, 1.1, 1.4];
const CLOUD_COLORS = ["#FAFDFF", "#E2F2FF", "#B6DDF7", "#80BAE9"];
const CLOUD_OPACITY = [0.6, 0.8, 0.95, 1];
const SKY_COLORS = ["#CDEBFF", "#A6D3F2", "#96C7E9", "#639FC8"];
const EXPERTISE_SKY = "#C2E4FB"; // Matches Expertise's peach sky + translucent top wash.
const MOVEMENT = 1; // 0 = still; 1 = approved Cloud Climb movement

const wrap = (value, range, offset) => ((value % range) + range) % range - offset;
const hash = value => {
  const number = Math.sin(value * 12.9898) * 43758.5453;
  return number - Math.floor(number);
};
const clouds = CLOUD_SCALE.flatMap((scale, layer) =>
  Array.from({ length: 4 }, (_, index) => ({
    layer,
    scale,
    x: index * 190 + layer * 55 + Math.sin(layer * 3 + index) * 30,
    y: hash(index * 5 + layer * 11) * 400,
  }))
);

function cloudTransform(cloud, progress) {
  const x = wrap(cloud.x - progress * CLOUD_DRIFT[cloud.layer], 800, 100);
  const y = wrap(cloud.y + progress * CLOUD_TRAVEL[cloud.layer], 420, 60);
  return `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${cloud.scale})`;
}

function Balloon({ small = false }) {
  return (
    <g
      data-cloud-balloon={small ? "small" : "large"}
      transform={small ? "translate(550 266.55) scale(0.6)" : "translate(84 58)"}
    >
      <path d="M-14 26L-7 48M14 26L7 48" fill="none" stroke="#2F5979" strokeWidth="2" />
      <ellipse rx="28" ry="34" fill={small ? "#579ECB" : "#236EA8"} stroke="#F0F8FF" strokeOpacity="0.4" strokeWidth="3" />
      <ellipse rx="11" ry="34" fill="#FAFDFF" />
      <rect x="-9" y="46" width="18" height="12" rx="2" fill="#42799D" />
    </g>
  );
}

export default function WorkCloudClimb() {
  return (
    <div data-cloud-climb className={styles.art} aria-hidden="true">
      <svg className={styles.scene} viewBox="0 0 680 300" preserveAspectRatio="xMidYMid slice" focusable="false">
        <rect data-cloud-sky width="680" height="300" fill={SKY_COLORS[0]} />
        {clouds.map((cloud, index) => (
          <g
            key={index}
            data-cloud-index={index}
            className={styles.moving}
            transform={cloudTransform(cloud, 0)}
            fill={CLOUD_COLORS[cloud.layer]}
            opacity={CLOUD_OPACITY[cloud.layer]}
          >
            <rect width="90" height="20" rx="10" />
            <circle cx="26" r="15" />
            <circle cx="52" cy="-4" r="19" />
          </g>
        ))}
        <Balloon />
        <Balloon small />
        {[0, 1].map(index => (
          <path
            key={index}
            data-cloud-bird={index}
            transform={`translate(${index ? 270 : 140} ${index ? 262 : 40})`}
            d="M0 0q8-9 16 0q8-9 16 0"
            fill="none"
            stroke="#42799D"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className={styles.grain} />
    </div>
  );
}

function mixColor(from, to, progress) {
  return "#" + [1, 3, 5].map(index => {
    const a = parseInt(from.slice(index, index + 2), 16);
    const b = parseInt(to.slice(index, index + 2), 16);
    return Math.round(a + (b - a) * progress).toString(16).padStart(2, "0");
  }).join("");
}

/* Called from the existing wall's render, so both share its exact scroll/easing. */
export function createCloudPainter(stage, projectCount) {
  const art = stage.querySelector("[data-cloud-climb]");
  if (!art) return () => {};
  const sky = art.querySelector("[data-cloud-sky]");
  const groups = Array.from(art.querySelectorAll("[data-cloud-index]"));
  const large = art.querySelector('[data-cloud-balloon="large"]');
  const small = art.querySelector('[data-cloud-balloon="small"]');
  const birds = Array.from(art.querySelectorAll("[data-cloud-bird]"));
  let lastProgress = -1;
  let lastExitBlend = -1;

  return function paintClouds(position, exitBlend = 0) {
    const progress = Math.max(0, Math.min(3, position / Math.max(1, projectCount - 1) * 3));
    exitBlend = Math.max(0, Math.min(1, exitBlend));
    if (progress === lastProgress && exitBlend === lastExitBlend) return;
    lastProgress = progress;
    lastExitBlend = exitBlend;
    const index = Math.min(2, Math.floor(progress));
    const fraction = progress - index;
    const blend = fraction * fraction * (3 - 2 * fraction);
    const sceneColor = mixColor(SKY_COLORS[index], SKY_COLORS[index + 1], blend);
    const exitEase = exitBlend * exitBlend * (3 - 2 * exitBlend);
    sky.setAttribute("fill", mixColor(sceneColor, EXPERTISE_SKY, exitEase));
    const movement = progress * MOVEMENT;
    groups.forEach((group, i) => group.setAttribute("transform", cloudTransform(clouds[i], movement)));
    large.setAttribute("transform", `translate(${(84 + Math.sin(movement * 5) * 12).toFixed(2)} ${(52 + Math.cos(movement * 4) * 6).toFixed(2)})`);
    small.setAttribute("transform", `translate(${wrap(610 - movement * 14, 800, 60).toFixed(2)} ${(262 + Math.sin(movement * 4 + 2) * 5).toFixed(2)}) scale(0.6)`);
    birds.forEach((bird, i) => bird.setAttribute("transform", `translate(${wrap(200 + i * 130 + movement * 90, 800, 60).toFixed(2)} ${i ? 262 : 40})`));
  };
}

/* Work-owned cloud bank: ends flush with Expertise, without covering its content. */
export function WorkCloudBridge() {
  return (
    <div data-work-cloud-bridge className={styles.bridge} aria-hidden="true">
      <svg viewBox="0 0 1200 180" preserveAspectRatio="none" focusable="false">
        <path
          fill="#FAFDFF"
          d="M0 115V95Q5 50 55 65Q70 15 120 35Q160-8 205 35Q265 25 278 82Q330 62 365 92Q405 47 448 65Q460 20 510 45Q555 0 590 50Q640 18 675 70Q720 35 750 75Q790 18 835 48Q885-12 925 38Q980 20 1000 76Q1040 48 1075 70Q1105 22 1145 55Q1190 35 1200 90V150Q1160 176 1120 155Q1080 180 1040 155Q1000 175 960 153Q920 180 880 155Q840 177 800 154Q760 180 720 155Q680 177 640 154Q600 180 560 154Q520 178 480 153Q440 180 400 155Q360 177 320 153Q280 180 240 155Q200 178 160 153Q120 177 80 154Q40 176 0 153Z"
        />
        <path
          fill={EXPERTISE_SKY}
          d="M0 150V122Q40 80 85 112Q125 72 170 105Q215 62 260 113Q305 87 340 128Q390 80 430 108Q475 70 520 118Q565 82 605 112Q650 68 695 117Q735 85 775 115Q820 68 865 112Q910 78 950 117Q1000 75 1040 112Q1080 82 1120 115Q1160 82 1200 120V150Q1160 176 1120 155Q1080 180 1040 155Q1000 175 960 153Q920 180 880 155Q840 177 800 154Q760 180 720 155Q680 177 640 154Q600 180 560 154Q520 178 480 153Q440 180 400 155Q360 177 320 153Q280 180 240 155Q200 178 160 153Q120 177 80 154Q40 176 0 153Z"
        />
      </svg>
    </div>
  );
}

