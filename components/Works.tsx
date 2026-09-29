import { filters, works, worksPageId, worksPageLabel, worksSection, type Work } from "@/lib/content";
import { ART } from "./art";
import { ExternalIcon } from "./icons";

function Eyebrow() {
  return (
    <div className="eyebrow">
      <span className="eyebrow-n">{worksSection.eyebrowNumber}</span>
      <span className="eyebrow-rule" aria-hidden="true" />
      <span className="eyebrow-t">{worksSection.eyebrow}</span>
    </div>
  );
}

/** 분류 필터 — 모든 장에 같은 탭을 둔다. 어느 장에서 카드가 전부 빠져도 되돌릴 수 있도록. */
function FilterTabs({ label, live }: { label: string; live: boolean }) {
  return (
    <div className="tabs reveal" role="group" aria-label={label}>
      {filters.map((f) => (
        <button key={f.key} className="tab" type="button" data-filter={f.key} aria-pressed={f.key === "all"}>
          {f.label}
        </button>
      ))}
      <span className="tabs-count" data-count="" aria-live={live ? "polite" : undefined}>
        표시 중 {works.length} / {works.length}
      </span>
    </div>
  );
}

function WorkCard({ work }: { work: Work }) {
  const Art = ART[work.art];
  const conic = work.frame !== "plain";
  return (
    <div className="work-item reveal" id={work.id} data-cat={work.category}>
      <div className="tilt" data-tilt="">
        <div className={conic ? "card" : "card card--plain"}>
          {conic && (
            <div className={work.frame === "conic-slow" ? "conic conic--slow" : "conic"} aria-hidden="true">
              <i />
            </div>
          )}
          <div className="card-body">
            <div className="card-media">
              <Art />
              <span className="card-num">{work.num}</span>
              <span className="card-badge">{work.badge}</span>
            </div>
            <div className="card-text">
              <h3 className="card-title">
                {/* 바깥 링크는 새 탭. 페이지 안 앵커(#…)는 덱 스크롤이 처리한다 */}
                <a href={work.href} {...(work.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                  {work.title}
                  <ExternalIcon />
                </a>
              </h3>
              <p className="card-desc">{work.description}</p>
              <p className="card-meta">
                {work.role} · {work.period}
              </p>
              {work.links && work.links.length > 0 && (
                <p className="card-links">
                  {work.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                      {l.label}
                      <ExternalIcon size={12} />
                    </a>
                  ))}
                </p>
              )}
              <div className="chips">
                {work.stack.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Selected Works 한 장. 첫 장에만 제목·설명이 붙고, 나머지 장은 아이브로만 반복한다. */
export function WorksPanel({ page, index }: { page: Work[]; index: number }) {
  const first = index === 0;
  const label = worksPageLabel(page);
  return (
    <section
      className="panel sec"
      id={worksPageId(index)}
      data-nav-key="work"
      aria-label={first ? undefined : label}
    >
      <div className="wrap">
        {first ? (
          <div className="reveal">
            <Eyebrow />
            <h2 className="sec-title">{worksSection.title}</h2>
            <p className="sec-desc">{worksSection.description}</p>
          </div>
        ) : (
          <div className="eyebrow reveal">
            <span className="eyebrow-n">{worksSection.eyebrowNumber}</span>
            <span className="eyebrow-rule" aria-hidden="true" />
            <span className="eyebrow-t">{worksSection.eyebrow}</span>
          </div>
        )}

        <FilterTabs label={first ? "프로젝트 분류 필터" : `프로젝트 분류 필터 (${label.split("· ")[1]})`} live={first} />

        <div className="works">
          {page.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
          <p className="works-empty" hidden>
            {first ? worksSection.emptyNext : worksSection.emptyPrev}
          </p>
        </div>
      </div>
    </section>
  );
}
