/// <reference types="cypress"/>

import pages from "../page_object/basePage";

describe("Sign Up Form Tests with Multiple Users", () => {
  const email = `cypress+${Date.now()}@test.com`;

  before(() => {
    cy.log(email);
    cy.signupNewUser("test", "test", "lastname", email, Date.now());
    cy.contains("User has been successfully registered.").should("be.visible");
  });

  beforeEach(() => {
    cy.visit("/login");
    cy.contains("Login Form").should("be.visible");
  });

  it("Verify successful login with valid credentials", () => {
    cy.login(email, Cypress.env("USER_PASSWORD"));
  });

  it("Empty Password", () => {
    pages.login.getPasswordField().clear();
    pages.login.fillEmail("test");
    pages.login.submit();
    cy.checkValidationMessage(
      pages.login.getPasswordField,
      "Please fill out this field."
    );
  });

  it("Empty Username", () => {
    pages.login.getUsernameField().clear();
    pages.login.fillPassword("test");
    pages.login.submit();
    cy.checkValidationMessage(
      pages.login.getUsernameField,
      "Please fill out this field."
    );
  });

  it("Invalid Password", () => {
    pages.login.fillEmail(email);
    pages.login.fillPassword("test");
    pages.login.submit();
    cy.contains("Invalid Email. Try again.");
  });

  it("Invalid Username", () => {
    pages.login.fillEmail("test@qwe.com");
    pages.login.fillPassword(Cypress.env("USER_PASSWORD"));
    pages.login.submit();
    cy.contains("Invalid Email. Try again.");
  });

  it("Verify link -Return to Login Form- is valid", () => {
    pages.login.fillEmail("test@qwe.com");
    pages.login.fillPassword("test");
    pages.login.submit();
    cy.contains("Invalid Email. Try again.");
    cy.contains("Return to Login Form").should("be.visible");
    cy.contains("Return to Login Form").click();
    pages.login.getUsernameField().should("be.visible");
    pages.login.getPasswordField().should("be.visible");
    pages.login.getSubmitBtn().should("be.enabled");
  });
});
