/**
 * Central content source for this portfolio.
 *
 * Every word rendered on the site comes from this file, so the copy can be
 * edited in one place instead of hunting through components. Structure and
 * motion (three.js scene, GSAP timelines, custom cursor) are intentionally
 * untouched - this file only supplies the content.
 *
 * TODO(user): replace the placeholder socials marked `needsInput: true`
 * once the real profile URLs are available.
 */

export type Project = {
  title: string;
  category: string;
  url: string;
  summary: string;
  highlights: string[];
  tools: string[];
  image: string;
};

export type TimelineEntry = {
  role: string;
  org: string;
  period: string;
  description: string;
};

export type Capability = {
  title: string;
  description: string;
  tools: string[];
};

export const profile = {
  firstName: "Sakshi",
  lastName: "Gill",
  fullName: "Sakshi Gill",
  /** Short label used in the navbar where space is tight. */
  logoText: "Sakshi Gill",
  tagline:
    "Digital Marketer, AI Developer, Editor & Creative Strategist",
  intro: "Hello! I'm",
  /**
   * The three rotating slots in the hero. Each is a short role label so the
   * existing CSS line-break animation keeps working.
   */
  rotatingRoles: ["Marketer", "AI Creator", "Storyteller"],
  email: "divinesakshi03@gmail.com",
  /**
   * No phone number was available in the source material, so the phone row is
   * hidden rather than showing a fake number.
   */
  phone: "",
  location: "Kaithal, Haryana, India",
  linkedin: "https://www.linkedin.com/in/sakshigill",
  github: "https://github.com",
  /**
   * These three had no real URL in the source material. They are hidden by the
   * components until real links are supplied.
   */
  needsInput: ["x", "instagram", "resume"] as const,
  x: "",
  instagram: "",
  resumeUrl: "",
};

export const about = {
  heading: "My Journey",
  /** First-person story, taken from the source portfolio. */
  story:
    "I'm Sakshi Gill — someone driven by an honest love for visual storytelling and an endless curiosity about how creative ideas truly connect with people. Growing up through school, scoring a perfect 100% in 10th grade and 91.8% in 12th gave me a foundation of steady discipline, but it was my quiet, instinctive pull toward words, design, and creative expression that hinted at where I was headed. During my graduation, completing my B.A. from Indira Gandhi College, Kurukshetra University with a 9.34 CGPA, I learned to look at human emotions, culture, and narratives with deep analytical clarity. The defining turning point came when I discovered and completed my course in Digital Marketing with AI — suddenly, strategic communication and intelligent generative technology merged, giving my creative drive a clear and powerful purpose. Today, that journey shapes everything I build: turning raw ideas into captivating digital stories that people don't just scroll past, but genuinely remember.",
  vision: {
    subheading: "Looking Forward",
    headline:
      "The Future Belongs to Storytellers Who Master Intelligent Machines.",
    paragraph:
      "My vision is to architect campaigns and digital platforms that don't merely adapt to the AI revolution — they shape its cultural trajectory. By uniting human vulnerability and machine intelligence, we can build brands that inspire enduring loyalty and profound resonance.",
  },
  quotes: [
    '"Creativity is no longer just intuition; it is amplified imagination guided by data."',
    '"The boldest stories are written by those willing to dismantle yesterday’s assumptions."',
  ],
};

/** Academic + training milestones, ordered oldest to newest. */
export const education: TimelineEntry[] = [
  {
    role: "Senior Secondary (Class 12)",
    org: "Academic Foundation",
    period: "2022 - 2023",
    description:
      "Achieved a rare 91.8% in 12th — proving that consistency, curiosity, and steadfast discipline build the strongest launchpad for creative growth.",
  },
  {
    role: "Digital Marketing with AI",
    org: "Professional Certification",
    period: "2026 - Present",
    description:
      "The pivotal breakthrough — fusing strategic brand storytelling with cutting-edge AI tools to design high-impact, forward-looking content.",
  },
  {
    role: "Bachelor of Arts (B.A.)",
    org: "Indira Gandhi College, Kurukshetra University",
    period: "2023 - 2026",
    description:
      "Graduated with an exceptional 9.34 CGPA, honing deep analytical clarity, cultural empathy, and an instinct for what makes human stories truly resonate.",
  },
];

export const projects: Project[] = [
  {
    title: "Typing Rush",
    category: "Live Game",
    url: "https://typing-rush-game.vercel.app",
    summary:
      "A neon sci-fi typing shooter: incoming enemy ships are destroyed by typing the words on them.",
    highlights: [
      "Type to Destroy: every ship dies only when its word is typed correctly, so speed and accuracy decide the round.",
      "Neon Arcade Look: canvas-rendered enemies, particle bursts and a retro-futuristic HUD.",
      "Zero Install: runs entirely in the browser, so it opens straight on desktop and mobile.",
    ],
    tools: ["React", "TypeScript", "Canvas Game Loop", "Typing Engine"],
    image: "/images/work-typing-rush.webp",
  },
  {
    title: "Gyanix Academy",
    category: "Coaching Institute Website",
    url: "https://gyanix-acedemy-gyanix-academy-8bqc.vercel.app",
    summary:
      "Kaithal's 5.0-rated coaching institute for IIT-JEE, NEET, NDA and Defence exams - courses, results, faculty and enquiries in one place.",
    highlights: [
      "Trust Above The Fold: 5.0 Google rating and 84+ Justdial reviews surfaced where enquiry visitors land.",
      "Results That Sell: district and state ranks, prize ceremonies and Amar Ujala press coverage as proof.",
      "Enquiry Built In: WhatsApp and enquiry CTAs alongside courses, G-SET scholarship, hostel and faculty details.",
    ],
    tools: ["Responsive UI", "SEO Basics", "Lead Generation", "Google Reviews"],
    image: "/images/work-gyanix-academy.webp",
  },
];

/** Backs the two panels in the WhatIDo section. */
export const capabilities: Capability[] = [
  {
    title: "MARKET",
    description:
      "I turn raw ideas into campaigns people actually remember — sharp positioning, hook-first writing, and funnels that turn attention into action.",
    tools: [
      "Digital Marketing",
      "SEO Strategy",
      "Google Ads",
      "Meta Ads",
      "Content Strategy",
      "Email Marketing",
    ],
  },
  {
    title: "CREATE",
    description:
      "I build AI-assisted visuals and motion that stay on-brand — generative imagery, short-form video, and editing that keeps a human voice.",
    tools: [
      "ChatGPT",
      "Gemini",
      "Midjourney",
      "Runway Gen-3",
      "CapCut",
      "DaVinci Resolve",
    ],
  },
];

/** Chips shown under the TechStack heading. */
export const toolGroups = [
  {
    label: "AI Tools",
    items: [
      "ChatGPT",
      "Gemini",
      "Claude",
      "Google AI Studio",
      "Midjourney",
      "Perplexity",
    ],
  },
  {
    label: "Video Creating with AI",
    items: [
      "Google Flow AI",
      "Kling AI",
      "Dropshot.ai",
      "Runway Gen-3",
      "Luma Dream",
      "Pika AI",
    ],
  },
  {
    label: "Editing",
    items: ["InShot", "CapCut", "VN", "Premiere Pro", "DaVinci Resolve", "Canva"],
  },
  {
    label: "Social Media",
    items: ["Instagram", "Facebook", "YouTube", "X (Twitter)", "LinkedIn", "Pinterest"],
  },
];

/**
 * Every capability tool plus every toolGroup entry, grouped for the My Toolkit
 * section. This is the single source for that section, so whatever is claimed
 * under Capabilities always shows up here and the two can never drift apart.
 * `icon` is the name of a react-icons export resolved in TechStack.tsx.
 */
export const toolkitGroups: {
  label: string;
  items: { name: string; icon: string }[];
}[] = [
  {
    label: "Market",
    items: [
      { name: "Digital Marketing", icon: "SiHubspot" },
      { name: "SEO Strategy", icon: "SiSemrush" },
      { name: "Google Ads", icon: "SiGoogleads" },
      { name: "Meta Ads", icon: "SiMeta" },
      { name: "Content Strategy", icon: "FaFileLines" },
      { name: "Email Marketing", icon: "SiMailchimp" },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { name: "ChatGPT", icon: "SiOpenai" },
      { name: "Gemini", icon: "SiGooglegemini" },
      { name: "Claude", icon: "SiAnthropic" },
      { name: "Google AI Studio", icon: "SiGooglecloud" },
      { name: "Midjourney", icon: "FaWandMagicSparkles" },
      { name: "Perplexity", icon: "SiPerplexity" },
    ],
  },
  {
    label: "Video Creating with AI",
    items: [
      { name: "Google Flow AI", icon: "FaFilm" },
      { name: "Kling AI", icon: "FaVideo" },
      { name: "Dropshot.ai", icon: "FaArrowDown" },
      { name: "Runway Gen-3", icon: "FaClapperboard" },
      { name: "Luma Dream", icon: "FaCloud" },
      { name: "Pika AI", icon: "FaBolt" },
    ],
  },
  {
    label: "Editing",
    items: [
      { name: "InShot", icon: "FaPlay" },
      { name: "CapCut", icon: "FaScissors" },
      { name: "VN", icon: "FaSliders" },
      { name: "Premiere Pro", icon: "SiAdobe" },
      { name: "DaVinci Resolve", icon: "SiDavinciresolve" },
      { name: "Canva", icon: "SiCanva" },
    ],
  },
  {
    label: "Social Media",
    items: [
      { name: "Instagram", icon: "SiInstagram" },
      { name: "Facebook", icon: "SiFacebook" },
      { name: "YouTube", icon: "SiYoutube" },
      { name: "X (Twitter)", icon: "SiX" },
      { name: "LinkedIn", icon: "SiLinkedin" },
      { name: "Pinterest", icon: "SiPinterest" },
    ],
  },
];

export const navLinks = [
  { label: "HOME", href: "#landingDiv" },
  { label: "JOURNEY", href: "#journey" },
  { label: "QUALIFICATIONS", href: "#qualifications" },
  { label: "WORK", href: "#work" },
  { label: "CAPABILITIES", href: "#capabilities" },
  { label: "CONNECT", href: "#connect" },
];