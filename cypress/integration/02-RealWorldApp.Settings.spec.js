/// <reference types="cypress" />

import {
  applyNestedMachine,
  createTestMachine,
  createTestModel,
  getTestPlansTo,
  itVisitsAndRunsPathTests,
  printVizHint,
} from "../support/xstateTestUtils";
import appMachine from "../fixtures/RealWorldApp.machine";
import settingsMachine from "../fixtures/RealWorldApp.Settings.machine";
import {
  getArticlesInterceptor,
  getTagsInterceptor,
  registerUserInterceptor,
  postUserLoginInterceptor,
} from "../fixtures/RealWorldApp.interceptors";
import testEvents from "../fixtures/RealWorldApp.events";
import testStates from "../fixtures/RealWorldApp.Settings.tests";

const TEST_TITLE = "Real World App: Settings";

// Toggle this to `false` to expand test paths to all simple paths
const SHORTEST_PATH = true;

const itTests = itVisitsAndRunsPathTests(
  `http://localhost:${process.env.PORT || "1234"}`,
  getArticlesInterceptor,
  getTagsInterceptor,
  postUserLoginInterceptor,
  registerUserInterceptor
);

const testMachine = applyNestedMachine(appMachine, "Settings", settingsMachine);

printVizHint(TEST_TITLE, testMachine);

const testModel = createTestModel(
  createTestMachine(testMachine, testStates),
  testEvents
);

const testPlans = [
  ...getTestPlansTo({ Settings: "updated" }, testModel, SHORTEST_PATH),
  ...getTestPlansTo({ Settings: "logged-out" }, testModel, SHORTEST_PATH),
];

context(TEST_TITLE, () => {
  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach(itTests);
    });
  });
});
