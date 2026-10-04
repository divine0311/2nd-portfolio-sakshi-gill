import { useRef, useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { about, profile } from "../data/sakshi";
import "./styles/ConnectBox.css";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { label: "Github", href: profile.github },
  { label: "Linkedin", href: profile.linkedin },
  { label: "Twitter", href: profile.x },
  { label: "Instagram", href: profile.instagram },
].filter((social) => Boolean(social.href));

type FormFields = {
  name: string;
  email: string;
  message: string;
};

const EMPTY: FormFields = { name: "", email: "", message: "" };

const Connect = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [fields, setFields] = useState<FormFields>(EMPTY);
  const [status, setStatus] = useState("");

  /**
   * No backend is wired up, so the form hands the message to the visitor's
   * mail client. This always works and never silently drops a message the way
   * a fake fetch-to-nothing would.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fields.name.trim() || !fields.email.trim() || !fields.message.trim()) {
      setStatus("Please fill in your name, email and a message.");
      return;
    }

    const subject = encodeURIComponent(`Portfolio enquiry from ${fields.name}`);
    const body = encodeURIComponent(
      `${fields.message}\n\n—\n${fields.name}\n${fields.email}`,
    );

    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setStatus("Opening your mail app…");
  };

  /** Tilts the box toward the pointer. Disabled on touch, where it has no meaning. */
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = boxRef.current;
    if (!box || event.pointerType === "touch") return;

    const rect = box.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(box, {
      rotateY: x * 16,
      rotateX: -y * 16,
      duration: 0.6,
      ease: "power3.out",
      overwrite: true,
    });
  };

  const handlePointerLeave = () => {
    const box = boxRef.current;
    if (!box) return;
    gsap.to(box, { rotateX: 0, rotateY: 0, duration: 0.9, ease: "power3.out" });
  };

  return (
    <div className="connect-section section-container" id="connect">
      <h2 className="connect-title">Connect</h2>

      <div className="connect-vision">
        <span className="connect-kicker">{about.vision.subheading}</span>
        <h3 className="connect-headline">{about.vision.headline}</h3>
        <p className="connect-vision-text">{about.vision.paragraph}</p>

        <ul className="connect-quotes">
          {about.quotes.map((quote) => (
            <li key={quote}>{quote}</li>
          ))}
        </ul>
      </div>

      <div className="connect-3d">
        <div
          className="connect-box"
          ref={boxRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div className="connect-box-inner">
            <div className="connect-direct">
              <h4>Direct email</h4>
              <a
                className="connect-direct-email"
                href={`mailto:${profile.email}`}
                data-cursor="disable"
              >
                {profile.email}
              </a>
              <div className="connect-socials">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    className="connect-social"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="disable"
                  >
                    {social.label} <MdArrowOutward />
                  </a>
                ))}
              </div>
            </div>

            <form className="connect-form" onSubmit={handleSubmit}>
              <div className="connect-field">
                <label htmlFor="connect-name">Your name</label>
                <input
                  id="connect-name"
                  type="text"
                  value={fields.name}
                  onChange={(e) => setFields({ ...fields, name: e.target.value })}
                  data-cursor="disable"
                />
              </div>

              <div className="connect-field">
                <label htmlFor="connect-email">Your email</label>
                <input
                  id="connect-email"
                  type="email"
                  value={fields.email}
                  onChange={(e) => setFields({ ...fields, email: e.target.value })}
                  data-cursor="disable"
                />
              </div>

              <div className="connect-field connect-field-full">
                <label htmlFor="connect-message">Message</label>
                <textarea
                  id="connect-message"
                  value={fields.message}
                  onChange={(e) => setFields({ ...fields, message: e.target.value })}
                  data-cursor="disable"
                />
              </div>

              <p className="connect-status" role="status">
                {status}
              </p>

              <button
                type="submit"
                className="connect-submit"
                data-cursor="disable"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;