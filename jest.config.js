// Sync object
const config = {
  // The root of your source code, typically /src
  // `<rootDir>` is a token Jest substitutes
  roots: ['<rootDir>/src'],
  // Runs special logic, such as cleaning up components
  // when using React Testing Library and adds special
  // extended assertions to Jest
  setupFilesAfterEnv: [
    '@testing-library/react/cleanup-after-each',
    '@testing-library/jest-dom/extend-expect',
    '<rootDir>src/__setup__/setupTests.js',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testPathIgnorePatterns: ['/.history/', '/cypress/'],
  transform: {
    '.*': './node_modules/babel-jest',
  },
  // Test spec file resolution pattern
  // Matches parent folder `__tests__` and filename
  // should contain `test` or `spec`.
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.js?$',

  // Module file extensions for importing
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
};
export default config;
