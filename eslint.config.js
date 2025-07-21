import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: [
      "**/node_modules/",
      "**/.next/",
      "**/out/",
      "**/build/",
      "**/dist/"
    ]
  },
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript"
  ),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
      },
    },

    rules: {
      // TypeScript 규칙
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-floating-promises": "error",
      
      // 일반적인 규칙
      "prefer-const": "error",
      "no-var": "error",
      "no-console": "warn",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      
      // React 규칙
      "react/jsx-no-leaked-render": "error",
      "react/jsx-key": "error",
      "react/no-array-index-key": "warn",
      
      // Next.js 규칙
      "@next/next/no-img-element": "error",
    },
  },
];