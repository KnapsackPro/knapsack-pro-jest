import glob = require('glob');
import minimatch = require('minimatch');

import { TestFile } from '@knapsack-pro/core';
import { EnvConfig } from './env-config';

export class TestFilesFinder {
  public static allTestFiles(): TestFile[] {
    return glob
      .sync(EnvConfig.testFilePattern)
      .filter((testFilePath: string) => {
        if (EnvConfig.testFileExcludePattern) {
          return !minimatch(testFilePath, EnvConfig.testFileExcludePattern, {
            matchBase: true,
          });
        }
        return true;
      })
      .filter((testFilePath: string) => {
        // ignore test file paths inside node_modules because it's default Jest behavior
        // https://jestjs.io/docs/en/22.2/configuration#testpathignorepatterns-array-string
        return !testFilePath.match(/node_modules/);
      })
      .map((testFilePath: string) => ({ path: testFilePath }));
  }
}
