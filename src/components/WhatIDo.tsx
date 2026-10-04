import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { capabilities } from "../data/sakshi";

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };
  useEffect(() => {
    if (ScrollTrigger.isTouch) {
      containerRef.current.forEach((container) => {
        if (container) {
          container.classList.remove("what-noTouch");
          container.addEventListener("click", () => handleClick(container));
        }
      });
    }
    return () => {
      containerRef.current.forEach((container) => {
        if (container) {
          container.removeEventListener("click", () => handleClick(container));
        }
      });
    };
  }, []);
  return (
    <div className="whatIDO" id="capabilities">
      <div className="what-box">
        <h2 className="title">
          My<span className="hat-h2"> CAPA</span>
          <div>
            BIL<span className="do-h2">ITIES</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>
          {capabilities.map((capability, index) => (
            <div
              className="what-content what-noTouch"
              key={capability.title}
              ref={(el) => setRef(el, index)}
            >
              <div className="what-border1">
                <svg height="100%">
                  <line
                    x1="0"
                    y1={index === 0 ? "0" : "100%"}
                    x2="100%"
                    y2={index === 0 ? "0" : "100%"}
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                  />
                  {index === 0 && (
                    <line
                      x1="0"
                      y1="100%"
                      x2="100%"
                      y2="100%"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="6,6"
                    />
                  )}
                </svg>
              </div>
              <div className="what-corner"></div>

              <div className="what-content-in">
                <h3>{capability.title}</h3>
                <h4>What I do</h4>
                <p>{capability.description}</p>
                <h5>Skillset &amp; tools</h5>
                <div className="what-content-flex">
                  {capability.tools.map((tool) => (
                    <div className="what-tags" key={tool}>
                      {tool}
                    </div>
                  ))}
                </div>
                <div className="what-arrow"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);

    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
