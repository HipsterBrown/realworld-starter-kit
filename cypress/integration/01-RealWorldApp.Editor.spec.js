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
import editorMachine from "../fixtures/RealWorldApp.Editor.machine";
import testEvents from "../fixtures/RealWorldApp.events";
import testStates from "../fixtures/RealWorldApp.Editor.tests";
import {
  registerUserInterceptor,
  postUserLoginInterceptor,
} from "../fixtures/RealWorldApp.interceptors";

const TEST_TITLE = "Real World App: Editor";

// Toggle this to `false` to expand test paths to all simple paths
const SHORTEST_PATH = true;

const itTests = itVisitsAndRunsPathTests(
  `http://localhost:${process.env.PORT || "1234"}`,
  postUserLoginInterceptor,
  registerUserInterceptor
);

const testMachine = applyNestedMachine(appMachine, "Editor", editorMachine);

printVizHint(TEST_TITLE, testMachine);

const testModel = createTestModel(
  createTestMachine(testMachine, testStates),
  testEvents
);

const testPlans = getTestPlansTo(
  { Editor: "published" },
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
