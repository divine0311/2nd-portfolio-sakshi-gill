import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import { profile } from "../data/sakshi";
import HoverLinks from "./HoverLinks";

/** Rows are filtered by URL, so icons without a real link never render. */
const socials = [
  { label: "Github", href: profile.github, icon: <FaGithub /> },
  { label: "Linkedin", href: profile.linkedin, icon: <FaLinkedinIn /> },
  { label: "Twitter", href: profile.x, icon: <FaXTwitter /> },
  { label: "Instagram", href: profile.instagram, icon: <FaInstagram /> },
].filter((social) => Boolean(social.href));

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      updatePosition();

      return () => {
        elem.removeEventListener("mousemove", onMouseMove);
      };
    });
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        {socials.map((social) => (
          <span key={social.label}>
            <a href={social.href} target="_blank" rel="noopener noreferrer">
              {social.icon}
            </a>
          </span>
        ))}
      </div>
      {profile.resumeUrl && (
        <a className="resume-button" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
          <HoverLinks text="RESUME" />
          <span>
            <TbNotes />
          </span>
        </a>
      )}
    </div>
  );
};

export default SocialIcons;
