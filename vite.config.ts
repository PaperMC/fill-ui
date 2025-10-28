import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { execSync } from "child_process";
import { defineConfig } from "vite";

function getCommitHash() {
  try {
    const status = execSync("git status --porcelain").toString().trim();
    if (status) {
      return "local";
    }
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "unknown";
  }
}

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  define: {
    __COMMIT_HASH__: JSON.stringify(getCommitHash()),
  },
  server: {
    proxy: {},
  },
  optimizeDeps: {
    exclude: ["@urql/svelte"],
  },
});
