import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "html-favicon",
      transformIndexHtml(html) {
        return html.replace(
          /<link rel="icon" href=".*" type="image\/svg\+xml">/,
          `<link rel="icon" href="/DMCLogo.png" type="image/png">`
        );
      },
    },
  ],
});
