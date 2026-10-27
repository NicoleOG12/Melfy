import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Cobertura mínima (%) exigida; vem do `env` do ci.yml (padrão 80).
const coverageMin = Number(process.env.COVERAGE_THRESHOLD) || 80;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  build: { sourcemap: true },
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: ["src/services/api.js"],
      // Quality gate: abaixo disso o `npm run test:coverage` falha e o CI para.
      thresholds: {
        lines: coverageMin,
        statements: coverageMin,
        functions: coverageMin,
      },
    },
  },
});
