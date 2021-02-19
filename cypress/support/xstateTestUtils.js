import { Machine } from "xstate";
import { createModel } from "@xstate/test";

export const testNoOp = () => {};

export const applyTest = (state, testFn) => {
  state.meta = { ...state.meta, test: testFn };
};

const applyTests = (machine, tests) => {
  Object.keys(tests).forEach((key) => {
    const [head, ...rest] = key.split(".");
    // console.log("head:", head, " -> rest:", rest);
    if (rest.length) {
      applyTests(machine.states[head], {
        [rest]: tests[key],
      });
    } else if (head) {
      applyTest(machine.states[head], tests[key]);
    } else {
      throw new Error(`applyTests called with invalid key: ${key}`);
    }
  });
  return machine;
};

export const applyNestedMachine = (machine, parentState, nestedMachine) => {
  // clear parentState tests to avoid confusion later
  const state = machine.states[parentState];
  machine.states[parentState] = {
    ...state,
    ...nestedMachine,
  };
  return machine;
};

export const createTestMachine = (machine, tests) =>
  Machine(applyTests(machine, tests));

export const createTestModel = (machine, events) =>
  createModel(machine, { events });

export const checkTestCoverage = (testModel, testPlans) => {
  const testCoveragePlan = {
    description: "test coverage",
    paths: [
      {
        description: "is complete",
        test: () => testModel.testCoverage(),
      },
    ],
  };
  return [...testPlans, testCoveragePlan];
};

export const getTestPlans = (testModel, shortest = true) =>
  shortest ? testModel.getShortestPathPlans() : testModel.getSimplePathPlans();

export const getTestPlansTo = (to, testModel, shortest = true) =>
  shortest
    ? testModel.getShortestPathPlansTo(to)
    : testModel.getSimplePathPlansTo(to);

export const itVisitsAndRunsPathTests = (url, ...setupFn) => (path) =>
  it(path.description, function () {
    if (setupFn.length) setupFn.forEach((fn) => fn());
    cy.visit(url).then(path.test);
  });

export const printVizHint = (testTitle, testMachine) => {
  console.info(
    testTitle,
    "- Copy and paste the following JSON into the XState Visualizer:"
  );
  console.info("https://xstate.js.org/viz/");
  console.info(
    `Machine(${JSON.stringify({
      ...testMachine,
      id: testTitle,
    })});`
  );
};
