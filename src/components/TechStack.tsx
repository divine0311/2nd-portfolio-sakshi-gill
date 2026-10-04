import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { IconType } from "react-icons";
import {
  FaWandMagicSparkles,
  FaFilm,
  FaVideo,
  FaArrowDown,
  FaClapperboard,
  FaCloud,
  FaBolt,
  FaPlay,
  FaScissors,
  FaSliders,
  FaFileLines,
} from "react-icons/fa6";
import {
  SiHubspot,
  SiSemrush,
  SiGoogleads,
  SiMeta,
  SiMailchimp,
  SiOpenai,
  SiGooglegemini,
  SiAnthropic,
  SiGooglecloud,
  SiPerplexity,
  SiAdobe,
  SiDavinciresolve,
  SiCanva,
  SiInstagram,
  SiFacebook,
  SiYoutube,
  SiX,
  SiLinkedin,
  SiPinterest,
} from "react-icons/si";
import { toolkitGroups } from "../data/sakshi";
import "./styles/TechStack.css";

/**
 * Icons are imported by name rather than via `import * as` so the bundler can
 * tree-shake the thousands of unused brand icons out of the build.
 */
const ICONS: Record<string, IconType> = {
  FaWandMagicSparkles,
  FaFilm,
  FaVideo,
  FaArrowDown,
  FaClapperboard,
  FaCloud,
  FaBolt,
  FaPlay,
  FaScissors,
  FaSliders,
  FaFileLines,
  SiHubspot,
  SiSemrush,
  SiGoogleads,
  SiMeta,
  SiMailchimp,
  SiOpenai,
  SiGooglegemini,
  SiAnthropic,
  SiGooglecloud,
  SiPerplexity,
  SiAdobe,
  SiDavinciresolve,
  SiCanva,
  SiInstagram,
  SiFacebook,
  SiYoutube,
  SiX,
  SiLinkedin,
  SiPinterest,
};

const MAX_TILT = 16;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const TechStack = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cubeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const totalBoxes = toolkitGroups.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );

  // ---- Entrance: stagger the cubes up as the section scrolls into view ----
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tool-group",
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
        },
      );

      gsap.fromTo(
        ".tool-cube",
        { autoAlpha: 0, y: 60, scale: 0.6, rotateX: -40 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.7,
          ease: "back.out(1.7)",
          stagger: { each: 0.03, grid: "auto", from: "start" },
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ---- Idle float so the cubes feel alive without a cursor ---------------
  useEffect(() => {
    const ctx = gsap.context(() => {
      cubeRefs.current.forEach((cube, index) => {
        if (!cube) return;
        gsap.to(cube, {
          y: -9,
          duration: 1.6 + (index % 5) * 0.22,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: (index % 7) * 0.16,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ---- Hover tilt, driven from refs so React never re-renders -------------
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const box = event.currentTarget;
    const rect = box.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(box, {
      rotateY: clamp(x * 22, -MAX_TILT, MAX_TILT),
      rotateX: clamp(-y * 22, -MAX_TILT, MAX_TILT),
      z: 34,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    gsap.to(event.currentTarget, {
      rotateY: 0,
      rotateX: 0,
      z: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
      overwrite: "auto",
    });
  };

  let cubeIndex = 0;

  return (
    <div className="techstack" id="toolkit" ref={sectionRef}>
      <h2>My Toolkit</h2>
      <p className="tool-subtitle">
        Everything behind the work — marketing, AI, video, editing and social.
      </p>

      {toolkitGroups.map((group) => (
        <div className="tool-group" key={group.label}>
          <h3 className="tool-group-label">{group.label}</h3>

          <div className="tool-grid">
            {group.items.map((item) => {
              const Icon = ICONS[item.icon];
              const index = cubeIndex++;

              return (
                <div className="tool-cell" key={item.name}>
                  <div
                    className="tool-cube"
                    ref={(node) => {
                      cubeRefs.current[index] = node;
                    }}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={handlePointerLeave}
                    data-cursor="disable"
                    aria-label={item.name}
                    title={item.name}
                    role="img"
                  >
                    {/* Front, top and side faces make a real 3D cube. */}
                    <span className="tool-face tool-face-front">
                      {Icon ? <Icon className="tool-icon" /> : null}
                    </span>
                    <span className="tool-face tool-face-top" aria-hidden="true" />
                    <span
                      className="tool-face tool-face-side"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="tool-name">{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <span className="sr-only">{totalBoxes} tools in the toolkit.</span>
    </div>
  );
};

export default TechStack;