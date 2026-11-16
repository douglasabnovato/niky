/* Teste de ponta a ponta no navegador: sobe a API (SQLite em memória) e o front do Vite, em portas próprias */
import { defineConfig, devices } from "@playwright/test";

const API_PORT = process.env.E2E_API_PORT || "4317";
const WEB_PORT = process.env.E2E_WEB_PORT || "4318";

export default defineConfig({
  testDir: "e2e",
  testMatch: /.*\.e2e\.js$/,
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${WEB_PORT}`, trace: "retain-on-failure", reducedMotion: "reduce" },
  /* Um projeto só: o app não tem tema escuro próprio (sem prefers-color-scheme no CSS nem data-bs-theme) */
  projects: [{ name: "desktop-chrome", use: { ...devices["Desktop Chrome"], colorScheme: "light" } }],
  webServer: [
    {
      command: "node src/server.js",
      cwd: "api",
      url: `http://localhost:${API_PORT}/health`,
      env: { PORT: API_PORT, DATABASE_FILE: ":memory:", CORS_ORIGIN: `http://localhost:${WEB_PORT}` },
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: `npx vite --port ${WEB_PORT} --strictPort`,
      url: `http://localhost:${WEB_PORT}`,
      env: { VITE_API_URL: `http://localhost:${API_PORT}` },
      reuseExistingServer: false,
      timeout: 60_000,
    },
  ],
});
/* fim de playwright.config.js */
