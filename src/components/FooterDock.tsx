import { useEffect, useRef, useState } from "react";
import {
  FaHouse,
  FaRoute,
  FaGraduationCap,
  FaBriefcase,
  FaLightbulb,
  FaEnvelope,
} from "react-icons/fa6";
import { smoother } from "./Navbar";
import "./styles/FooterDock.css";

type Tile = {
  /** Matches navLinks order / existing section ids — nothing new invented. */
  id: string;
  href: string;
  /** Uppercase caption shown under the dock. */
  label: string;
  Icon: typeof FaHouse;
};

const TILES: Tile[] = [
  { id: "landingDiv", href: "#landingDiv", label: "Home", Icon: FaHouse },
  { id: "journey", href: "#journey", label: "My Journey", Icon: FaRoute },
  {
    id: "qualifications",
    href: "#qualifications",
    label: "My Qualifications",
    Icon: FaGraduationCap,
  },
  { id: "work", href: "#work", label: "My Work", Icon: FaBriefcase },
  {
    id: "capabilities",
    href: "#capabilities",
    label: "My Capabilities",
    Icon: FaLightbulb,
  },
  { id: "connect", href: "#connect", label: "Connect", Icon: FaEnvelope },
];

const MAX_TILT = 12;
const MAX_PUPIL = 4;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const FooterDock = () => {
  const dockRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const pupilRefs = useRef<(HTMLSpanElement | null)[][]>(
    TILES.map(() => [null, null]),
  );

  const [activeId, setActiveId] = useState(TILES[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // ---- Active tile while scrolling -----------------------------------------
  useEffect(() => {
    const sections = TILES.map(({ id }) => document.getElementById(id)).filter(
      Boolean,
    ) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // With a centred band, the section covering the middle wins.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const match = TILES.find(({ id }) => id === visible.target.id);
        if (match) setActiveId(match.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // ---- Eyes follow the cursor (desktop only, ref-driven, rAF-throttled) ----
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const applyPointer = () => {
      frame = 0;

      if (reduceMotion.matches) return;

      tileRefs.current.forEach((tile, index) => {
        if (!tile) return;

        const rect = tile.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = pointerX - centerX;
        const dy = pointerY - centerY;
        const distance = Math.hypot(dx, dy);

        // Pull the pupils toward the cursor, capped at 4px.
        const reach = Math.min(MAX_PUPIL, distance / 18);
        const offsetX = distance ? (dx / distance) * reach : 0;
        const offsetY = distance ? (dy / distance) * reach : 0;

        pupilRefs.current[index]?.forEach((pupil) => {
          if (!pupil) return;
          pupil.style.transform = `translate(${offsetX.toFixed(
            2,
          )}px, ${offsetY.toFixed(2)}px)`;
        });

        tile.style.transform = `perspective(400px) rotateX(${clamp(
          -dy / 14,
          -MAX_TILT,
          MAX_TILT,
        )}deg) rotateY(${clamp(dx / 14, -MAX_TILT, MAX_TILT)}deg)`;
      });
    };

    const reset = () => {
      tileRefs.current.forEach((tile, index) => {
        if (!tile) return;
        tile.style.transform = "perspective(400px) rotateX(0deg) rotateY(0deg)";
        pupilRefs.current[index]?.forEach((pupil) => {
          if (pupil) pupil.style.transform = "translate(0px, 0px)";
        });
      });
    };

    const onMouseMove = (event: MouseEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(applyPointer);
    };

    // Coarse pointers (touch) have no cursor to track, so don't even listen.
    const canTrack = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canTrack) return;

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", reset);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", reset);
    };
  }, []);

  const scrollTo = (href: string) => {
    const target = document.querySelector(href);
    if (!target) return;

    // Desktop runs GSAP ScrollSmoother, so route through it to avoid fighting.
    if (window.innerWidth > 1024 && smoother) {
      smoother.scrollTo(target, true, "top top");
      return;
    }
    target.scrollIntoView({ behavior: "smooth" });
  };

  const activeLabel =
    TILES.find(({ id }) => id === activeId)?.label ?? TILES[0].label;
  const hoveredLabel = TILES.find(({ id }) => id === hoveredId)?.label;

  return (
    <nav className="footer-dock" ref={dockRef} aria-label="Section navigation">
      <ul className="dock-list">
        {TILES.map(({ id, href, label, Icon }, index) => (
          <li className="dock-tile-wrap" key={id}>
            <a
              className="dock-tile"
              href={href}
              ref={(node) => {
                tileRefs.current[index] = node;
              }}
              data-active={id === activeId}
              aria-label={label}
              aria-current={id === activeId ? "true" : undefined}
              data-cursor="disable"
              onClick={(event) => {
                event.preventDefault();
                scrollTo(href);
              }}
              onMouseEnter={() => setHoveredId(id)}
              onFocus={() => setHoveredId(id)}
            >
              <span className="dock-eyes" aria-hidden="true">
                {[0, 1].map((eye) => (
                  <span className="dock-eye" key={eye}>
                    <span
                      className="dock-pupil"
                      ref={(node) => {
                        if (!pupilRefs.current[index]) pupilRefs.current[index] = [
                          null,
                          null,
                        ];
                        pupilRefs.current[index][eye] = node;
                      }}
                    />
                  </span>
                ))}
              </span>
              <Icon className="dock-icon" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>

      <span className="dock-caption" aria-live="polite">
        {hoveredLabel ?? activeLabel}
      </span>
    </nav>
  );
};

export default FooterDock;