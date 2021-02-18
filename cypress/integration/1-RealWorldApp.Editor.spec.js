/// <reference types="cypress" />

import appMachine from "../fixtures/RealWorldApp.machine";
import editorMachine from "../fixtures/RealWorldApp.Editor.machine";
import testEvents from "../fixtures/RealWorldApp.events";
import {
  registerUserInterceptor,
  postUserLoginInterceptor,
} from "../fixtures/RealWorldApp.interceptors";
import {
  applyNestedMachine,
  createTestMachine,
  createTestModel,
  getTestPlansTo,
  itVisitsAndRunsPathTests,
} from "../support/xstateTestUtils";

// Toggle this to `false` to expand test paths to all simple paths
const SHORTEST_PATH = false;

const testStates = {
  "Editor.clean": function () {
    cy.get("#title").should("have.value", "");
    cy.get("#description").should("have.value", "");
    cy.get("#body").should("have.value", "");
    cy.get("#tagList").should("have.value", "");
  },
  "Editor.editing": function () {
    cy.get("#title").should("have.value", "This is a test...");
    cy.get("#description").should("have.value", "");
    cy.get("#body").should("have.value", "");
    cy.get("#tagList").should("have.value", "");
  },
  "Editor.errored": function () {
    cy.get(".error-messages").contains("description is a required field");
    cy.get(".error-messages").contains("body is a required field");
  },
  "Editor.publishing": function () {
    cy.get("button.btn").contains("Publishing...");
  },
  "Editor.published": function () {
    cy.url().should("contain", "/article/this-is-a-test");
  },
};

const itTests = itVisitsAndRunsPathTests(
  `http://localhost:${process.env.PORT || "1234"}`,
  postUserLoginInterceptor,
  registerUserInterceptor
);

const testMachine = applyNestedMachine(appMachine, "Editor", editorMachine);

const testModel = createTestModel(
  createTestMachine(testMachine, testStates),
  testEvents
);

const testPlans = getTestPlansTo(
  { Editor: "published" },
  testModel,
  SHORTEST_PATH
);

context("Real World App: Editor", () => {
  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach(itTests);
    });
  });
});
