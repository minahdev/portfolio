import { about } from "@/lib/content";

export function About() {
  return (
    <section className="panel sec" id="about" data-nav-key="about">
      <div
        className="blob blob--about"
        aria-hidden="true"
        data-parallax="0.18"
        style={{
          position: "absolute",
          left: "-14%",
          top: "-22%",
          width: "min(840px,86vw)",
          height: "min(840px,86vw)",
          animation: "none",
        }}
      >
        <i
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(124,58,237,.14), rgba(124,58,237,0) 64%)",
            animation: "drift 22s ease-in-out infinite",
            animationDelay: "-14s",
          }}
        />
      </div>
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className="reveal">
          <div className="eyebrow">
            <span className="eyebrow-n">{about.eyebrowNumber}</span>
            <span className="eyebrow-rule" aria-hidden="true" />
            <span className="eyebrow-t">{about.eyebrow}</span>
          </div>
          <h2 className="sec-title">{about.title}</h2>
        </div>

        <div className="about-grid">
          <div className="reveal">
            <p className="about-lead">{about.lead}</p>
            <p className="about-body">{about.body}</p>
            <div className="stats">
              {about.stats.map((stat, i) => (
                <StatItem key={stat.label} {...stat} withRule={i > 0} />
              ))}
            </div>
          </div>

          <div className="info-panel reveal">
            <p className="panel-k">{about.careerLabel}</p>
            <div className="timeline">
              {about.timeline.map((item) => (
                <div key={`${item.heading}-${item.period}`} className={item.current ? "tl-item tl-item--now" : "tl-item"}>
                  <h3 className="tl-h">{item.heading}</h3>
                  {item.detail && <p className="tl-p">{item.detail}</p>}
                  <p className="tl-d">{item.period}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ value, unit, label, withRule }: { value: string; unit: string; label: string; withRule: boolean }) {
  return (
    <>
      {withRule && <span className="stat-rule" aria-hidden="true" />}
      <div>
        <p className="stat-v">
          <span className="grotesk">{value}</span>
          {unit}
        </p>
        <p className="stat-k">{label}</p>
      </div>
    </>
  );
}
