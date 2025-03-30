/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  moduleNameMapper: {
    '^ue$': '<rootDir>/Typing/ue/ue.d.ts',  // Adjust path if 'ue' is a local module
  },
};