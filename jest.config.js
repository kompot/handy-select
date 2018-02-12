module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
  moduleFileExtensions: ['ts', 'js'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js)$']
};
