import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig(({ mode }) => {
  if (mode === "production") {
    return {
      base: "/babylon-webxr-raw-camera-access-sandbox/",
    };
  }

  return {
    plugins: [basicSsl()],
  };
});
