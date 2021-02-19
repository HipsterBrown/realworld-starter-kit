/// <reference types="cypress" />

export default {
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
  CLICK_TAG: function () {
    cy.get('[href="/?tag=dragons"]').click();
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
    cy.wait("@registerUser");
  },
  SUBMIT_SIGN_IN: function () {
    cy.get("#email").type("first@last.co");
    cy.get("#password").type("password");
    cy.get("button").contains("Log In").click();
    cy.wait("@postUserLogin");
  },
  CLICK_NEW_POST: function () {
    cy.contains("New Post").click();
  },
  EDIT_TITLE: function () {
    cy.get("#title").type("This is a test...{enter}");
  },
  SUBMIT_INCOMPLETE: function () {
    cy.get("button").contains("Publish Article").click();
  },
  SUBMIT_COMPLETE: function () {
    cy.get("#description").type("of the Editor");
    cy.get("#body").type("This is a test of the Editor.");
    cy.get("button").contains("Publish Article").click();
  },
  PUBLISH_COMPLETE: function () {
    cy.get(".article-page");
  },
  CLICK_SETTINGS: function () {
    cy.get(".navbar").contains("Settings").click();
  },
  "COMMENT.EDIT": function () {
    cy.get("textarea#body").type("This is a comment.");
  },
  "COMMENT.POST": function () {
    cy.get("button").contains("Post Comment").click();
  },
  "COMMENT.POSTED": function () {},
  "COMMENT.DELETE": function () {
    cy.get(".card-footer > button > .ion-trash-a").click({
      multiple: true,
      force: true,
    });
  },
  "SETTINGS.EDIT": function () {
    cy.get("#bio").type("I'm a little teapot...");
    cy.get("#password").type("password");
  },
  "SETTINGS.LOGOUT": function () {
    cy.get("button").contains("click here to logout").click();
  },
  "SETTINGS.UPDATE": function () {
    cy.get("button").contains("Update Settings").click();
  },
  "SETTINGS.UPDATED": function () {
    cy.url().should("contain", "/profile");
  },
  CLICK_MY_PROFILE: function () {
    cy.get(".nav-link").contains("FirstLast").click();
  },
};
