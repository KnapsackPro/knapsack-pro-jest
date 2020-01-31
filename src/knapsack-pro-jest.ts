#!/usr/bin/env node

const { name: clientName, version: clientVersion } = require('../package.json');

const jest = require('jest');
const uuidv1 = require('uuid/v1');

import {
  KnapsackProCore,
  KnapsackProLogger,
  onQueueFailureType,
  onQueueSuccessType,
  TestFile,
} from '@knapsack-pro/core';
import { EnvConfig } from './env-config';
import { TestFilesFinder } from './test-files-finder';
import { JestCLI } from './jest-cli';

const jestCLIOptions = JestCLI.argvToOptions();
const knapsackProLogger = new KnapsackProLogger();
knapsackProLogger.debug(
  `Jest CLI options:\n${KnapsackProLogger.objectInspect(jestCLIOptions)}`,
);

EnvConfig.loadEnvironmentVariables();

const projectPath = process.cwd();
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

  let jestCLICoverage = {};
  if (EnvConfig.coverageDirectory) {
    jestCLICoverage = {
      coverageDirectory: `${EnvConfig.coverageDirectory}/${uuidv1()}`,
    };
  }

  const {
    results: { success: isTestSuiteGreen, testResults },
  } = await jest.runCLI(
    {
      ...jestCLIOptions,
      ...jestCLICoverage,
      runTestsByPath: true,
      _: testFilePaths,
    },
    [projectPath],
  );

  const recordedTestFiles: TestFile[] = testResults.map(
    ({
      testFilePath,
      perfStats: { start, end },
    }: {
      testFilePath: string;
      perfStats: { start: number; end: number };
    }) => {
      const path =
        process.platform === 'win32'
          ? testFilePath.replace(`${projectPath}\\`, '').replace(/\\/g, '/')
          : testFilePath.replace(`${projectPath}/`, '');
      const timeExecutionMiliseconds = end - start;
      // 0.1s default time when not recorded timing
      const timeExecution =
        timeExecutionMiliseconds > 0 ? timeExecutionMiliseconds / 1000 : 0.1;

      return {
        path,
        time_execution: timeExecution,
      };
    },
  );

  return {
    recordedTestFiles,
    isTestSuiteGreen,
  };
};

// we do nothing when error so pass noop
const onError: onQueueFailureType = (error: any) => {};

knapsackPro.runQueueMode(onSuccess, onError);
