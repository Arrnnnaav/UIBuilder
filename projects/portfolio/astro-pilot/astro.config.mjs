import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

export default defineConfig({
  site: "https://arnav-khandelwal.vercel.app",
  output: "static",
  publicDir: fileURLToPath(new URL("../public", import.meta.url)),
  build: { assets: "portfolio-static-assets" },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [
        { find: "@/", replacement: `${projectRoot}/` },
        { find: "next/link", replacement: fileURLToPath(new URL("./src/compat/Link.tsx", import.meta.url)) },
      ],
    },
  },
});
