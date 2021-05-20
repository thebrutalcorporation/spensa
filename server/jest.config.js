module.exports = {
  roots: ["<rootDir>/dist"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: [
    require.resolve("./dist/test-utils/services/dropSchemaAndInitializeDb.js"),
  ],
};
