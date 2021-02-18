/// <reference types="cypress" />

export function getArticlesInterceptor() {
  cy.intercept(
    "https://conduit.productionready.io/api/articles?limit=20&offset=0",
    {
      fixture: "articles.json",
      delay: 200,
    }
  ).as("getArticles");
}

export function getTagsInterceptor() {
  cy.intercept("https://conduit.productionready.io/api/tags", {
    fixture: "tags.json",
    delay: 200,
  }).as("getTags");
}

export function registerUserInterceptor() {
  cy.intercept(
    {
      method: "POST",
      url: "https://conduit.productionready.io/api/users",
    },
    {
      fixture: "signUpSuccess_200.json",
      delay: 500,
    }
  ).as("registerUser");
}

export function postUserLoginInterceptor() {
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
