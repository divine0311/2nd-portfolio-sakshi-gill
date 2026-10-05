import { useEffect, useId, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import type { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import { profile } from "../data/sakshi";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);
export let smoother: ScrollSmoother | undefined;

/**
 * The one navbar for the whole site: the home page renders it through
 * MainContainer, the blog listing and article pages mount it from
 * src/site/siteNav.tsx. `active` only marks the current page - the links,
 * the logo and the email are identical everywhere, so the blog is never a
 * separate site with its own menu.
 */
const Navbar = ({ active = "home" }: { active?: "home" | "blog" }) => {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const wrapper = document.getElementById("smooth-wrapper");
    const content = document.getElementById("smooth-content");
    // Only the home page has a smooth-scroll container. The blog and the
    // studio scroll natively, so the trial plugin is never loaded there.
    if (!wrapper || !content) return;

    let disposed = false;

    (async () => {
      const { ScrollSmoother } = await import("gsap-trial/ScrollSmoother");
      if (disposed) return;
      gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
      smoother = ScrollSmoother.create({
        wrapper,
        content,
        smooth: 1.7,
        speed: 1.7,
        effects: true,
        autoResize: true,
        ignoreMobileResize: true,
      });

      smoother.scrollTop(0);
      smoother.paused(true);
    })();

    const onResize = () => smoother?.refresh(true);
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Close the menu on Escape, and hand focus back to the button that opened it.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // The menu is a short list under the header, so the page behind it stays
  // visible; only the scroll is held to stop the page moving behind the panel.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <div className="header">
        <a href="/#landingDiv" className="navbar-title" data-cursor="disable">
          {profile.logoText}
        </a>

        {/* Below 900px the links move into this menu, because the email address
            alone does not fit next to the logo on a phone. */}
        <button
          type="button"
          className="navbar-toggle"
          ref={toggleRef}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="navbar-toggle-bar" aria-hidden="true" />
          <span className="navbar-toggle-bar" aria-hidden="true" />
        </button>

        <div className="header-right">
          {/* Full page load: the blog is its own entry, not an anchor. */}
          <a
            href="/blog"
            className="navbar-blog"
            data-cursor="disable"
            aria-current={active === "blog" ? "page" : undefined}
          >
            Blog
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="navbar-connect"
            data-cursor="disable"
          >
            {profile.email}
          </a>
        </div>
      </div>

      <div className="navbar-menu" id={menuId} hidden={!open}>
        <nav aria-label="Site">
          <a href="/#landingDiv" onClick={() => setOpen(false)}>
            Home
          </a>
          <a
            href="/blog"
            onClick={() => setOpen(false)}
            aria-current={active === "blog" ? "page" : undefined}
          >
            Blog
          </a>
          <a href="/#work" onClick={() => setOpen(false)}>
            My Work
          </a>
          <a href="/#capabilities" onClick={() => setOpen(false)}>
            My Capabilities
          </a>
          <a href="/#connect" onClick={() => setOpen(false)}>
            Connect
          </a>
        </nav>
        <a
          className="navbar-menu-email"
          href={`mailto:${profile.email}`}
          onClick={() => setOpen(false)}
        >
          {profile.email}
        </a>
      </div>

      {active === "home" && (
        <>
          <div className="landing-circle1"></div>
          <div className="landing-circle2"></div>
          <div className="nav-fade"></div>
        </>
      )}
    </>
  );
};

export default Navbar;