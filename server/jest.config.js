/** @type {import('jest').Config} */
export default {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": ["@swc/jest", {
      jsc: {
        parser: { syntax: "typescript" },
        target: "es2022",
      },
      module: { type: "es6" },
    }],
  },
  setupFiles: ["./src/__tests__/setup.ts"],
  testMatch: ["**/__tests__/**/*.test.ts"],
};
