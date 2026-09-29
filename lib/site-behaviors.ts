/**
 * 페이지 동작 전부 — 스크롤 시스템(진행 바·스티키 헤더·레일·패럴랙스·활성 내비), 스크롤 리빌,
 * 모바일 내비, 프로젝트 필터, 커서 스포트라이트, 카드 3D 틸트, 마그네틱 버튼, 덱 모드 스위치.
 *
 * 시안(portfolio-visual.html)의 스크립트를 그대로 옮기되, React 가 붙였다 뗄 수 있도록
 * 모든 리스너·옵저버·타이머를 되돌리는 cleanup 을 돌려준다.
 * 마크업은 서버에서 한 번 렌더된 뒤 다시 렌더되지 않으므로, 여기서 DOM 을 직접 만져도 React 와 충돌하지 않는다.
 */

/**
 * 덱(한 화면씩 스냅)이 켜지는 조건. globals.css 의 `@media (min-width:992px) and (min-height:700px)` 와 같은 값이어야 한다.
 * 값이 어긋나도 갈라지지 않도록, 실제 판정은 CSS 가 .deck 에 심는 --deck-ready 를 읽어서 한다 (deckApplies).
 */
export const DECK_QUERY = "(min-width: 992px) and (min-height: 700px)";

type Cleanup = () => void;

export function mountSiteBehaviors(): Cleanup {
  const doc = document;
  const docEl = doc.documentElement;
  const cleanups: Cleanup[] = [];
  let disposed = false;
  cleanups.push(() => {
    disposed = true;
  });

  const $ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = doc) => root.querySelector<T>(sel);
  const $$ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = doc) =>
    Array.from(root.querySelectorAll<T>(sel));

  function listen(target: EventTarget, type: string, fn: EventListener, opts?: AddEventListenerOptions) {
    target.addEventListener(type, fn, opts);
    cleanups.push(() => target.removeEventListener(type, fn, opts));
  }

  function mq(q: string) {
    try {
      return !!(window.matchMedia && window.matchMedia(q).matches);
    } catch {
      return false;
    }
  }

  const reduce = mq("(prefers-reduced-motion: reduce)");
  const fine = mq("(pointer: fine)");
  const hasIO = "IntersectionObserver" in window;
  // 폭 판정은 각 핸들러 안에서 실시간으로 한다 — 좁게 로드한 뒤 넓히는 경우를 놓치지 않도록
  const isWide = () => window.innerWidth >= 768;
  const rich = () => !reduce && fine;

  docEl.classList.add("js"); // JS 가 켜 주는 기능들(레일 등)의 스위치
  cleanups.push(() => docEl.classList.remove("js", "js-deck"));

  const deck = $("#deck");
  const panels = $$(".panel");
  let deckOn = false;

  /** CSS 덱 블록이 .deck 에 심어 두는 --deck-ready 로 "CSS 가 실제로 덱을 열었는가"를 판정한다 */
  function deckApplies() {
    if (!deck || !panels.length) return false;
    let v = "";
    try {
      v = (window.getComputedStyle(deck).getPropertyValue("--deck-ready") || "").trim();
    } catch {
      v = "";
    }
    if (v === "1") return true;
    if (v === "0") return false;
    return mq(DECK_QUERY);
  }

  /** 레이아웃 높이가 바뀌었을 때 스크롤 시스템에 다시 재라고 알리는 신호 */
  function refreshLayout() {
    doc.dispatchEvent(new Event("layout:refresh"));
  }

  /* ------------------------------------------------------------------
     0) 스크롤러 추상화 — 덱 모드에서는 스크롤 주체가 window 가 아니라 .deck 이다.
        진행 바·헤더·레일·패럴랙스·활성 내비가 전부 여기를 본다.
     ------------------------------------------------------------------ */
  function scTop() {
    if (deckOn && deck) return deck.scrollTop;
    return window.pageYOffset || docEl.scrollTop || 0;
  }
  function scView() {
    if (deckOn && deck) return deck.clientHeight || window.innerHeight || 800;
    return window.innerHeight || 800;
  }
  function scMax() {
    const m = deckOn && deck ? deck.scrollHeight - deck.clientHeight : (docEl.scrollHeight || 0) - (window.innerHeight || 0);
    return m < 1 ? 1 : m;
  }
  /** 스크롤 컨테이너 내부 좌표계에서의 요소 top */
  function scOffset(el: Element) {
    const r = el.getBoundingClientRect();
    if (deckOn && deck) return r.top - deck.getBoundingClientRect().top + deck.scrollTop;
    return r.top + (window.pageYOffset || docEl.scrollTop || 0);
  }
  function goTo(el: Element | null) {
    if (!el) return;
    try {
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    } catch {
      el.scrollIntoView(true);
    }
  }
  /** 포커스가 아직 body 에 있을 때만 .deck 으로 넘겨 ↓/PageDown/Space/Home/End 가 처음부터 네이티브로 먹게 한다 */
  function focusDeck() {
    if (!deckOn || !deck) return;
    if (doc.activeElement && doc.activeElement !== doc.body) return;
    try {
      deck.focus({ preventScroll: true });
    } catch {
      deck.focus();
    }
  }

  const modeHooks: Array<(on: boolean) => void> = [];
  const onMode = (fn: (on: boolean) => void) => modeHooks.push(fn);

  /* ------------------------------------------------------------------
     1) 스크롤 상태: 진행 바 · 스티키 헤더 · 레일(점 내비) · 패럴랙스 + .is-tall 안전장치 (단일 rAF)
     ------------------------------------------------------------------ */
  (function scrollSystem() {
    const bar = $("#progressBar");
    const header = $(".site-header");
    const rail = $("#rail");
    const thumb = $("#railThumb");
    const hint = $(".scroll-hint");
    const blobs = reduce ? [] : $$("[data-parallax]");
    const navLinks = $$(".nav-link");
    const marks = $$<HTMLButtonElement>(".rail-mark");

    const secs = panels.map((el) => ({
      el,
      id: el.id || "",
      key: el.getAttribute("data-nav-key") || "",
      top: 0,
      bottom: 0,
    }));

    let ticking = false;
    let maxScroll = 1;
    let bases: Array<{ el: HTMLElement; center: number; base: number; factor: number }> = [];
    let lastActive: string | null = null;
    let railTravel = 0;
    let wide = true;
    let hintGone = false;

    /* 패널의 "흐름 콘텐츠" 높이 — 패딩 + 흐름에 있는 직계 자식(마진 포함)의 합.
       scrollHeight 를 쓰면 안 된다: 오로라 블롭(absolute)·충격파(transform) 같은 장식이
       패널 밖으로 삐져나온 만큼이 섞여 들어가 멀쩡한 장을 "긴 장"으로 오판하고,
       그러면 스냅이 풀린 히어로가 화면보다 짧아져 첫 화면이 다음 장으로 끌려간다. */
    function contentHeight(p: HTMLElement) {
      const cs = getComputedStyle(p);
      let h = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      for (const child of Array.from(p.children) as HTMLElement[]) {
        const c = getComputedStyle(child);
        if (c.position === "absolute" || c.position === "fixed") continue;
        h += child.offsetHeight + parseFloat(c.marginTop) + parseFloat(c.marginBottom);
      }
      return h;
    }

    /* 가두지 않기: 내용이 컨테이너보다 긴 패널만 스냅을 푼다.
       그런 패널이 하나라도 있으면 컨테이너 전체를 proximity 로 낮춘다 — mandatory 는
       스냅 대상이 아닌 구간에 머무는 사용자를 가장 가까운 스냅 지점으로 도로 끌고 가기 때문이다. */
    function tallCheck() {
      let tall = false;
      panels.forEach((p) => p.classList.remove("is-tall"));
      deck?.classList.remove("is-loose");
      if (!deckOn || !deck) return;
      const h = deck.clientHeight;
      if (h < 1) return;
      panels.forEach((p) => {
        if (contentHeight(p) > h + 2) {
          p.classList.add("is-tall");
          tall = true;
        }
      });
      if (tall) deck.classList.add("is-loose");
    }

    function remeasure() {
      maxScroll = scMax();

      secs.forEach((s) => {
        const r = s.el.getBoundingClientRect();
        s.top = scOffset(s.el);
        s.bottom = s.top + r.height;
      });

      // 패럴랙스 기준 위치는 transform 이 없는 상태에서 잰다.
      // base = 스크롤 최상단(y=0)에서의 rel — 이걸 빼야 맨 위에서 오프셋이 정확히 0 이 된다.
      const vh0 = scView();
      bases = blobs.map((el) => {
        el.style.transform = "";
        const rb = el.getBoundingClientRect();
        const center = scOffset(el) + rb.height / 2;
        return { el, center, base: vh0 / 2 - center, factor: parseFloat(el.getAttribute("data-parallax") || "") || 0.25 };
      });

      wide = isWide();

      railTravel = 0;
      if (rail && thumb && rail.clientHeight > 0) {
        railTravel = Math.max(0, rail.clientHeight - thumb.offsetHeight);
      }

      // 점 위치는 실제 패널 오프셋으로 (균등 배치가 아니라)
      const railH = rail ? rail.clientHeight : 0;
      const railPad = (railH - railTravel) / 2;
      marks.forEach((m) => {
        const key = m.getAttribute("data-target");
        const s = secs.find((x) => x.id === key);
        if (!s) return;
        let ratio = s.top / maxScroll;
        if (ratio < 0) ratio = 0;
        if (ratio > 1) ratio = 1;
        if (railH > 0 && railTravel > 0) {
          m.style.top = (railPad + railTravel * ratio).toFixed(1) + "px";
        } else {
          m.style.top = (ratio * 100).toFixed(2) + "%";
        }
      });
    }

    function setActive(id: string | null) {
      if (id === lastActive) return;
      lastActive = id;

      const key = secs.find((s) => s.id === id)?.key || "";

      navLinks.forEach((a) => {
        a.classList.toggle("is-active", !!key && a.getAttribute("data-nav") === key);
      });

      let found = false;
      marks.forEach((m) => {
        if (id && m.getAttribute("data-target") === id) {
          found = true;
          m.classList.add("is-active");
          m.setAttribute("aria-current", "true");
          m.tabIndex = 0;
        } else {
          m.classList.remove("is-active");
          m.removeAttribute("aria-current");
          m.tabIndex = -1;
        }
      });
      // 로빙 tabindex: 최소 한 개는 탭으로 닿아야 한다
      if (!found && marks.length) marks[0].tabIndex = 0;
    }

    function frame() {
      ticking = false;
      if (disposed) return;

      const y = scTop();
      const vh = scView();
      let p = y / maxScroll;
      if (p < 0) p = 0;
      if (p > 1) p = 1;

      if (bar) bar.style.transform = "scaleX(" + p.toFixed(4) + ")";

      header?.classList.toggle("is-stuck", y > 12);

      if (thumb && railTravel > 0) {
        thumb.style.transform = "translate3d(0," + (p * railTravel).toFixed(2) + "px,0)";
      }

      if (hint && !hintGone && y > 8) {
        hintGone = true;
        hint.classList.add("is-gone");
      }

      // 활성 장: 스크롤러 중앙선이 어느 패널 안에 있는가
      const mid = y + vh * 0.5;
      let active: string | null = null;
      for (const s of secs) {
        if (mid >= s.top && mid < s.bottom) {
          active = s.id;
          break;
        }
      }
      if (!active && secs.length) {
        active = y <= 0 ? secs[0].id : secs[secs.length - 1].id;
      }
      setActive(active);

      // 패럴랙스: 스크롤보다 느리게 (모바일·reduce 에서는 비활성)
      for (const b of bases) {
        if (!wide) {
          b.el.style.transform = "";
          continue;
        }
        const rel = y + vh / 2 - b.center;
        let off = (rel - b.base) * b.factor;
        if (off > 180) off = 180;
        if (off < -180) off = -180;
        b.el.style.transform = "translate3d(0," + off.toFixed(2) + "px,0)";
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(frame);
    }

    function onResize() {
      if (disposed) return;
      tallCheck();
      remeasure();
      onScroll();
    }

    // 스크롤 주체가 모드에 따라 바뀐다 — 바뀔 때마다 다시 붙인다
    let bound: EventTarget | null = null;
    function bind() {
      const t: EventTarget = deckOn && deck ? deck : window;
      if (t === bound) return;
      if (bound) bound.removeEventListener("scroll", onScroll);
      bound = t;
      bound.addEventListener("scroll", onScroll, { passive: true });
    }
    cleanups.push(() => {
      if (bound) bound.removeEventListener("scroll", onScroll);
      bound = null;
      blobs.forEach((el) => {
        el.style.transform = "";
      });
    });

    onMode((on) => {
      if (deck) {
        if (on) {
          deck.setAttribute("tabindex", "0");
          focusDeck();
        } else {
          deck.removeAttribute("tabindex");
        }
      }
      bind();
      lastActive = null;
      onResize();
      // 스냅/헤더 고정이 적용된 뒤 한 번 더 (레이아웃이 한 프레임 늦게 잡히는 경우)
      window.requestAnimationFrame(onResize);
    });

    listen(window, "resize", onResize, { passive: true });
    listen(doc, "layout:refresh", onResize);
    listen(window, "load", onResize);
    // 폰트가 늦게 오면 높이가 바뀐다 — 로드 뒤 한 번 더 잰다 (getBBox/getComputedStyle 함정)
    doc.fonts?.ready.then(onResize).catch(() => {});

    /* 점 내비: 진짜 버튼 + 로빙 tabindex (전역 keydown 은 건드리지 않는다) */
    marks.forEach((m) => {
      m.tabIndex = -1;
      listen(m, "click", () => goTo(doc.getElementById(m.getAttribute("data-target") || "")));
    });
    if (marks.length) marks[0].tabIndex = 0;

    if (rail) {
      listen(rail, "keydown", (e) => {
        const k = (e as KeyboardEvent).key;
        if (k !== "ArrowUp" && k !== "ArrowDown" && k !== "Home" && k !== "End") return;
        const idx = marks.indexOf(doc.activeElement as HTMLButtonElement);
        if (idx < 0) return;
        let n = idx;
        if (k === "ArrowUp") n = idx - 1;
        else if (k === "ArrowDown") n = idx + 1;
        else if (k === "Home") n = 0;
        else n = marks.length - 1;
        n = Math.min(Math.max(n, 0), marks.length - 1);
        e.preventDefault();
        marks[n].focus();
        goTo(doc.getElementById(marks[n].getAttribute("data-target") || ""));
      });
    }

    /* 패널을 가리키는 내부 앵커는 스크롤러 기준으로 부드럽게 */
    listen(doc, "click", (e) => {
      const a = (e.target as Element | null)?.closest("a");
      if (!a) return;
      if (a.target && a.target !== "_self") return;
      const href = a.getAttribute("href") || "";
      if (href.charAt(0) !== "#" || href.length < 2) return;
      const t = doc.getElementById(href.slice(1));
      if (!t || !t.classList.contains("panel")) return;
      e.preventDefault();
      goTo(t);
    });
  })();

  /* ------------------------------------------------------------------
     2) 스크롤 리빌 — 정지 상태는 항상 보임. 화면 아래 요소만 무장.
        덱 모드에서는 옵저버 root 가 .deck 이어야 동작한다.
     ------------------------------------------------------------------ */
  let revealOb: IntersectionObserver | null = null;
  let revealTimer: number | null = null;
  let armedList: HTMLElement[] = [];
  let sweepTicks = 0;

  function markIn(el: HTMLElement) {
    if (!el.classList.contains("is-armed") || el.classList.contains("is-in")) return;
    el.classList.add("is-in");
    el.setAttribute("data-revealed", "1");
    // 리빌이 끝나면 클래스를 떼어 기본 상태(.reveal{opacity:1})로 되돌린다
    window.setTimeout(() => {
      el.style.transitionDelay = "";
      el.classList.remove("is-armed", "is-in");
    }, 1600);
  }

  function stopSweep() {
    if (revealTimer) {
      window.clearInterval(revealTimer);
      revealTimer = null;
    }
  }

  // 안전장치: IntersectionObserver 가 죽어도 화면에 들어온 것은 반드시 보인다.
  // 30초가 지나면 남은 것을 전부 드러낸다 — 어떤 경우에도 숨은 채로 남지 않는다.
  function sweep() {
    sweepTicks += 1;
    const give = sweepTicks > 75;
    const vh = scView();
    const rest: HTMLElement[] = [];
    for (const el of armedList) {
      if (el.getAttribute("data-revealed") === "1") continue;
      if (give) {
        markIn(el);
        continue;
      }
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.95 && r.bottom > 0) markIn(el);
      else rest.push(el);
    }
    armedList = rest;
    if (give || !armedList.length) stopSweep();
  }

  function buildReveal() {
    revealOb?.disconnect();
    revealOb = null;
    if (reduce) {
      stopSweep();
      return;
    }

    const vh = scView();
    const fresh = $$(".reveal").filter((el) => {
      if (el.getAttribute("data-revealed") === "1") return false;
      if (el.classList.contains("is-armed")) return false;
      return el.getBoundingClientRect().top > vh * 0.9;
    });
    fresh.forEach((el) => el.classList.add("is-armed"));

    // 장 전환 연출: 같은 패널 안에서 70ms 스태거 (한 번만 재생)
    const groups = new Map<string, HTMLElement[]>();
    fresh.forEach((el) => {
      const k = el.closest<HTMLElement>(".panel")?.id || "_";
      const g = groups.get(k) || [];
      g.push(el);
      groups.set(k, g);
    });
    groups.forEach((group) => {
      group.forEach((el, i) => {
        el.style.transitionDelay = Math.min(i * 70, 420) + "ms";
      });
    });

    armedList = $$(".reveal.is-armed").filter((el) => el.getAttribute("data-revealed") !== "1");

    if (hasIO && armedList.length) {
      revealOb = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            revealOb?.unobserve(e.target);
            markIn(e.target as HTMLElement);
          });
        },
        { root: deckOn && deck ? deck : null, rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
      );
      armedList.forEach((el) => revealOb?.observe(el));
    }

    stopSweep();
    sweepTicks = 0;
    if (armedList.length) revealTimer = window.setInterval(sweep, 400);
  }

  onMode(() => buildReveal());
  cleanups.push(() => {
    revealOb?.disconnect();
    revealOb = null;
    stopSweep();
    // 무장만 되고 아직 안 드러난 요소를 숨긴 채 두지 않는다
    $$(".reveal.is-armed").forEach((el) => {
      el.style.transitionDelay = "";
      el.classList.remove("is-armed", "is-in");
    });
  });

  /* ------------------------------------------------------------------
     3) 모바일 내비 토글
     ------------------------------------------------------------------ */
  (function mobileNav() {
    const btn = $("#navToggle");
    const panel = $("#navPanel");
    if (!btn || !panel) return;

    function close() {
      panel!.classList.remove("is-open");
      btn!.setAttribute("aria-expanded", "false");
      btn!.setAttribute("aria-label", "메뉴 열기");
    }
    function open() {
      panel!.classList.add("is-open");
      btn!.setAttribute("aria-expanded", "true");
      btn!.setAttribute("aria-label", "메뉴 닫기");
    }

    listen(btn, "click", () => (panel.classList.contains("is-open") ? close() : open()));
    listen(panel, "click", (e) => {
      if ((e.target as Element | null)?.closest("a")) close();
    });
    listen(doc, "keydown", (e) => {
      if ((e as KeyboardEvent).key === "Escape" && panel.classList.contains("is-open")) {
        close();
        btn.focus();
      }
    });
    listen(window, "resize", () => {
      if (window.innerWidth >= 768) close();
    }, { passive: true });
    cleanups.push(close);
  })();

  /* ------------------------------------------------------------------
     4) 프로젝트 필터 탭 (여러 장에 걸친 카드를 함께 다룬다)
     ------------------------------------------------------------------ */
  (function filters() {
    const tabs = $$<HTMLButtonElement>(".tab");
    const items = $$(".work-item");
    const counts = $$("[data-count]");
    const grids = $$(".works");
    if (!tabs.length || !items.length) return;

    let hideTimer: number | null = null;
    const pendingShow: number[] = [];

    /* 어떤 장의 카드가 전부 빠지면 그 장에 빈 상태 안내를 띄운다 — 빈 화면 한 장에 스냅해 멈추는 일이 없도록 */
    function syncEmpty(key: string) {
      grids.forEach((g) => {
        const msg = $(".works-empty", g);
        if (!msg) return;
        const n = $$(".work-item", g).filter((el) => key === "all" || el.getAttribute("data-cat") === key).length;
        msg.hidden = n > 0;
      });
    }

    function apply(key: string) {
      if (hideTimer) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
      }
      pendingShow.splice(0).forEach((t) => window.clearTimeout(t));
      let shown = 0;
      let idx = 0;

      items.forEach((el) => {
        const match = key === "all" || el.getAttribute("data-cat") === key;
        if (match) {
          shown += 1;
          const wasHidden = el.hidden;
          if (wasHidden) {
            el.hidden = false;
            el.classList.add("is-out");
            void el.offsetWidth; // reflow → 페이드인이 실제로 재생되도록
          }
          const delay = wasHidden ? idx * 55 : 0;
          idx += 1;
          pendingShow.push(window.setTimeout(() => el.classList.remove("is-out"), delay));
        } else {
          el.classList.add("is-out");
        }
      });

      hideTimer = window.setTimeout(() => {
        items.forEach((el) => {
          if (el.classList.contains("is-out")) el.hidden = true;
        });
        hideTimer = null;
        refreshLayout();
      }, 320);

      tabs.forEach((t) => t.setAttribute("aria-pressed", t.getAttribute("data-filter") === key ? "true" : "false"));
      counts.forEach((c) => {
        c.textContent = "표시 중 " + shown + " / " + items.length;
      });
      syncEmpty(key);
      refreshLayout();
    }

    tabs.forEach((t) => listen(t, "click", () => apply(t.getAttribute("data-filter") || "all")));
    cleanups.push(() => {
      if (hideTimer) window.clearTimeout(hideTimer);
      pendingShow.forEach((t) => window.clearTimeout(t));
    });
  })();

  /* ------------------------------------------------------------------
     5) 마우스 추적 스포트라이트 (히어로 패널 전용 · pointer:fine)
     ------------------------------------------------------------------ */
  (function spotlight() {
    if (!rich()) return;
    const hero = $("#hero");
    const spot = $("#spot");
    if (!hero || !spot) return;

    let x = 0;
    let y = 0;
    let pending = false;

    function paint() {
      pending = false;
      spot!.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
    }

    listen(hero, "mousemove", (e) => {
      if (!isWide()) {
        spot.classList.remove("is-on");
        return;
      }
      const r = hero.getBoundingClientRect();
      x = (e as MouseEvent).clientX - r.left;
      y = (e as MouseEvent).clientY - r.top;
      if (!pending) {
        pending = true;
        window.requestAnimationFrame(paint);
      }
    }, { passive: true });
    listen(hero, "mouseenter", () => spot.classList.add("is-on"), { passive: true });
    listen(hero, "mouseleave", () => spot.classList.remove("is-on"), { passive: true });
  })();

  /* ------------------------------------------------------------------
     6) 카드 3D 틸트 (최대 4deg · pointer:fine)
     ------------------------------------------------------------------ */
  (function tilt() {
    if (!rich()) return;
    const MAX = 4;

    $$("[data-tilt]").forEach((el) => {
      let pending = false;
      let rx = 0;
      let ry = 0;

      function paint() {
        pending = false;
        el.style.transform = "rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      }

      // 커서를 따라올 때는 이징을 짧게 (기본 .3s 로는 질질 끌린다)
      listen(el, "mouseenter", () => {
        if (!isWide()) return;
        el.style.transition = "transform .12s linear";
      }, { passive: true });

      listen(el, "mousemove", (e) => {
        if (!isWide()) {
          el.style.transform = "";
          return;
        }
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const px = ((e as MouseEvent).clientX - r.left) / r.width - 0.5;
        const py = ((e as MouseEvent).clientY - r.top) / r.height - 0.5;
        ry = px * MAX * 2;
        rx = -py * MAX * 2;
        if (!pending) {
          pending = true;
          window.requestAnimationFrame(paint);
        }
      }, { passive: true });

      listen(el, "mouseleave", () => {
        el.style.transition = "transform .3s cubic-bezier(.22,.7,.2,1)";
        rx = 0;
        ry = 0;
        el.style.transform = "";
      }, { passive: true });
    });
  })();

  /* ------------------------------------------------------------------
     7) 마그네틱 CTA (최대 6px · pointer:fine)
     ------------------------------------------------------------------ */
  (function magnetic() {
    if (!rich()) return;
    const PULL = 6;
    const RANGE = 90;

    $$("[data-magnetic]").forEach((wrap) => {
      let pending = false;
      let tx = 0;
      let ty = 0;

      function paint() {
        pending = false;
        wrap.style.transform = "translate3d(" + tx.toFixed(2) + "px," + ty.toFixed(2) + "px,0)";
      }
      function reset() {
        tx = 0;
        ty = 0;
        wrap.style.transition = "transform .35s cubic-bezier(.22,.7,.2,1)";
        wrap.style.transform = "translate3d(0,0,0)";
      }

      listen(wrap, "mouseenter", () => {
        wrap.style.transition = "transform .12s linear";
      }, { passive: true });
      listen(wrap, "mousemove", (e) => {
        if (!isWide()) {
          wrap.style.transform = "";
          return;
        }
        const r = wrap.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const dx = (e as MouseEvent).clientX - (r.left + r.width / 2);
        const dy = (e as MouseEvent).clientY - (r.top + r.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const k = Math.min(1, RANGE / dist);
        tx = (dx / dist) * PULL * k;
        ty = (dy / dist) * PULL * k;
        if (!pending) {
          pending = true;
          window.requestAnimationFrame(paint);
        }
      }, { passive: true });
      listen(wrap, "mouseleave", reset, { passive: true });
    });
  })();

  /* ------------------------------------------------------------------
     8) 덱 모드 스위치 — 마지막. 여기서 위의 모든 훅이 처음 실행된다.
        조건을 벗어나면(좁거나 낮은 화면) 평범한 세로 스크롤로 돌아간다.
     ------------------------------------------------------------------ */
  (function deckMode() {
    let inited = false;
    function apply(on: boolean) {
      const next = !!(on && deck && panels.length);
      if (inited && next === deckOn) return;
      inited = true;
      deckOn = next;
      docEl.classList.toggle("js-deck", deckOn);
      modeHooks.forEach((fn) => {
        try {
          fn(deckOn);
        } catch {
          // 훅 하나가 죽어도 나머지는 돈다
        }
      });
    }

    // 미디어쿼리 값이 아니라 "CSS 가 실제로 덱을 열었는가"로 판정한다
    const evaluate = () => {
      if (!disposed) apply(deckApplies());
    };
    evaluate();

    let m: MediaQueryList | null = null;
    try {
      m = window.matchMedia ? window.matchMedia(DECK_QUERY) : null;
    } catch {
      m = null;
    }
    if (m) listen(m, "change", evaluate);

    // DECK_QUERY 와 CSS 가 어긋나더라도 리사이즈에서 따라잡는다
    let rt: number | null = null;
    listen(window, "resize", () => {
      if (rt) window.clearTimeout(rt);
      rt = window.setTimeout(() => {
        rt = null;
        evaluate();
      }, 160);
    }, { passive: true });
    cleanups.push(() => {
      if (rt) window.clearTimeout(rt);
    });
  })();

  return () => {
    cleanups.reverse().forEach((fn) => fn());
    cleanups.length = 0;
  };
}
