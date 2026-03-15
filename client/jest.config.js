/** @type {import('jest').Config} */
export default {
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "\\.(css|less|svg|png|jpg)$": "<rootDir>/src/__tests__/__mocks__/fileMock.js",
    "^../api/client$": "<rootDir>/src/__tests__/__mocks__/api.ts",
    "^../../api/client$": "<rootDir>/src/__tests__/__mocks__/api.ts",
  },
  transform: {
    "^.+\\.[jt]sx?$": ["@swc/jest", {
      jsc: {
        parser: { syntax: "typescript", tsx: true },
        transform: { react: { runtime: "automatic" } },
        target: "es2020",
      },
    }],
  },
  setupFiles: ["./src/__tests__/setup.ts"],
  setupFilesAfterEnv: ["./src/__tests__/setupAfterEnv.ts"],
  testMatch: ["**/__tests__/**/*.test.tsx", "**/__tests__/**/*.test.ts"],
};
