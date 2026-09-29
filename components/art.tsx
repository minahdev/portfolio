/**
 * 프로젝트 카드 썸네일 — 사진 대신 인라인 SVG 로 그린 추상 비주얼.
 * 시안의 SVG 를 그대로 옮겼다. 애니메이션 이름(spin·pulseRing·floatY·glowPulse)은 globals.css 의 키프레임이다.
 */
import type { WorkArt } from "@/lib/content";

const svgProps = {
  viewBox: "0 0 584 220",
  preserveAspectRatio: "xMidYMid slice",
  fill: "none",
  "aria-hidden": true,
} as const;

/** 썸네일 아래쪽을 카드 배경색으로 눌러 주는 스크림 */
function Fade({ id, to }: { id: string; to: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#13111F" stopOpacity="0" />
      <stop offset="1" stopColor="#13111F" stopOpacity={to} />
    </linearGradient>
  );
}

function OrbitArt() {
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="p1bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1D1744" />
          <stop offset="1" stopColor="#151B40" />
        </linearGradient>
        <radialGradient id="p1orb" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#A78BFA" stopOpacity="0.24" />
          <stop offset="0.5" stopColor="#7C3AED" stopOpacity="0.12" />
          <stop offset="1" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="p1ring" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#C4B5FD" stopOpacity="0.95" />
          <stop offset="1" stopColor="#818CF8" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="p1trail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#A8BEFD" stopOpacity="0" />
          <stop offset="1" stopColor="#C4B5FD" stopOpacity="0.75" />
        </linearGradient>
        <Fade id="p1fade" to="0.6" />
      </defs>
      <rect width="584" height="220" fill="url(#p1bg)" />
      <circle cx="410" cy="106" r="156" fill="url(#p1orb)" />
      <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "spin 46s linear infinite" }}>
        <ellipse cx="410" cy="106" rx="132" ry="50" stroke="url(#p1ring)" strokeWidth="1.5" fill="none" transform="rotate(-20 410 106)" />
        <ellipse cx="410" cy="106" rx="106" ry="72" stroke="url(#p1ring)" strokeWidth="1.5" fill="none" transform="rotate(26 410 106)" opacity="0.75" />
        <ellipse cx="410" cy="106" rx="146" ry="88" stroke="url(#p1ring)" strokeWidth="1.5" fill="none" transform="rotate(62 410 106)" opacity="0.45" />
      </g>
      <circle cx="410" cy="106" r="34" fill="#100C28" />
      <circle cx="410" cy="106" r="34" stroke="#8B7CF6" strokeWidth="1.5" fill="none" />
      <circle cx="410" cy="106" r="10" fill="#C4B5FD" />
      <path d="M230 78C248 66 262 60 278 58" stroke="url(#p1trail)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="278" cy="58" r="4" fill="#C4B5FD" />
      <circle cx="522" cy="152" r="3.5" fill="#A8BEFD" opacity="0.7" />
      <circle cx="482" cy="34" r="2.5" fill="#C4B5FD" opacity="0.5" />
      <circle cx="150" cy="162" r="2.5" fill="#A8BEFD" opacity="0.45" />
      <rect width="584" height="220" fill="url(#p1fade)" />
    </svg>
  );
}

const DOT_COLS = [40, 68, 96, 124, 152, 180];
const DOT_ROWS = [36, 60, 84];

function ChartArt() {
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="p2bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#151C42" />
          <stop offset="1" stopColor="#102A4E" />
        </linearGradient>
        <linearGradient id="p2line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#818CF8" stopOpacity="0.2" />
          <stop offset="0.5" stopColor="#A8BEFD" stopOpacity="0.95" />
          <stop offset="1" stopColor="#7DD3FC" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="p2area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7DD3FC" stopOpacity="0.32" />
          <stop offset="1" stopColor="#7DD3FC" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="p2orb" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#60A5FA" stopOpacity="0.22" />
          <stop offset="1" stopColor="#60A5FA" stopOpacity="0" />
        </radialGradient>
        <Fade id="p2fade" to="0.55" />
      </defs>
      <rect width="584" height="220" fill="url(#p2bg)" />
      <circle cx="360" cy="150" r="170" fill="url(#p2orb)" />
      <path
        d="M0 176C72 176 96 120 168 120C240 120 264 156 336 156C408 156 432 84 504 84C540 84 560 100 584 108V220H0V176Z"
        fill="url(#p2area)"
      />
      <path
        d="M0 176C72 176 96 120 168 120C240 120 264 156 336 156C408 156 432 84 504 84C540 84 560 100 584 108"
        stroke="url(#p2line)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M0 142C72 142 96 74 168 74C240 74 264 106 336 106C408 106 432 46 504 46C540 46 560 58 584 64"
        stroke="url(#p2line)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M0 202C72 202 96 162 168 162C240 162 264 190 336 190C408 190 432 138 504 138C540 138 560 150 584 156"
        stroke="url(#p2line)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.28"
      />
      <circle cx="336" cy="156" r="4" fill="#A8BEFD" />
      <circle cx="504" cy="84" r="4" fill="#7DD3FC" />
      <circle
        cx="504"
        cy="84"
        r="10"
        stroke="#7DD3FC"
        strokeWidth="1.5"
        opacity="0.4"
        fill="none"
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          animation: "pulseRing 2.8s cubic-bezier(.4,0,.2,1) infinite",
        }}
      />
      <g fill="#A8BEFD" opacity="0.4">
        {DOT_ROWS.map((cy) => DOT_COLS.map((cx) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.5" />))}
      </g>
      <rect width="584" height="220" fill="url(#p2fade)" />
    </svg>
  );
}

function PanelsArt() {
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="p3bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#112548" />
          <stop offset="1" stopColor="#0E3247" />
        </linearGradient>
        <linearGradient id="p3panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B82F6" stopOpacity="0.34" />
          <stop offset="1" stopColor="#38BDF8" stopOpacity="0.14" />
        </linearGradient>
        <linearGradient id="p3stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#93C5FD" stopOpacity="0.9" />
          <stop offset="1" stopColor="#7DD3FC" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="p3orb" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#38BDF8" stopOpacity="0.20" />
          <stop offset="1" stopColor="#38BDF8" stopOpacity="0" />
        </radialGradient>
        <Fade id="p3fade" to="0.55" />
      </defs>
      <rect width="584" height="220" fill="url(#p3bg)" />
      <circle cx="300" cy="110" r="160" fill="url(#p3orb)" />
      <g transform="rotate(-8 292 110)">
        <g style={{ animation: "floatY 8s ease-in-out infinite", animationDelay: "-2s" }}>
          <rect x="196" y="16" width="264" height="74" rx="16" fill="url(#p3panel)" />
          <rect x="196.75" y="16.75" width="262.5" height="72.5" rx="15.25" stroke="url(#p3stroke)" strokeWidth="1.5" fill="none" opacity="0.45" />
        </g>
      </g>
      <g transform="rotate(-8 292 110)">
        <rect x="152" y="72" width="264" height="74" rx="16" fill="url(#p3panel)" />
        <rect x="152.75" y="72.75" width="262.5" height="72.5" rx="15.25" stroke="url(#p3stroke)" strokeWidth="1.5" fill="none" opacity="0.7" />
        <circle cx="180" cy="96" r="8" stroke="#93C5FD" strokeWidth="1.5" fill="none" />
        <rect x="198" y="91" width="96" height="6" rx="3" fill="#BFDBFE" opacity="0.65" />
        <rect x="198" y="107" width="152" height="6" rx="3" fill="#BFDBFE" opacity="0.3" />
        <rect x="198" y="123" width="64" height="6" rx="3" fill="#7DD3FC" opacity="0.55" />
      </g>
      <g transform="rotate(-8 292 110)">
        <g style={{ animation: "floatY 9s ease-in-out infinite", animationDelay: "-5s" }}>
          <rect x="108" y="128" width="264" height="74" rx="16" fill="url(#p3panel)" />
          <rect x="108.75" y="128.75" width="262.5" height="72.5" rx="15.25" stroke="url(#p3stroke)" strokeWidth="1.5" fill="none" opacity="0.4" />
          <rect x="132" y="150" width="72" height="6" rx="3" fill="#BFDBFE" opacity="0.4" />
          <rect x="132" y="168" width="120" height="6" rx="3" fill="#BFDBFE" opacity="0.2" />
        </g>
      </g>
      <circle cx="496" cy="52" r="3.5" fill="#7DD3FC" />
      <circle cx="72" cy="176" r="3.5" fill="#93C5FD" opacity="0.6" />
      <rect width="584" height="220" fill="url(#p3fade)" />
    </svg>
  );
}

const RAYS = [
  { angle: -27, opacity: 0.28 },
  { angle: -18, opacity: 0.45 },
  { angle: -9, opacity: 0.7 },
  { angle: 0, opacity: 0.9 },
  { angle: 9, opacity: 0.7 },
  { angle: 18, opacity: 0.45 },
  { angle: 27, opacity: 0.28 },
];

function RaysArt() {
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="p4bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1E1640" />
          <stop offset="1" stopColor="#241A4E" />
        </linearGradient>
        <linearGradient id="p4ray" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#C4B5FD" stopOpacity="0.85" />
          <stop offset="1" stopColor="#7C3AED" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="p4orb" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#8B5CF6" stopOpacity="0.22" />
          <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="p4circle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#DDD6FE" stopOpacity="0.9" />
          <stop offset="1" stopColor="#7C3AED" stopOpacity="0.15" />
        </linearGradient>
        <Fade id="p4fade" to="0.55" />
      </defs>
      <rect width="584" height="220" fill="url(#p4bg)" />
      <circle cx="292" cy="196" r="180" fill="url(#p4orb)" />
      <g stroke="url(#p4ray)" strokeWidth="1.5" strokeLinecap="round" style={{ animation: "glowPulse 6s ease-in-out infinite" }}>
        {RAYS.map((ray) => (
          <line
            key={ray.angle}
            x1="292"
            y1="214"
            x2="292"
            y2="14"
            transform={ray.angle === 0 ? undefined : `rotate(${ray.angle} 292 214)`}
            opacity={ray.opacity}
          />
        ))}
      </g>
      <circle cx="292" cy="128" r="66" stroke="url(#p4circle)" strokeWidth="1.5" fill="none" />
      <circle cx="292" cy="128" r="96" stroke="url(#p4circle)" strokeWidth="1.5" fill="none" opacity="0.35" />
      <circle cx="292" cy="62" r="5" fill="#DDD6FE" />
      <circle cx="331" cy="75" r="4" fill="#DDD6FE" opacity="0.55" />
      <circle cx="355" cy="108" r="3.5" fill="#DDD6FE" opacity="0.25" />
      <rect width="584" height="220" fill="url(#p4fade)" />
    </svg>
  );
}

export const ART: Record<WorkArt, () => React.JSX.Element> = {
  orbit: OrbitArt,
  chart: ChartArt,
  panels: PanelsArt,
  rays: RaysArt,
};
