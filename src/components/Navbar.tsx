import { useEffect } from "react";
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

  return (
    <>
      <div className="header">
        <a href="/#landingDiv" className="navbar-title" data-cursor="disable">
          {profile.logoText}
        </a>
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