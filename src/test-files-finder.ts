import glob = require('glob');

import { TestFile } from '@knapsack-pro/core';
import { EnvConfig } from './env-config';

export class TestFilesFinder {
  public static allTestFiles(): TestFile[] {
    return glob
      .sync(EnvConfig.testFilePattern)
      .filter((testFilePath: string) => {
        // ignore test file paths inside node_modules because it's default Jest behaviour
        // https://jestjs.io/docs/en/22.2/configuration#testpathignorepatterns-array-string
        return !testFilePath.match(/node_modules/);
      })
      .map((testFilePath: string) => ({ path: testFilePath }));
  }
}
