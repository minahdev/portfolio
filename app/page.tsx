import { About } from "@/components/About";
import { Grain, ProgressBar, Rail } from "@/components/Chrome";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { SiteBehaviors } from "@/components/SiteBehaviors";
import { SiteHeader } from "@/components/SiteHeader";
import { Skills } from "@/components/Skills";
import { WorksPanel } from "@/components/Works";
import { worksPages } from "@/lib/content";

export default function Page() {
  return (
    <>
      <a className="skip" href="#main">
        본문으로 건너뛰기
      </a>
      <ProgressBar />
      <Grain />
      <SiteHeader />

      {/* 덱 모드(≥992×700)에서는 body 가 아니라 이 .deck 이 실제 스크롤러다 */}
      <div className="deck" id="deck">
        <main id="main" tabIndex={-1}>
          <Hero />
          {worksPages.map((page, i) => (
            <WorksPanel key={i} page={page} index={i} />
          ))}
          <About />
          <Skills />
          <Contact />
        </main>
      </div>

      <Rail />
      <SiteBehaviors />
    </>
  );
}
