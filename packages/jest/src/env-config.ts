export class EnvConfig {
  public static loadEnvironmentVariables(): void {
    if (process.env.KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST) {
      process.env.KNAPSACK_PRO_TEST_SUITE_TOKEN =
        process.env.KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST;
    }

    // Jest defaults NODE_ENV to test,
    // and they suggest that you can rely on this to set up Jest-specific Babel config.
    // We should do the same for Knapsack Pro.
    // https://github.com/KnapsackPro/knapsack-pro-jest/pull/23
    if (process.env.NODE_ENV == null) {
      process.env.NODE_ENV = 'test';
    }
  }

  public static get testFilePattern(): string {
    if (process.env.KNAPSACK_PRO_TEST_FILE_PATTERN) {
      return process.env.KNAPSACK_PRO_TEST_FILE_PATTERN;
    }

    // The glob patterns Jest uses to detect test files.
    // By default it looks for .js and .jsx files inside of __tests__ folders,
    // as well as any files with a suffix of .test or .spec
    // (e.g. Component.test.js or Component.spec.js).
    // It will also find files called test.js or spec.js.
    // https://jestjs.io/docs/en/22.2/configuration#testmatch-array-string
    return '{**/__tests__/**/*.js?(x),**/?(*.)(spec|test).js?(x)}';
  }

  public static get testFileExcludePattern(): void | string {
    return process.env.KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN;
  }

  public static get coverageDirectory(): void | string {
    return process.env.KNAPSACK_PRO_COVERAGE_DIRECTORY;
  }
}
