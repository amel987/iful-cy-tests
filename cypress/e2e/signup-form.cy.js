/// <reference types="cypress"/>

import pages from "../page_object/basePage";

describe("Sign Up Form Tests ", () => {
  const email = `cypress+${Date.now()}@test.com`;

  beforeEach(() => {
    cy.visit("/signup");
    cy.contains("Sign Up").should("be.visible");
  });

  it("Verify Form Submission with Valid Data", () => {
    cy.signupNewUser("test", "test", "lastname", email, Date.now());
    cy.contains("User has been successfully registered.").should("be.visible");
  });

  it("Verify UI Elements on Signup Page", () => {
    pages.signUp
      .getFirstNameField()
      .should("be.enabled")
      .and("have.attr", "placeholder", "Enter First Name")
      .and("have.attr", "required");

    cy.log("duplicate first name???");
    pages.signUp
      .getFirstNameFieldDuplicate()
      .should("be.enabled")
      .and("have.attr", "placeholder", "Enter First Name")
      .and("have.attr", "required");

    pages.signUp
      .getFirstNameField()
      .should("be.enabled")
      .and("have.attr", "placeholder", "Enter First Name")
      .and("have.attr", "required");

    pages.signUp
      .getEmailField()
      .should("be.enabled")
      .and("have.attr", "placeholder", "Enter Email")
      .and("have.attr", "required");

    pages.signUp
      .getPasswordField()
      .should("be.enabled")
      .and("have.attr", "placeholder", "Enter Password")
      .and("have.attr", "required");

    pages.signUp
      .getMobileField()
      .should("be.enabled")
      .and("have.attr", "placeholder", "Enter Mobile")
      .and("have.attr", "required");

    pages.signUp
      .getSignUpButton()
      .should("be.enabled")
      .and("have.text", "Sign Up");

    pages.signUp
      .getCancelButton()
      .should("be.enabled")
      .and("have.text", "Cancel");

    pages.signUp
      .getLastNameField()
      .should("be.enabled")
      .and("have.attr", "placeholder", "Enter Last Name");
  });

  it("Verify Input Validation for Email Field", () => {
    const invalidMail = "invalid.mail";
    cy.signupNewUser("test", "test", "lastname", invalidMail, Date.now());
    cy.contains("email format is invalid").should("be.visible");
  });

  it("Verify Password Masking", () => {
    pages.signUp.enterPassword("test");
    pages.signUp.getPasswordField().should("have.attr", "type", "password");
  });

  it("Verify Cancel Button Functionality", () => {
    pages.signUp.enterFirstName("first_name");
    pages.signUp.enterFirstNameDuplicate("duplicate_first_name");
    pages.signUp.enterLastName("last_name");
    pages.signUp.enterEmail("email@email.com");
    pages.signUp.enterPassword(Cypress.env("USER_PASSWORD"));
    pages.signUp.enterMobile("+12345678");
    pages.signUp.clickCancel();
    cy.log("The form should reset");

    pages.signUp.getFirstNameField().should("have.value", "");
    pages.signUp.getFirstNameFieldDuplicate().should("have.value", "");
    pages.signUp.getLastNameField().should("have.value", "");
    pages.signUp.getEmailField().should("have.value", "");
    pages.signUp.getPasswordField().should("have.value", "");
    pages.signUp.getMobileField().should("have.value", "");
  });

  it("Verify Mobile Number Validation", () => {
    const invalidMobileNumbers = ["abcd", "123", "12345678901234567890"];
    invalidMobileNumbers.forEach((number) => {
      cy.signupNewUser("test", "test", "lastname", "mail@mail.com", number);

      cy.contains("Invalid mobile number")
        .should("be.visible")
        .and("contain", "Invalid mobile number");
    });
  });
});
