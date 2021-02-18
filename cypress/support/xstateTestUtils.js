import { Machine } from "xstate";
import { createModel } from "@xstate/test";

export const applyTest = (state, testFn) => {
  state.meta = { ...state.meta, test: testFn };
};

export const createTestMachine = (machine, tests) => {
  Object.keys(tests).forEach((key) =>
    applyTest(machine.states[key], tests[key])
  );
  return Machine(machine);
};

export const createTestModel = (machine, events) =>
  createModel(machine, { events });

export const checkTestCoverage = (testModel, testPlans) => {
  const testCoveragePlan = {
    description: "Test Coverage",
    paths: [
      {
        description: "is complete?",
        test: () => testModel.testCoverage(),
      },
    ],
  };
  return [...testPlans, testCoveragePlan];
};

export const getTestPlans = (testModel, shortest = true) =>
  checkTestCoverage(
    testModel,
    shortest ? testModel.getShortestPathPlans() : testModel.getSimplePathPlans()
  );

export const itVisitsAndRunsPathTests = (url, setupFn) => (path) =>
  it(path.description, function () {
    setupFn && setupFn();
    cy.visit(url).then(path.test);
  });
