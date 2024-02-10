/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["import"],
  extends: [
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: [
      "./tsconfig.json",
      "./apps/*/tsconfig.json",
      "./packages/*/tsconfig.json",
    ],
  },
  rules: {
    // These off/not-configured-the-way-we-want lint rules we like & opt into
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports", fixStyle: "inline-type-imports" },
    ],
    "import/consistent-type-specifier-style": ["error", "prefer-inline"],
    "@typescript-eslint/consistent-type-definitions": "off",

    // These lint rules don't make sense for us but are enabled in the preset configs
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/restrict-template-expressions": "off",

    // This rule doesn't seem to be working properly
    "@typescript-eslint/prefer-nullish-coalescing": "off",

    "@typescript-eslint/no-misused-promises": [
      "error",
      { checksVoidReturn: false },
    ],
  },
};

module.exports = config;
