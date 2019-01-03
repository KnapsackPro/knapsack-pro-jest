export class EnvConfig {
  public static loadEnvironmentVariables(): void {
    if (process.env.KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST) {
      process.env.KNAPSACK_PRO_TEST_SUITE_TOKEN =
        process.env.KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST;
    }
  }

  public static get testFilePattern(): string {
    if (process.env.KNAPSACK_PRO_TEST_FILE_PATTERN) {
      return process.env.KNAPSACK_PRO_TEST_FILE_PATTERN;
    }

    return 'cypress/integration/**/*.{js,jsx,coffee,cjsx}';
  }
}
