import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { projects } from "../data/sakshi";

gsap.registerPlugin(useGSAP);

const Work = () => {
  useGSAP(() => {
    /**
     * The pinned horizontal scroll is a desktop-only effect. On a phone the
     * section is 100vh tall with a flex row of fixed-width cards, which turned
     * the row into a ~94000px sideways-scrolling strip and cut the cards off.
     * Below 1024px the cards stack (Work.css) and this effect is not built, so
     * gsap.matchMedia also tears it down when the viewport shrinks.
     */
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const boxes = gsap.utils.toArray<HTMLElement>(".work-box");
      const flex = document.querySelector<HTMLElement>(".work-flex");
      const container = document.querySelector<HTMLElement>(".work-container");
      if (boxes.length < 2 || !flex || !container) return;

      /** How far the row has to travel for its last card to reach the edge. */
      const distance = () => {
        const rectLeft = container.getBoundingClientRect().left;
        const rect = boxes[0].getBoundingClientRect();
        const parentWidth = flex.getBoundingClientRect().width;
        const padding =
          parseInt(window.getComputedStyle(boxes[0]).paddingLeft) / 2;
        return rect.width * boxes.length - (rectLeft + parentWidth) + padding;
      };

      // With few cards the row may not overflow the container, which would give
      // a negative travel and make the pin scroll the wrong way. Skip the pinned
      // scroll in that case and let the section flow normally.
      if (distance() <= 0) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".work-section",
          start: "top top",
          // Recomputed on refresh so a resize cannot leave the pin stale.
          end: () => "+=" + Math.max(1, distance()),
          scrub: true,
          pin: true,
          id: "work",
          invalidateOnRefresh: true,
        },
      });

      timeline.to(flex, { x: () => -distance(), ease: "none" });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <a
              className="work-box"
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} - open live site`}
            >
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <p className="work-summary">{project.summary}</p>
                <h4>Tools and features</h4>
                <p>{project.tools.join(", ")}</p>
              </div>
              <WorkImage
                image={project.image}
                alt={`${project.title} live preview`}
                link={project.url}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
