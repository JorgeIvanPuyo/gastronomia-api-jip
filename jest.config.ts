export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.service.ts',
    'src/**/*.entity.ts',
    '!src/**/*.module.ts',
    '!src/**/*.dto.ts',
    '!src/main.ts',
    '!src/app.module.ts',
  ],
};
