/// <reference types="cypress" />

import { Machine } from "xstate";
import { createModel } from "@xstate/test";
import { applyTests, itVisitsAndRunsPathTests } from "./testUtils";

const appMachine = {
  id: "app",
  initial: "Home",
  states: {
    Home: {
      on: {
        CLICK_SIGN_IN: "SignIn",
        CLICK_SIGN_UP: "SignUp",
        CLICK_ARTICLE: "Article",
        CLICK_AUTHOR: "Profile",
      },
    },
    HomeAuth: {
      on: {
        CLICK_NEW_POST: "Editor",
        CLICK_SETTINGS: "Settings",
        CLICK_MY_PROFILE: "MyProfile",
      },
    },
    SignIn: {
      on: {
        CLICK_HOME: "Home",
        CLICK_NEED_ACCOUNT: "SignUp",
        SUBMIT_SIGN_IN: "HomeAuth",
      },
    },
    SignUp: {
      on: {
        CLICK_HOME: "Home",
        CLICK_HAVE_ACCOUNT: "SignIn",
        SUBMIT_SIGN_UP: "HomeAuth",
      },
    },
    Article: {
      on: {
        CLICK_AUTHOR: "Profile",
      },
    },
    Editor: {
      on: {},
    },
    Profile: {
      on: {},
    },
    MyProfile: {
      on: {},
    },
    Settings: {
      on: {},
    },
  },
};

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

function testSignUp() {
  cy.contains("Sign up");
}

function testSignIn() {
  cy.contains("Log In");
}

function testHomeAuth() {
  cy.wait("@postUserLogin");
  cy.get(".nav-link").contains("New Post");
  cy.get(".nav-link").contains("Settings");

  cy.get(".home-page").contains("Your Feed");

  testHome();
}

function testArticle() {
  cy.fixture("articles.json").then(function ($json) {
    const a = $json.articles[0];
    cy.get(".article-page").contains(a.body);
  });
}

function testProfile() {
  cy.fixture("articles.json").then(function ($json) {
    const a = $json.articles[0];
    cy.get("h4").contains(a.author.username);
  });
}

function testEditor() {
  cy.get("#title");
  cy.get("button").contains("Publish Article");
}

function testSettings() {
  cy.get("h1").contains("Your Settings");
}

function testMyProfile() {
  cy.get("h4").contains("FirstLast");
}

applyTests([
  [appMachine.states.Home, testHome],
  [appMachine.states.SignUp, testSignUp],
  [appMachine.states.SignIn, testSignIn],
  [appMachine.states.HomeAuth, testHomeAuth],
  [appMachine.states.Article, testArticle],
  [appMachine.states.Profile, testProfile],
  [appMachine.states.Editor, testEditor],
  [appMachine.states.Settings, testSettings],
  [appMachine.states.MyProfile, testMyProfile],
]);

const testModel = createModel(Machine(appMachine), {
  events: {
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
  },
});

function setupInterceptors() {
  cy.intercept(
    {
      url: "https://conduit.productionready.io/api/articles?limit=20&offset=0",
    },
    {
      fixture: "articles.json",
      delay: 200,
    }
  ).as("getArticles");
  cy.intercept(
    {
      url: "https://conduit.productionready.io/api/tags",
    },
    {
      fixture: "tags.json",
      delay: 200,
    }
  ).as("getTags");
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

const checkTestCoverage = (testPlans) => {
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

const SHORTEST = true;

context("Feedback App", () => {
  const testPlans = checkTestCoverage(
    SHORTEST ? testModel.getShortestPathPlans() : testModel.getSimplePathPlans()
  );
  console.log(testPlans[0]);

  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach(itTests);
    });
  });
});
