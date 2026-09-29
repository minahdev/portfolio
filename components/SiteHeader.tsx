import { links, nav, site } from "@/lib/content";
import { cssVars } from "@/lib/css-vars";
import { BrandMark, GitHubIcon } from "./icons";

const seq = cssVars({ "--sd": ".20s" });

export function SiteHeader() {
  return (
    <header className="site-header" id="top">
      <div className="wrap header-in">
        <div className="brand seq" style={seq}>
          <BrandMark />
          <span className="brand-name">{site.name}</span>
          <span className="brand-tag">{site.brandTag}</span>
        </div>

        <button
          className="nav-toggle seq"
          type="button"
          id="navToggle"
          aria-expanded={false}
          aria-controls="navPanel"
          aria-label="메뉴 열기"
          style={seq}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className="nav seq" id="navPanel" aria-label="주요 메뉴" style={seq}>
          {nav.map((item) => (
            <a key={item.key} className="nav-link" href={item.href} data-nav={item.key}>
              {item.label}
            </a>
          ))}
          <a className="icon-link" href={links.github.href} aria-label="GitHub 프로필">
            <GitHubIcon size={18} />
          </a>
          <span className="mag" data-magnetic="" style={{ marginLeft: 8 }}>
            <a className="btn btn--sm btn--solid" href="#contact">
              프로젝트 문의
            </a>
          </span>
        </nav>
      </div>
    </header>
  );
}
