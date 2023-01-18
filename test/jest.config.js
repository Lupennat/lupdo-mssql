module.exports = {
    rootDir: '..',
    clearMocks: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
    collectCoverageFrom: ['src/**/*.ts'],
    coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/', 'types\\.ts', 'index\\.ts', '.+\\.d\\.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/fixtures/'],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
    testEnvironment: 'node',
    // testMatch: ['<rootDir>/src/__tests__/data-types/**'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'src/__tests__/tsconfig.json' }]
    }
};
