import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Set base to your repo name when deploying to GitHub Pages (e.g., "/Motion/").
export default defineConfig({
  // For Netlify/standard hosting, use root.
  // If you deploy to GitHub Pages under a subpath, change to "/Motion/".
  base: "/",
  plugins: [react()],
});
