module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:promise/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json", "./tsconfig.node.json"],
  },
  plugins: ["simple-import-sort", "react-refresh"],
  rules: {
    curly: "error",
    eqeqeq: "error",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",

    "react/prop-types": "off",
  },
  settings: {
    react: { version: "detect" },
    "import/resolver": { typescript: { project: "./tsconfig.json" } },
  },
};
