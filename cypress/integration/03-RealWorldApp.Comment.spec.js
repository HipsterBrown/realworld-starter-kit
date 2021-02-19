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
import commentMachine from "../fixtures/RealWorldApp.Comment.machine";
import testEvents from "../fixtures/RealWorldApp.events";
import testStates from "../fixtures/RealWorldApp.Comment.tests";
import {
  registerUserInterceptor,
  postUserLoginInterceptor,
} from "../fixtures/RealWorldApp.interceptors";

const TEST_TITLE = "Real World App: Comment";

// Toggle this to `false` to expand test paths to all simple paths
const SHORTEST_PATH = true;

const itTests = itVisitsAndRunsPathTests(
  `http://localhost:${process.env.PORT || "1234"}`,
  postUserLoginInterceptor,
  registerUserInterceptor
);

const testMachine = applyNestedMachine(appMachine, "Comment", commentMachine);

printVizHint(TEST_TITLE, testMachine);

const testModel = createTestModel(
  createTestMachine(testMachine, testStates),
  testEvents
);

const testPlans = getTestPlansTo(
  { Comment: "deleted" },
  testModel,
  SHORTEST_PATH
);

context(TEST_TITLE, () => {
  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach(itTests);
    });
  });
});
