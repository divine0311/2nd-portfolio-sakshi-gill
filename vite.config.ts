import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import type { IncomingMessage, ServerResponse } from "http";

// Serves the studio at /admin instead of /admin.html, in both `vite dev` and
// `vite preview`. It is intentionally not linked from the site.
function adminRoute(): Plugin {
  const rewrite = (
    req: IncomingMessage,
    _res: ServerResponse,
    next: () => void,
  ) => {
    const url = req.url ?? "";
    if (url === "/admin" || url === "/admin/" || url.startsWith("/admin/")) {
      req.url = "/admin.html";
    }
    next();
  };
  return {
    name: "studio-admin-route",
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
}

// /blog            -> blog.html       (listing)
// /blog/<slug>     -> blog-post.html  (article)
// The article shell is one build output; the slug is read from the URL at
// runtime and matched against Supabase, so adding a post needs no rebuild.
function blogRoute(): Plugin {
  const rewrite = (
    req: IncomingMessage,
    _res: ServerResponse,
    next: () => void,
  ) => {
    const url = req.url ?? "";
    const clean = url.split("?")[0];
    if (clean === "/blog" || clean === "/blog/") {
      req.url = "/blog.html";
    } else if (/^\/blog\/[^/]+\/?$/.test(clean)) {
      req.url = "/blog-post.html" + url.slice(clean.length);
    }
    next();
  };
  return {
    name: "blog-route",
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
}

export default defineConfig({
  plugins: [react(), adminRoute(), blogRoute()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        admin: path.resolve(__dirname, "admin.html"),
        blog: path.resolve(__dirname, "blog.html"),
        "blog-post": path.resolve(__dirname, "blog-post.html"),
      },
    },
  },
  server: {
    // The admin studio and the blog are plain pages, so no smooth-scroll
    // interception is needed there - only the main site wires GSAP up.
    fs: {
      strict: false,
    },
  },
});