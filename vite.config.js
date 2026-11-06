import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development, serve the /api/hand-* functions straight from this server (Vercel does it in production)
function devApi() {
  return {
    name: "dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, "http://x");
        const route = { "/api/hand-drawings": "hand-drawings", "/api/hand-drawing": "hand-drawing" }[url.pathname];
        if (!route) return next();
        const { default: handler } = await server.ssrLoadModule(`/api/${route}.js`);
        let body = ""; for await (const c of req) body += c;
        req.body = body ? JSON.parse(body) : {}; req.query = Object.fromEntries(url.searchParams);
        res.status = (c) => { res.statusCode = c; return res; };
        res.json = (o) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(o)); };
        res.send = (b) => res.end(b);
        await handler(req, res);
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), devApi()],
    base: "/",
    assetsInclude: ["**/*.JPG", "**/*.jpg", "**/*.jpeg", "**/*.png", "**/*.gif"],
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          // heavy libraries live in their own long-cached files, so a page change never re-downloads them
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            motion: ["gsap", "framer-motion"],
          },
        },
      },
    },
  };
});
