export const applyTest = (state, testFn) => {
  state.meta = { ...state.meta, test: testFn };
};

export const applyTests = (stateTestFnTuples) => {
  stateTestFnTuples.forEach((st) => applyTest(st[0], st[1]));
};

export const itVisitsAndRunsPathTests = (url, setupFn) => (path) =>
  it(path.description, function () {
    setupFn && setupFn();
    cy.visit(url).then(path.test);
  });
