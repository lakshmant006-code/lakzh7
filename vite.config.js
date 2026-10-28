import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    plugins: [react()],
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
