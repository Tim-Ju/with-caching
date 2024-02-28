module.exports = {
  testEnvironment: "jsdom",
  preset: "ts-jest",
  testPathIgnorePatterns: ["/node_modules/", "./dist/"],
  watchPathIgnorePatterns: ["/node_modules/", "./dist/"],
};
