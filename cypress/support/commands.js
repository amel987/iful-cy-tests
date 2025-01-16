/// <reference types="cypress" />
import pages from "../page_object/basePage";

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/login", { timeout: 6000 });
  pages.home.navigateToLoginPage;
  cy.contains('Login Form').should('be.visible');
  pages.login.fillEmail(email);
  pages.login.fillPassword(password, { log: false });
  pages.login.submit();
  cy.url().should("be.eq", `${Cypress.config().baseUrl}/`);
  cy.contains("Successful login").should("be.visible");
});

Cypress.Commands.add("signupNewUser",(first_name, duplicate_first_name, last_name, email, mobile) => {
    cy.visit("/signup");
    cy.contains('Please fill in this form to create an account.')
      .should('be.visible');
    pages.signUp.enterFirstName(first_name);
    pages.signUp.enterFirstNameDuplicate(duplicate_first_name);
    pages.signUp.enterLastName(last_name);
    pages.signUp.enterEmail(email);
    pages.signUp.enterPassword(Cypress.env("USER_PASSWORD"));
    pages.signUp.enterMobile(mobile);
    pages.signUp.clickSignUp();
  }
);

Cypress.Commands.add("checkValidationMessage",(fieldGetter, expectedMessage) => {
    fieldGetter().then(($input) => {
      expect($input[0].validationMessage).to.include(expectedMessage);
    });
  }
);
