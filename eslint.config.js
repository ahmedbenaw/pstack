// ESLint flat config. Upstream-ported content (skills/, agents/, docs/,
// automations/, assets/) is intentionally excluded - see CONTRIBUTING.md.
import globals from "globals";
import tseslint from "typescript-eslint";

// `catch (_) {}` to deliberately swallow one specific failure mode, and
// `({ omit, ...rest }) => rest` to drop a key via rest-destructuring are both
// legitimate, intentional idioms - permit them rather than warn on every use.
const noUnusedVars = ["warn", { caughtErrorsIgnorePattern: "^_", ignoreRestSiblings: true }];

export default [
  {
    ignores: [
      "skills/**",
      "agents/**",
      "docs/**",
      "automations/**",
      "assets/**",
      "mcp-server/src/content.generated.ts",
      "mcp-server/worker-configuration.d.ts",
      "node_modules/**",
      "**/node_modules/**",
      "**/.wrangler/**",
    ],
  },
  {
    files: ["mcp-server/scripts/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: {
      "no-unused-vars": noUnusedVars,
      "no-undef": "error",
      eqeqeq: "warn",
    },
  },
  ...tseslint.config({
    files: ["mcp-server/src/**/*.ts"],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      globals: { ...globals.worker },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { caughtErrorsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
    },
  }),
];
