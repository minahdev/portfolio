import { contact, footer, links } from "@/lib/content";
import { GitHubIcon, LinkedInIcon, MailIcon, SmallArrowIcon } from "./icons";

export function Contact() {
  return (
    <section className="panel sec" id="contact" data-nav-key="contact">
      <div className="wrap">
        <div className="contact-shell reveal">
          <div className="conic" aria-hidden="true">
            <i />
          </div>
          <div className="contact-panel">
            <div className="cblob cblob--a" aria-hidden="true" />
            <div className="cblob cblob--b" aria-hidden="true" />

            <div className="contact-copy">
              <div className="eyebrow">
                <span className="eyebrow-n">{contact.eyebrowNumber}</span>
                <span className="eyebrow-rule" aria-hidden="true" />
                <span className="eyebrow-t">{contact.eyebrow}</span>
              </div>
              <h2 className="sec-title">{contact.title}</h2>
              <p className="sec-desc">{contact.description}</p>
            </div>

            <div className="contact-side">
              <span className="mag" data-magnetic="">
                <a className="btn btn--solid" href={`mailto:${links.email}`}>
                  <MailIcon />
                  {links.email}
                </a>
              </span>
              <div className="contact-links">
                <a href={links.github.href}>
                  <GitHubIcon size={16} />
                  {links.github.label}
                </a>
                {links.linkedin && (
                  <a href={links.linkedin.href}>
                    <LinkedInIcon />
                    {links.linkedin.label}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <div className="wrap footer-in">
          <p>{footer.note}</p>
          <div className="footer-right">
            <span className="footer-stamp">{footer.stamp}</span>
            <a className="to-top" href="#hero">
              {footer.toTop}
              <SmallArrowIcon direction="up" />
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
