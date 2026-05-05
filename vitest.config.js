import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["js/**/*.spec.js", "server/**/*.spec.js"],
  },
});
