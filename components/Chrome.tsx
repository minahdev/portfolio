import { sections } from "@/lib/content";

/** 상단 고정 진행 바 — 채우기는 site-behaviors 가 scaleX 로 움직인다 */
export function ProgressBar() {
  return (
    <div className="progress" aria-hidden="true">
      <i id="progressBar" />
    </div>
  );
}

/** 전 화면 그레인 오버레이 */
export function Grain() {
  return (
    <svg className="grain" aria-hidden="true" focusable="false">
      <defs>
        <filter id="grainFilter" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#grainFilter)" />
    </svg>
  );
}

/** 오른쪽 스크롤 레일 = 덱의 점 내비 (진짜 버튼). 표시 여부는 CSS(.js / .js-deck)가 정한다. */
export function Rail() {
  return (
    <nav className="rail" id="rail" aria-label="섹션 이동">
      <div className="rail-track" aria-hidden="true" />
      <div className="rail-thumb" id="railThumb" aria-hidden="true">
        <b />
        <i />
      </div>
      <div className="rail-marks">
        {sections.map((s) => (
          <button
            key={s.id}
            className={s.number ? "rail-mark" : "rail-mark rail-mark--sub"}
            type="button"
            data-target={s.id}
            // 보이는 숫자가 접근성 이름에도 들어가야 한다 (WCAG 2.5.3 Label in Name)
            aria-label={s.number && !s.label.includes(s.number) ? `${s.number} ${s.label}` : s.label}
          >
            {s.number ? <span>{s.number}</span> : <span aria-hidden="true" />}
            <i aria-hidden="true" />
          </button>
        ))}
      </div>
    </nav>
  );
}
