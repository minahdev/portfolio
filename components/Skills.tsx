import { skills } from "@/lib/content";

export function Skills() {
  // 마퀴 트랙은 같은 목록을 두 번 이어 붙여야 -50% 이동 끝에 빈 구간이 없다
  const track = [...skills.marquee, ...skills.marquee];

  return (
    <section className="panel sec" id="skills" data-nav-key="skills">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">
            <span className="eyebrow-n">{skills.eyebrowNumber}</span>
            <span className="eyebrow-rule" aria-hidden="true" />
            <span className="eyebrow-t">{skills.eyebrow}</span>
          </div>
          <h2 className="sec-title">{skills.title}</h2>
        </div>

        <div className="skills-grid">
          {skills.groups.map((group) => (
            <div key={group.num} className="skill reveal">
              <div>
                <p className="skill-n">{group.num}</p>
                <h3 className="skill-h">{group.title}</h3>
              </div>
              <div className="chips" style={{ marginTop: 0 }}>
                {group.items.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 마퀴: Skills 장 바닥의 풀블리드 밴드 */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {track.map((item, i) => (
            <span key={`${item}-${i}`} className="marquee-item">
              <span>{item}</span>
              <i />
            </span>
          ))}
        </div>
        <div className="marquee-edge marquee-edge--l" />
        <div className="marquee-edge marquee-edge--r" />
      </div>
    </section>
  );
}
