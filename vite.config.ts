import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Set base to your repo name when deploying to GitHub Pages (e.g., "/Motion/").
export default defineConfig({
  base: "/Motion/",
  plugins: [react()],
});
