import { hero } from "@/lib/content";
import { cssVars } from "@/lib/css-vars";
import { ArrowIcon, SmallArrowIcon } from "./icons";

/** "설계합니다" 글자마다 날아오는 방향·각도 (charSnap). 글자 수가 더 많으면 순환한다. */
const SNAP_OFFSETS = [
  { tx: "-.62em", ty: "-.70em", r: "-11deg" },
  { tx: ".48em", ty: "-.86em", r: "9deg" },
  { tx: "-.38em", ty: ".78em", r: "7deg" },
  { tx: ".70em", ty: ".56em", r: "-8deg" },
  { tx: "-.16em", ty: "-1.02em", r: "12deg" },
];

const mono = (extra: React.CSSProperties): React.CSSProperties => ({ ...extra });

export function Hero() {
  const { headline } = hero;
  const chars = Array.from(headline.snap);

  return (
    <section className="panel hero" id="hero" data-nav-key="">
      <div className="hero-bg" aria-hidden="true">
        <div className="blob blob--a" data-parallax="0.24">
          <span className="blob-in">
            <i />
          </span>
        </div>
        <div className="blob blob--b" data-parallax="0.32">
          <span className="blob-in">
            <i />
          </span>
        </div>
        <div className="blob blob--c" data-parallax="0.2">
          <span className="blob-in">
            <i />
          </span>
        </div>
        <div className="hero-grid" />
        <div className="spot" id="spot" />
        <div className="hero-fade" />
      </div>

      <div className="wrap hero-in">
        <div className="badge-row seq" style={cssVars({ "--sd": ".26s" })}>
          <span className="badge">
            <span className="dot" aria-hidden="true">
              <i />
              <b />
            </span>
            {hero.badge}
          </span>
          <span className="badge-note">{hero.badgeNote}</span>
        </div>

        <h1 className="hero-title">
          <span className="mask">
            <span className="line line--grad" style={cssVars({ "--sd": ".32s" })}>
              {headline.first}
            </span>
          </span>
          <span className="line--build" style={cssVars({ "--sd": ".42s" })}>
            <span className="lead-in">{headline.lead}</span>{" "}
            <span className="split">
              <span className="sr-only">{headline.snap}</span>
              {chars.map((ch, i) => {
                const o = SNAP_OFFSETS[i % SNAP_OFFSETS.length];
                return (
                  <i key={i} aria-hidden="true" style={cssVars({ "--ci": i, "--tx": o.tx, "--ty": o.ty, "--r": o.r })}>
                    {ch}
                  </i>
                );
              })}
              <span className="pop" aria-hidden="true" />
              <span className="pop-ring" aria-hidden="true" />
            </span>
          </span>
        </h1>

        <div className="hero-cols">
          <div>
            <p className="hero-lead seq" style={cssVars({ "--sd": ".46s" })}>
              {hero.lead}
            </p>
            <p className="hero-body seq" style={cssVars({ "--sd": ".46s" })}>
              {hero.body}
            </p>
            <div className="hero-actions seq" style={cssVars({ "--sd": ".52s" })}>
              <span className="mag" data-magnetic="">
                <a className="btn btn--solid" href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                  <ArrowIcon direction="right" color="#FFFFFF" />
                </a>
              </span>
              <span className="mag" data-magnetic="">
                <a className="btn btn--ghost" href={hero.secondaryCta.href}>
                  {hero.secondaryCta.label}
                  <ArrowIcon direction="down" color="#C4B5FD" />
                </a>
              </span>
            </div>
          </div>

          {/* 카드 스택: 바깥 = 정적 rotate / 중간 = 등장 / 안쪽 = 부유 */}
          <div className="stack">
            <div className="stack-layer stack-back-2" aria-hidden="true">
              <div className="rot">
                <div className="enter" style={cssVars({ "--sd": ".52s" })}>
                  <div className="surf" />
                </div>
              </div>
            </div>
            <div className="stack-layer stack-back-1" aria-hidden="true">
              <div className="rot">
                <div className="enter" style={cssVars({ "--sd": ".58s" })}>
                  <div className="surf" />
                </div>
              </div>
            </div>
            <div className="stack-layer stack-front">
              <div className="rot">
                <div className="enter" style={cssVars({ "--sd": ".64s" })}>
                  <div className="stack-card">
                    <div className="stack-top" aria-hidden="true">
                      <span className="tdots">
                        <i />
                        <i />
                        <i />
                      </span>
                      <span className="tbuild">
                        {hero.card.status}
                        <span className="caret" />
                      </span>
                    </div>
                    <HeroCardChart />
                    <div className="stack-foot">
                      <p>{hero.card.title}</p>
                      <p>{hero.card.caption}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stack-layer stack-chip">
              <div className="rot">
                <div className="enter" style={cssVars({ "--sd": ".70s" })}>
                  <div className="chip-inner">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                      style={{ display: "block", flex: "none" }}
                    >
                      <path
                        d="M11.5 2L4 11h4.5L8 18l7.5-9H11l0.5-7z"
                        stroke="#C4B5FD"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                    <span>
                      <span className="chip-k">{hero.shipped.label}</span>
                      <span className="chip-v">
                        <span className="grotesk" style={{ fontVariantNumeric: "tabular-nums" }}>
                          {hero.shipped.count}
                        </span>
                        {hero.shipped.unit}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-meta seq" style={cssVars({ "--sd": ".58s" })}>
          <div className="scroll-hint">
            <span className="scroll-ring" aria-hidden="true">
              <SmallArrowIcon direction="down" />
            </span>
            <span className="mono" style={mono({ fontSize: 11, letterSpacing: ".2em", color: "var(--caption)" })}>
              SCROLL
            </span>
            <span className="scroll-rule" aria-hidden="true" />
          </div>
          <span className="mono" style={mono({ fontSize: 13, letterSpacing: ".12em", color: "var(--caption)" })}>
            <span style={{ color: "var(--accent)" }}>{hero.pager.current}</span> / {hero.pager.total}
          </span>
        </div>
      </div>
    </section>
  );
}

/** 히어로 카드 안의 막대·선 그래프 */
function HeroCardChart() {
  return (
    <svg viewBox="0 0 340 112" fill="none" aria-hidden="true" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="heroCardBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2A2150" />
          <stop offset="1" stopColor="#1D2350" />
        </linearGradient>
        <linearGradient id="heroBar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#6D4DF2" />
          <stop offset="1" stopColor="#C4B5FD" />
        </linearGradient>
        <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#A8BEFD" stopOpacity="0.15" />
          <stop offset="1" stopColor="#C4B5FD" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <rect width="340" height="112" rx="16" fill="url(#heroCardBg)" />
      <rect x="24" y="64" width="16" height="28" rx="6" fill="url(#heroBar)" opacity="0.55" />
      <rect x="48" y="48" width="16" height="44" rx="6" fill="url(#heroBar)" opacity="0.7" />
      <rect x="72" y="32" width="16" height="60" rx="6" fill="url(#heroBar)" opacity="0.85" />
      <rect x="96" y="52" width="16" height="40" rx="6" fill="url(#heroBar)" opacity="0.6" />
      <path
        d="M132 76C152 76 156 44 176 44C196 44 200 62 220 62C240 62 244 28 264 28C284 28 292 40 312 40"
        stroke="url(#heroLine)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="312" cy="40" r="4" fill="#C4B5FD" />
      <circle cx="312" cy="40" r="9" stroke="#C4B5FD" strokeWidth="1.5" opacity="0.35" fill="none" />
    </svg>
  );
}
