/// <reference types="cypress" />

import { testHome, testMyProfile } from "./RealWorldApp.tests";

export default {
  "Settings.clean": function () {
    cy.get("#image").should("have.value", "");
    cy.get("#username").should("have.value", "FirstLast");
    cy.get("#bio").should("have.value", "");
    cy.get("#email").should("have.value", "first@last.co");
    cy.get("#password").should("have.value", "");
  },
  "Settings.editing": function () {
    cy.get("#image").should("have.value", "");
    cy.get("#username").should("have.value", "FirstLast");
    cy.get("#bio").should("have.value", "I'm a little teapot...");
    cy.get("#email").should("have.value", "first@last.co");
    cy.get("#password").should("have.value", "password");
  },
  "Settings.updating": function () {
    cy.get("button.btn").contains("Updating...");
  },
  "Settings.updated": function () {
    // Should navigate to Profile
    testMyProfile();
  },
  "Settings.logged-out": function () {
    // Should navigate to Home
    testHome();
  },
};
