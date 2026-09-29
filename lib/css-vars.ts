import type { CSSProperties } from "react";

/**
 * 인라인 style 에 CSS 커스텀 프로퍼티(--sd, --ci …)를 넣기 위한 보조.
 * React.CSSProperties 에는 `--*` 키가 없어서 타입만 넓혀 준다.
 */
export function cssVars(vars: Record<`--${string}`, string | number>, base?: CSSProperties): CSSProperties {
  return { ...base, ...vars } as CSSProperties;
}
