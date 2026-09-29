/**
 * 사이트 콘텐츠 — 내용은 이 파일만 고치면 된다.
 *
 * 대괄호 [ ] 는 아직 채우지 않은 자리다. 실제 값으로 바꾸기 전까지 그대로 두고,
 * 없는 사실(성과 수치·회사명 등)을 지어 넣지 않는다.
 */

export type WorkCategory = "personal" | "team";
export type WorkArt = "orbit" | "chart" | "panels" | "rays";
export type WorkFrame = "conic" | "conic-slow" | "plain";

export interface Work {
  /** 앵커 id (#work-01) */
  id: string;
  /** 카드 좌상단 번호 */
  num: string;
  category: WorkCategory;
  title: string;
  description: string;
  role: string;
  period: string;
  stack: string[];
  /** 썸네일 위 성과 슬롯 */
  badge: string;
  /** 상세 링크 — 상세 페이지가 생기면 여기만 바꾼다 */
  href: string;
  /** 썸네일 추상 비주얼 (components/art) */
  art: WorkArt;
  /** 카드 테두리 연출 */
  frame: WorkFrame;
}

export const site = {
  name: "김민아",
  role: "풀스택 개발자",
  url: "https://minahdev.cloud",
  brandTag: "PORTFOLIO 2026",
  description:
    "화면부터 API와 데이터베이스까지, 기능 하나를 끝까지 책임지고 만드는 풀스택 개발자의 포트폴리오.",
  copyrightYear: 2026,
  lastUpdated: "2026.09",
};

interface ExternalLink {
  href: string;
  label: string;
}

export const links: { email: string; github: ExternalLink; linkedin?: ExternalLink } = {
  email: "minmom7898@gmail.com",
  github: { href: "https://github.com/minahdev", label: "github.com/minahdev" },
  // LinkedIn 은 없어서 뺐다. 생기면 { href, label } 로 넣으면 Contact 에 다시 나온다.
};

export const nav = [
  { key: "work", label: "Work", href: "#work" },
  { key: "about", label: "About", href: "#about" },
  { key: "skills", label: "Skills", href: "#skills" },
  { key: "contact", label: "Contact", href: "#contact" },
];

export const hero = {
  badge: "새 프로젝트 협업 논의 가능",
  badgeNote: "[도시] 기반 · 원격 협업 가능",
  /** 헤드라인 2행 — `snap` 은 글자가 흩어졌다 날아와 앉는 단어 */
  headline: { first: "화면과 서버를", lead: "같은 밀도로", snap: "설계합니다" },
  lead: `${site.name} — ${site.role}`,
  body: "화면부터 API와 데이터베이스까지, 기능 하나를 끝까지 책임지고 만듭니다. [X]년 동안 [분야] 서비스를 만들며 빠르게 열리고 오래 고쳐 쓰기 좋은 구조를 찾아왔습니다.",
  primaryCta: { label: "프로젝트 논의하기", href: "#contact" },
  secondaryCta: { label: "작업물 보기", href: "#work" },
  card: { status: "NOW BUILDING", title: "API 설계 · 화면 구현", caption: "지금 다듬고 있는 것들" },
  shipped: { label: "SHIPPED", count: "[NN]", unit: "개 기능" },
  pager: { current: "01", total: "04" },
};

export const worksSection = {
  eyebrowNumber: "01",
  eyebrow: "Selected Works",
  title: "처음부터 끝까지 맡아 만든 것들",
  description:
    "기획부터 배포 후 개선까지 함께한 프로젝트를 골랐습니다. 각 카드에서 맡은 범위와 사용 기술을 확인할 수 있습니다.",
  emptyNext: "이 분류에 해당하는 프로젝트는 다음 장에 있습니다.",
  emptyPrev: "이 분류에 해당하는 프로젝트는 앞 장에 있습니다.",
};

export const filters: { key: WorkCategory | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "personal", label: "개인 프로젝트" },
  { key: "team", label: "팀 프로젝트" },
];

export const works: Work[] = [
  {
    id: "work-01",
    num: "01",
    category: "personal",
    title: "Pace — 기분을 남기면 오늘 운동을 골라주는 퍼스널 트레이닝",
    description:
      "오늘 하루를 글로 남기면 그에 맞는 운동 루틴을 골라 주는 앱. 화면(Next.js·PWA)부터 API(FastAPI)·DB·소셜 로그인·배포(Docker·Cloudflare 터널)까지 혼자 만들고 운영하고 있습니다.",
    role: "1인 개발 · 기획부터 배포까지",
    period: "2026.06 – 현재",
    stack: ["Next.js", "FastAPI", "PostgreSQL", "Flutter"],
    badge: "LIVE · 1인 개발",
    href: "https://pace.minahdev.cloud",
    art: "orbit",
    frame: "conic",
  },
  {
    id: "work-02",
    num: "02",
    category: "team",
    title: "Arda ATS — AI 에이전트가 옆에 붙는 채용 관리 시스템",
    description:
      "지원자 검색·서류 심사·AI 면접·일정 조율·메일 발송을 한 화면에서 끝내는 채용 도구. 4인 팀에서 담당자용 웹(React)과 지원자용 앱(Flutter)을 같은 API 위에 맡았습니다.",
    role: "프론트엔드 · 앱 (4인 팀)",
    period: "2026 여름 – 2026.09",
    stack: ["React", "TypeScript", "Flutter", "FastAPI"],
    badge: "WEB + APP · 같은 API",
    href: "https://seuk.suvisdev.cloud",
    art: "panels",
    frame: "plain",
  },
];

/** 한 장(패널)에 들어가는 카드 수. 넘치면 장이 자동으로 늘어난다. */
export const WORKS_PER_PAGE = 2;

export const worksPages: Work[][] = works.reduce<Work[][]>((pages, work, i) => {
  if (i % WORKS_PER_PAGE === 0) pages.push([]);
  pages[pages.length - 1].push(work);
  return pages;
}, []);

/** n번째 Works 장의 섹션 id — 첫 장은 내비의 #work 와 같다 */
export const worksPageId = (index: number) => (index === 0 ? "work" : `work-${index + 1}`);

export const worksPageLabel = (page: Work[]) =>
  `${worksSection.eyebrow} · ${page[0].num} – ${page[page.length - 1].num}`;

export const about = {
  eyebrowNumber: "02",
  eyebrow: "About",
  title: "코드 뒤의 생각",
  lead: "좋은 서비스는 화면만으로도, 서버만으로도 만들어지지 않는다고 믿습니다.",
  body: "[N]년차 풀스택 개발자입니다. [회사명]에서 [분야] 서비스를 맡아 화면과 서버를 오갔습니다. 그 사이에서 생기는 문제를 남에게 넘기지 않고 직접 해결하는 편입니다.",
  stats: [
    { value: "[N]", unit: "년", label: "개발 경력" },
    { value: "[N]", unit: "개", label: "운영한 프로덕트" },
    { value: "[N]", unit: "편", label: "기술 글 / 발표" },
  ],
  careerLabel: "Career",
  timeline: [
    {
      heading: "[회사명] · [담당 역할]",
      detail: "커머스 서비스의 화면과 주문 API 개발",
      period: "[2023.03 – 현재]",
      current: true,
    },
    { heading: "[회사명] · [담당 역할]", detail: "데이터 대시보드와 사내 도구 개발", period: "[2021.01 – 2023.02]" },
    { heading: "[학교] · [전공]", period: "[2017.03 – 2021.02]" },
  ] as { heading: string; detail?: string; period: string; current?: boolean }[],
};

export const skills = {
  eyebrowNumber: "03",
  eyebrow: "Skills",
  title: "지금 손에 익은 기술들",
  // Pace·Arda 두 프로젝트에서 실제로 쓴 것만 적었다. 빼거나 더할 것은 여기서.
  groups: [
    { num: "01", title: "언어", items: ["TypeScript", "JavaScript", "Python", "Dart", "SQL"] },
    { num: "02", title: "프레임워크", items: ["React", "Next.js", "FastAPI", "Flutter"] },
    { num: "03", title: "도구", items: ["Git", "Docker", "Ollama"] },
    { num: "04", title: "인프라 · 배포", items: ["Vercel", "AWS", "PostgreSQL", "Redis", "Cloudflare"] },
  ],
  /** Skills 장 바닥 마퀴 — 트랙에는 이 목록이 두 번 들어간다 */
  marquee: [
    "TypeScript",
    "React",
    "Next.js",
    "FastAPI",
    "Python",
    "Flutter",
    "PostgreSQL",
    "Redis",
    "Docker",
    "AWS",
    "Vercel",
    "Cloudflare",
  ],
};

export const contact = {
  eyebrowNumber: "04",
  eyebrow: "Contact",
  title: "함께 만들 것이 있다면",
  description: "새 프로젝트 제안과 협업 문의 모두 환영합니다.",
};

export const footer = {
  note: `© ${site.copyrightYear} ${site.name}. 이 사이트는 직접 디자인하고 만들었습니다.`,
  stamp: `LAST UPDATED ${site.lastUpdated}`,
  toTop: "맨 위로",
};

export interface SectionEntry {
  id: string;
  /** 레일에 보이는 번호. 비어 있으면 점만 보이는 보조 장 */
  number: string;
  /** 레일 버튼의 aria-label */
  label: string;
  /** 헤더 내비의 어느 항목을 활성으로 볼지 (nav[].key) */
  navKey: string;
}

/** 덱의 장 순서 — 레일(점 내비)과 활성 내비 판정이 이 목록을 쓴다 */
export const sections: SectionEntry[] = [
  { id: "hero", number: "00", label: "처음 화면", navKey: "" },
  ...worksPages.map((page, i) => ({
    id: worksPageId(i),
    number: i === 0 ? worksSection.eyebrowNumber : "",
    label: worksPageLabel(page),
    navKey: "work",
  })),
  { id: "about", number: about.eyebrowNumber, label: about.eyebrow, navKey: "about" },
  { id: "skills", number: skills.eyebrowNumber, label: skills.eyebrow, navKey: "skills" },
  { id: "contact", number: contact.eyebrowNumber, label: contact.eyebrow, navKey: "contact" },
];
