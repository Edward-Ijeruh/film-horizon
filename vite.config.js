import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "08c9c9aa-82d8-4bc9-ab39-80bb341dda55-00-1lnpmsgvsvwzy.kirk.replit.dev",
    ],
  },
});
