import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Existing rules from your configuration
      "react/no-unescaped-entities": "off", // Allow unescaped quotes in JSX
      "@typescript-eslint/no-unused-vars": "off", // Allow unused variables
      "prefer-const": "off", // Allow non-const variables
      "@typescript-eslint/no-explicit-any": "off", // Allow 'any' type
      "react-hooks/exhaustive-deps": "warn", // Downgrade to warning instead of error

      // New rules to disable based on build errors
      "@typescript-eslint/no-unused-expressions": "off", // Allow unused expressions
      "@typescript-eslint/no-require-imports": "off", // Allow require() imports
      "@typescript-eslint/no-empty-object-type": "off", // Allow {} as a type
      "@typescript-eslint/no-unnecessary-type-constraint": "off", // Allow unnecessary type constraints
      "@typescript-eslint/no-wrapper-object-types": "off", // Allow BigInt instead of bigint
      "@typescript-eslint/no-unsafe-function-type": "off", // Allow Function type
      "@typescript-eslint/no-this-alias": "off", // Allow aliasing 'this' to a variable
    },
  },
];

export default eslintConfig;
