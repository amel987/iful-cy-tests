/// <reference types="Cypress"/>

import pages from "../page_object/basePage";

describe("Sign Up Form Tests with Multiple Users", () => {
  const email = `cypress+${Date.now()}@ctest.com`;

  before(() => {
    cy.log(email);
    cy.signupNewUser("test", "test", "lastname", email, Date.now());
    cy.contains("User has been successfully registered.").should("be.visible");
  });

  beforeEach(() => {
    cy.visit("/");
  });

  it("Verify successful login with valid credentials", () => {
    cy.fixture("users").then((user) => {
      const users = user.user1;

      pages.home.fillUsername(users.email);
      pages.home.fillPassword(Cypress.env("USER_PASSWORD"));
      pages.home.loginSubmit();
      cy.contains("Successful login").should("be.visible");
    });
  });

  it("Verify login with empty fields", () => {
    pages.home.getUsernameField().clear();
    pages.home.getPasswordField().clear();
    pages.home.loginSubmit();
    cy.checkValidationMessage(
      pages.home.getUsernameField,
      "Please fill out this field."
    );

    pages.home.fillUsername('test');
    pages.home.loginSubmit();
    cy.checkValidationMessage(
      pages.home.getPasswordField,
      "Please fill out this field."
    );
    
  });

  it("Verify -Login with Social Media- buttons are functional", () => {

    pages.home.clickOnFaceBookBtn()
    cy.log('we clicked on the facebook link, the integration with facebook opens :)')

    pages.home.clickOnTwitterBtn()
    cy.log('we clicked on the twitter link, the integration with twitter opens :)')

    pages.home.clickOnGoogleBtn()
    cy.log('we clicked on the google link, the integration with google opens :)')

  });
});
