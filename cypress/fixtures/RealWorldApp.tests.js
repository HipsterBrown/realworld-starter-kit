/// <reference types="cypress" />

export function testHome() {
  cy.get("body").contains("conduit");

  cy.get(".home-page").contains("Global Feed");
  cy.get(".home-page").contains("Loading articles...");
  cy.get(".sidebar").contains("Popular Tags");
  cy.get(".sidebar").contains("Loading tags...");

  cy.wait(["@getArticles", "@getTags"]);

  cy.get(".home-page").contains("Read more...");
  cy.get(".sidebar").contains("dragons");
}

export function testHomeTag() {
  cy.url().should("contain", "tag=dragons");
  cy.get(".home-page").contains("#dragons");
}

export function testHomeAuth() {
  cy.get(".navbar").contains("New Post");
  cy.get(".navbar").contains("Settings");
  cy.get(".home-page").contains("Your Feed");

  testHome();
}

export function testSignUp() {
  cy.contains("Sign up");
}

export function testSignIn() {
  cy.contains("Log In");
}

export function testProfile() {
  cy.fixture("articles.json").then(function ($json) {
    const a = $json.articles[0];
    cy.get("h4").contains(a.author.username);
  });
}

export function testMyProfile() {
  cy.url().should("contain", "/profile/FirstLast");
  cy.get("h4").contains("FirstLast");
}

export function testArticle() {
  cy.fixture("articles.json").then(function ($json) {
    const a = $json.articles[0];
    cy.get(".article-page").contains(a.body);
  });
}

export function testComment() {
  cy.get("textarea#body").should("have.value", "");
}

export function testEditor() {
  cy.get("#title").should("have.value", "");
  cy.get("#description").should("have.value", "");
  cy.get("#body").should("have.value", "");
  cy.get("#tagList").should("have.value", "");
  cy.get("button.btn").contains("Publish Article");
}

export function testSettings() {
  cy.get("h1").contains("Your Settings");
}

export const testStates = {
  Home: testHome,
  SignUp: testSignUp,
  SignIn: testSignIn,
  Profile: testProfile,
  HomeTag: testHomeTag,
  HomeAuth: testHomeAuth,
  MyProfile: testMyProfile,
  Settings: testSettings,
  Article: testArticle,
  Comment: testComment,
  Editor: testEditor,
};

export default testStates;
