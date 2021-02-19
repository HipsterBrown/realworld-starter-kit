/// <reference types="cypress" />

import {
  checkTestCoverage,
  createTestMachine,
  createTestModel,
  getTestPlans,
  itVisitsAndRunsPathTests,
  printVizHint,
} from "../support/xstateTestUtils";
import testMachine from "../fixtures/RealWorldApp.machine";
import {
  getArticlesInterceptor,
  getTagsInterceptor,
  registerUserInterceptor,
  postUserLoginInterceptor,
} from "../fixtures/RealWorldApp.interceptors";
import testEvents from "../fixtures/RealWorldApp.events";
import testStates from "../fixtures/RealWorldApp.tests";

const TEST_TITLE = "Real World App";

// Toggle this to `false` to expand test paths to all simple paths
const SHORTEST_PATH = true;

const itTests = itVisitsAndRunsPathTests(
  `http://localhost:${process.env.PORT || "1234"}`,
  getArticlesInterceptor,
  getTagsInterceptor,
  postUserLoginInterceptor,
  registerUserInterceptor
);

printVizHint(TEST_TITLE, testMachine);

const testModel = createTestModel(
  createTestMachine(testMachine, testStates),
  testEvents
);

const testPlans = checkTestCoverage(
  testModel,
  getTestPlans(testModel, SHORTEST_PATH)
);

context(TEST_TITLE, () => {
  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach(itTests);
    });
  });
});
