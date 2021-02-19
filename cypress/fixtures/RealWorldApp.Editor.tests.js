/// <reference types="cypress" />

export default {
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
