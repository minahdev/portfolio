const block = { display: "block", flex: "none" } as const;

export function BrandMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" style={block}>
      <defs>
        <linearGradient id="markGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C4B5FD" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect x="0.75" y="0.75" width="26.5" height="26.5" rx="8.25" stroke="#262238" strokeWidth="1.5" />
      <path
        d="M8 18.5C8 12.7 10.6 9.5 14 9.5C17.4 9.5 20 12.7 20 18.5"
        stroke="url(#markGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="14" cy="18.5" r="1.75" fill="#C4B5FD" />
    </svg>
  );
}

export function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true" style={block}>
      <path
        d="M6.9 14.6C3.6 15.6 3.6 13 2.3 12.7M11.5 16.5V14.1C11.5 13.4 11.6 13.1 11.2 12.7C13.1 12.5 15 11.8 15 8.6C15 7.8 14.7 7.1 14.2 6.5C14.4 5.8 14.4 5.1 14.1 4.4C14.1 4.4 13.5 4.2 12 5.2C10.7 4.9 9.3 4.9 8 5.2C6.5 4.2 5.9 4.4 5.9 4.4C5.6 5.1 5.6 5.8 5.8 6.5C5.3 7.1 5 7.8 5 8.6C5 11.8 6.9 12.5 8.8 12.7C8.4 13.1 8.4 13.5 8.5 14.1V16.5"
        stroke="#B4AED0"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true" style={block}>
      <path
        d="M3 6.5V15M3 3.2V3.3M7.5 15V9.8C7.5 8.5 8.5 7.5 9.8 7.5C11.1 7.5 12 8.5 12 9.8V15M7.5 15V6.5"
        stroke="#B4AED0"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <path d="M2.5 4.5H13.5V11.5H2.5V4.5Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2.5 5L8 9L13.5 5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/** 카드 제목 옆 ↗ */
export function ExternalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <path
        d="M5 13L13 5M13 5H7M13 5V11"
        stroke="#A78BFA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 16px 화살표 — 오른쪽(CTA) / 아래(작업물 보기) */
export function ArrowIcon({ direction, color }: { direction: "right" | "down"; color: string }) {
  const d = direction === "right" ? "M3 8H13M13 8L9 4M13 8L9 12" : "M8 3V13M8 13L4 9M8 13L12 9";
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <path d={d} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 14px 화살표 — 스크롤 힌트(아래) / 맨 위로(위) */
export function SmallArrowIcon({ direction }: { direction: "up" | "down" }) {
  const d = direction === "down" ? "M7 2V12M7 12L3 8M7 12L11 8" : "M7 12V2M7 2L3 6M7 2L11 6";
  const color = direction === "down" ? "#C4B5FD" : "#A78BFA";
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <path d={d} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
