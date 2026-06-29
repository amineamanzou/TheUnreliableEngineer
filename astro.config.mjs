import { defineConfig } from "astro/config";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const site = process.env.SITE_URL ?? (isGitHubPages ? "https://amineamanzou.github.io" : undefined);
const base = process.env.BASE_PATH ?? (isGitHubPages ? "/TheUnreliableEngineer" : undefined);

export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  output: "static",
  trailingSlash: "always",
  ...(site ? { site } : {}),
  ...(base ? { base } : {}),
});
