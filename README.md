# portfolio

`minahdev.cloud` 에 올라가는 1인 포트폴리오 사이트. Next.js(App Router) + TypeScript + Tailwind, Vercel 배포.

디자인 시안(`portfolio-visual.html`, 다크 방향)을 그대로 옮긴 것이라 색·간격·모션 타이밍은 시안이 기준이다.

## 내용 고치기

- **텍스트·프로젝트·경력·링크** → `lib/content.ts` 한 파일. 대괄호 `[ ]` 가 아직 안 채운 자리다.
- 프로젝트가 늘면 `works` 배열에 항목을 추가하면 된다. 두 개마다 장(패널)이 자동으로 늘고 레일 점도 따라온다.
- 썸네일은 사진이 아니라 `components/art.tsx` 의 인라인 SVG 다. 새 프로젝트는 넷 중 하나를 골라 `art` 에 적는다.

## 구조

```
app/layout.tsx        서체(next/font + Pretendard CDN), 메타, 첫 페인트 전 .js/.js-deck 부트 스크립트
app/page.tsx          섹션 조립
app/globals.css       시안 CSS 원본 (서체 이름만 변수로 바뀜)
components/           섹션별 마크업 (서버 컴포넌트)
components/SiteBehaviors.tsx  마운트 뒤 동작을 붙이는 클라이언트 컴포넌트
lib/site-behaviors.ts 스크롤·덱·리빌·필터·틸트·마그네틱 — 시안 스크립트를 cleanup 가능하게 옮긴 것
lib/content.ts        콘텐츠 데이터
```

## 명령

```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드 (타입 검사 포함)
npm run lint         # eslint
npx tsc --noEmit     # 타입만 따로
```

## 확인할 것

- 덱(한 화면씩 스냅)은 992×700 이상에서만 켜진다. 그 밖에서는 평범한 세로 스크롤 + 햄버거 내비.
- `prefers-reduced-motion` 이면 CSS 애니메이션과 JS 효과(스포트라이트·틸트·마그네틱·패럴랙스) 둘 다 꺼진다.
- `/pace` 는 `https://pace.minahdev.cloud` 로 보낸다 (`next.config.ts`).
