/// <reference types="cypress" />

export default {
  "Comment.clean": function () {
    cy.get("textarea#body").should("have.value", "");
  },
  "Comment.editing": function () {
    cy.get("textarea#body").should("have.value", "This is a comment.");
  },
  "Comment.posting": function () {},
  "Comment.posted": function () {
    cy.get(".card-text").contains("This is a comment.");
    cy.url().should("contain", "/article");
  },
  "Comment.deleted": function () {
    cy.contains("This is a comment.").should("not.exist");
  },
};
