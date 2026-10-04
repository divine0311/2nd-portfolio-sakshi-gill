/**
 * Mounts the site's own Navbar component inside the plain-HTML blog pages.
 *
 * The blog used to ship a second, hand-written menu. It now renders the exact
 * same header as the home page (logo, Blog, email), so there is one navbar for
 * the whole site and the Blog link lives in it rather than in a separate page
 * chrome.
 */
import { createRoot } from "react-dom/client";
import Navbar from "../components/Navbar";

export function mountSiteNav(): void {
  const host = document.getElementById("site-nav");
  if (!host) return;
  createRoot(host).render(<Navbar active="blog" />);
}