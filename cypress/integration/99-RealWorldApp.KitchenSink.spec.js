/// <reference types="cypress" />

import {
  applyNestedMachine,
  checkTestCoverage,
  createTestMachine,
  createTestModel,
  getTestPlans,
  itVisitsAndRunsPathTests,
  testNoOp,
  printVizHint,
} from "../support/xstateTestUtils";
import appMachine from "../fixtures/RealWorldApp.machine";
import commentMachine from "../fixtures/RealWorldApp.Comment.machine";
import editorMachine from "../fixtures/RealWorldApp.Editor.machine";
import settingsMachine from "../fixtures/RealWorldApp.Settings.machine";
import {
  getArticlesInterceptor,
  getTagsInterceptor,
  registerUserInterceptor,
  postUserLoginInterceptor,
} from "../fixtures/RealWorldApp.interceptors";
import testEvents from "../fixtures/RealWorldApp.events";
import appTestStates from "../fixtures/RealWorldApp.tests";
import commentTestStates from "../fixtures/RealWorldApp.Comment.tests";
import editorTestStates from "../fixtures/RealWorldApp.Editor.tests";
import settingsTestStates from "../fixtures/RealWorldApp.Settings.tests";

const TEST_TITLE = "Real World App: Kitchen Sink";

// Toggle this to `false` to expand test paths to all simple paths
const SHORTEST_PATH = true;

function setupInterceptors() {
  getArticlesInterceptor();
  getTagsInterceptor();
  postUserLoginInterceptor();
  registerUserInterceptor();
}

const itTests = itVisitsAndRunsPathTests(
  `http://localhost:${process.env.PORT || "1234"}`,
  setupInterceptors
);

let testMachine = appMachine;
testMachine = applyNestedMachine(testMachine, "Comment", commentMachine);
testMachine = applyNestedMachine(testMachine, "Editor", editorMachine);
testMachine = applyNestedMachine(testMachine, "Settings", settingsMachine);

printVizHint(TEST_TITLE, testMachine);

const testStates = {
  ...appTestStates,
  Comment: testNoOp,
  ...commentTestStates,
  Editor: testNoOp,
  ...editorTestStates,
  Settings: testNoOp,
  ...settingsTestStates,
};

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
