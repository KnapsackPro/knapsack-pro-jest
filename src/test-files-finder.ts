import glob = require('glob');
import minimatch = require('minimatch');

import { KnapsackProLogger, TestFile } from '@knapsack-pro/core';
import { EnvConfig } from './env-config';
import * as Urls from './urls';

export class TestFilesFinder {
  public static allTestFiles(): TestFile[] {
    const testFiles = glob
      .sync(EnvConfig.testFilePattern)
      .filter((testFilePath: string) => {
        if (EnvConfig.testFileExcludePattern) {
          return !minimatch(testFilePath, EnvConfig.testFileExcludePattern, {
            matchBase: true,
          });
        }
        return true;
      })
      .filter(
        (testFilePath: string) =>
          // ignore test file paths inside node_modules because it's default Jest behavior
          // https://jestjs.io/docs/en/22.2/configuration#testpathignorepatterns-array-string
          !testFilePath.match(/node_modules/),
      )
      .map((testFilePath: string) => ({ path: testFilePath }));

    if (testFiles.length === 0) {
      const knapsackProLogger = new KnapsackProLogger();

      const errorMessage = `Test files cannot be found.\nPlease set KNAPSACK_PRO_TEST_FILE_PATTERN matching your test directory structure.\nLearn more: ${Urls.NO_TESTS_FOUND}`;

      knapsackProLogger.error(errorMessage);
      throw errorMessage;
    }

    return testFiles;
  }
}
