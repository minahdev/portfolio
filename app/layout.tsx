import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Noto_Sans_KR, Space_Grotesk } from "next/font/google";
import { site } from "@/lib/content";
import { DECK_QUERY } from "@/lib/site-behaviors";
import "./globals.css";

// 라틴 서체 둘은 next/font 로 셀프호스팅한다. globals.css 가 --font-grotesk / --font-mono 로 참조한다.
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
// 한글은 Pretendard(CDN) 가 1순위. Noto Sans KR 은 그게 못 뜰 때만 쓰는 폴백이라 미리 받지 않는다.
const notoKr = Noto_Sans_KR({ variable: "--font-noto-kr", preload: false });

const PRETENDARD_CSS =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css";

/**
 * 첫 페인트 전에 <html> 에 .js / .js-deck 을 심는다.
 * 하이드레이션 뒤에 붙이면 "긴 세로 스크롤 → 덱" 으로 레이아웃이 한 번 튄다.
 * 최종 판정은 site-behaviors 가 다시 하므로 여기서는 미디어쿼리만 본다.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(window.matchMedia('${DECK_QUERY}').matches){d.classList.add('js-deck');}}catch(e){}})();`;

const title = `${site.name} · ${site.role} 포트폴리오`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  openGraph: {
    title,
    description: site.description,
    url: "/",
    siteName: title,
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08070F",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: bootScript 가 하이드레이션 전에 class 를 바꿔 두므로 그 차이는 무시한다
    <html lang="ko" className={`${grotesk.variable} ${mono.variable} ${notoKr.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href={PRETENDARD_CSS} />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
