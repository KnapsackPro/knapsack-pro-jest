#!/usr/bin/env node

const { name: clientName, version: clientVersion } = require('../package.json');

const jest = require('jest');

import {
  KnapsackProCore,
  onQueueFailureType,
  onQueueSuccessType,
  TestFile,
} from '@knapsack-pro/core';
import { EnvConfig } from './env-config';
import { TestFilesFinder } from './test-files-finder';

EnvConfig.loadEnvironmentVariables();

const allTestFiles: TestFile[] = TestFilesFinder.allTestFiles();
const knapsackPro = new KnapsackProCore(
  clientName,
  clientVersion,
  allTestFiles,
);

const onSuccess: onQueueSuccessType = async (queueTestFiles: TestFile[]) => {
  const testFilePaths: string[] = queueTestFiles.map(
    (testFile: TestFile) => testFile.path,
  );
  const {
    results: { success: isTestSuiteGreen, testResults },
  } = await jest.runCLI({ runTestsByPath: true, _: testFilePaths }, ['.']);

  const recordedTestFiles: TestFile[] = testResults.map(
    ({
      testFilePath,
      perfStats: { start, end },
    }: {
      testFilePath: string;
      perfStats: { start: number; end: number };
    }) => ({
      path:
        process.platform === 'win32'
          ? testFilePath.replace(/\\/g, '/')
          : testFilePath,
      time_execution: (end - start) / 1000,
    }),
  );

  return {
    recordedTestFiles,
    isTestSuiteGreen,
  };
};

// we do nothing when error so pass noop
const onError: onQueueFailureType = (error: any) => {};

knapsackPro.runQueueMode(onSuccess, onError);
