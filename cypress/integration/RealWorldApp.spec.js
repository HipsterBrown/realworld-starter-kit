/// <reference types="cypress" />

import appMachine from "../fixtures/appMachine";
import {
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
    cy.wait("@postUserLogin");

    cy.get(".nav-link").contains("New Post");
    cy.get(".nav-link").contains("Settings");

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
    cy.get("#title");
    cy.get("button").contains("Publish Article");
  },
  Settings: function () {
    cy.get("h1").contains("Your Settings");
  },
  MyProfile: function () {
    cy.get("h4").contains("FirstLast");
  },
};

const testEvents = {
  CLICK_HOME: function () {
    cy.get(".nav-link").contains("Home").click();
  },
  CLICK_SIGN_IN: function () {
    cy.get(".nav-link").contains("Sign in").click();
  },
  CLICK_SIGN_UP: function () {
    cy.get(".nav-link").contains("Sign up").click();
  },
  CLICK_NEED_ACCOUNT: function () {
    cy.contains("Need an account?").click();
  },
  CLICK_HAVE_ACCOUNT: function () {
    cy.contains("Have an account?").click();
  },
  CLICK_ARTICLE: function () {
    cy.get(".preview-link > h1").first().click();
  },
  CLICK_AUTHOR: function () {
    cy.get("a.author").first().click();
  },
  SUBMIT_SIGN_UP: function () {
    cy.get("#name").type("FirstLast");
    cy.get("#email").type("first@last.co");
    cy.get("#password").type("password");
    cy.get("button").contains("Sign up").click();
  },
  SUBMIT_SIGN_IN: function () {
    cy.get("#email").type("first@last.co");
    cy.get("#password").type("password");
    cy.get("button").contains("Log In").click();
  },
  CLICK_NEW_POST: function () {
    cy.get(".nav-link").contains("New Post").click();
  },
  CLICK_SETTINGS: function () {
    cy.get(".nav-link").contains("Settings").click();
  },
  CLICK_MY_PROFILE: function () {
    cy.get(".nav-link").contains("FirstLast").click();
  },
};

function setupInterceptors() {
  cy.intercept(
    "https://conduit.productionready.io/api/articles?limit=20&offset=0",
    {
      fixture: "articles.json",
      delay: 200,
    }
  ).as("getArticles");

  cy.intercept("https://conduit.productionready.io/api/tags", {
    fixture: "tags.json",
    delay: 200,
  }).as("getTags");

  cy.intercept(
    {
      method: "POST",
      url: "https://conduit.productionready.io/api/users/login",
    },
    {
      fixture: "signInSuccess_200.json",
      delay: 500,
    }
  ).as("postUserLogin");
}

const itTests = itVisitsAndRunsPathTests(
  `http://localhost:${process.env.PORT || "1234"}`,
  setupInterceptors
);

// prettier-ignore
const testPlans = 
  getTestPlans(
    createTestModel(
      createTestMachine(appMachine, testStates), 
      testEvents),
    SHORTEST_PATH
  );

context("Feedback App", () => {
  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach(itTests);
    });
  });
});
