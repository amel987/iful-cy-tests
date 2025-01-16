/// <reference types="cypress"/>

import pages from "../page_object/basePage";

describe("Sign Up Form Tests with Multiple Users", () => {
  beforeEach(() => {
    cy.visit("/");
    pages.home.navigateToSignUpPage();
  });

  it("should allow each user to sign up successfully", function () {
    cy.fixture("users").then((users) => {
      Object.keys(users).forEach((userKey) => {
        const user = users[userKey];
        cy.visit("/signup");
        cy.signupNewUser(
          user.first_name,
          user.first_name,
          user.last_name,
          user.email,
          user.mobile
        );
        cy.contains("User has been successfully registered.").should(
          "be.visible"
        );

        cy.login(user.email, Cypress.env("USER_PASSWORD"));
      });
    });
  });

  it("should NOT allow user to sign up with same email", function () {
    cy.fixture("users").then((users) => {
      const user = users.user1;
      cy.signupNewUser(
        user.first_name,
        user.first_name,
        user.last_name,
        user.email,
        user.mobile
      );
      cy.contains(
        "Oops! There is already a user registered with the email provided."
      ).should("be.visible");
    });
  });
});
