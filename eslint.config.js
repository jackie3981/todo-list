import js from "@eslint/js";
import globals from "globals";
import react from 'eslint-plugin-react'
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // Ignore these folders globally
  globalIgnores(["dist", "build", "node_modules", "coverage"]),

  {
    // Files to lint
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"], // Include JS and TS files

    // extend configurations
    extends: [
      js.configs.recommended, // Standard JS rules
      reactHooks.configs["recommended-latest"], // Best practices for hooks
      reactRefresh.configs.vite, // React Refresh for Vite development
      prettier, // Disable rules that conflict with Prettier
    ],

    // Additional settings
    settings: {
      react: {
        version: "detect", // Automatically detect the react version
      },
    },

    // Additional plugins
    plugins: {
      prettier: pluginPrettier,
      react: react, // React specific linting rules
      reactHooks: reactHooks,
      reactRefresh: reactRefresh,
    },

    // environment and parser options
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021, // add ES2021 globals
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },

    // 
    rules: {
      // code quality
      "no-unused-vars": [
        "error",
        { varsIgnorePattern: "^[A-Z_]", argsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }], // Allow console.warn and console.error

      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,

      // code style
      semi: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
      "comma-dangle": ["error", "always-multiline"],

      // --- React hooks ---
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // --- Prettier ---
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          printWidth: 100,
          singleQuote: false,
          trailingComma: "all",
        },
      ],
    },
  },
]);
