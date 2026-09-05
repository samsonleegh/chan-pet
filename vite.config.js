import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// One HTML file, like the claude.ai export the apps were built from.
// envPrefix keeps the root .env (Stripe etc.) out of the bundle: only PUBLIC_* would be inlined.
export default defineConfig({
  base: "./",
  envPrefix: "PUBLIC_",
  plugins: [react(), viteSingleFile()],
  build: { target: "es2019", cssCodeSplit: false, assetsInlineLimit: 100000000 },
});
