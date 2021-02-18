/// <reference types="cypress" />

import appMachine from "../fixtures/RealWorldApp.machine";
import testEvents from "../fixtures/RealWorldApp.events";
import {
  getArticlesInterceptor,
  getTagsInterceptor,
  registerUserInterceptor,
  postUserLoginInterceptor,
} from "../fixtures/RealWorldApp.interceptors";
import {
  checkTestCoverage,
  createTestMachine,
  createTestModel,
  getTestPlans,
  itVisitsAndRunsPathTests,
} from "../support/xstateTestUtils";

// Toggle this to `false` to expand test paths to all simple paths
const SHORTEST_PATH = true;

function testHome() {
  cy.get("body").contains("conduit");

  cy.get(".home-page").contains("Global Feed");
  cy.get(".home-page").contains("Loading articles...");
  cy.get(".sidebar").contains("Popular Tags");
  cy.get(".sidebar").contains("Loading tags...");

  cy.wait(["@getArticles", "@getTags"]);

  cy.get(".home-page").contains("Read more...");
  cy.get(".sidebar").contains("dragons");
}

const testStates = {
  Home: testHome,
  SignUp: function () {
    cy.contains("Sign up");
  },
  SignIn: function () {
    cy.contains("Log In");
  },
  HomeAuth: function () {
    cy.get(".navbar").contains("New Post");
    cy.get(".navbar").contains("Settings");
    cy.get(".home-page").contains("Your Feed");

    testHome();
  },
  Article: function () {
    cy.fixture("articles.json").then(function ($json) {
      const a = $json.articles[0];
      cy.get(".article-page").contains(a.body);
    });
  },
  Profile: function () {
    cy.fixture("articles.json").then(function ($json) {
      const a = $json.articles[0];
      cy.get("h4").contains(a.author.username);
    });
  },
  Editor: function () {
    cy.get("#title").should("have.value", "");
    cy.get("#description").should("have.value", "");
    cy.get("#body").should("have.value", "");
    cy.get("#tagList").should("have.value", "");
    cy.get("button.btn").contains("Publish Article");
  },
  Settings: function () {
    cy.get("h1").contains("Your Settings");
  },
  MyProfile: function () {
    cy.get("h4").contains("FirstLast");
  },
};

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

const testModel = createTestModel(
  createTestMachine(appMachine, testStates),
  testEvents
);
const testPlans = checkTestCoverage(
  testModel,
  getTestPlans(testModel, SHORTEST_PATH)
);

context("Real World App", () => {
  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach(itTests);
    });
  });
});
