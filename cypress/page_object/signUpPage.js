/// <reference types="cypress"/>

class SignUpPage {
  // Locators
  getFirstNameField() {
    return cy.contains("First Name").eq(0).next().should("be.visible");
  }

  getFirstNameFieldDuplicate() {
    return cy.get(":nth-child(7)").should("be.visible");
  }

  getLastNameField() {
    return cy.contains("Last Name").next().should("be.visible");
  }

  getEmailField() {
    return cy.get('[name="user_email"]').should("be.visible");
  }

  getPasswordField() {
    return cy.get('[name="user_pass"]').should("be.visible");
  }

  getMobileField() {
    return cy.get('[name="user_mobile"]').should("be.visible");
  }

  getSignUpButton() {
    return cy.get(".signupbtn").should("be.visible");
  }

  getCancelButton() {
    return cy.get(".cancelbtn").should("be.visible");
  }

  // Methods
  enterFirstName(firstName) {
    this.getFirstNameField().clear().type(firstName);
  }

  enterFirstNameDuplicate(firstName) {
    this.getFirstNameFieldDuplicate().clear().type(firstName);
  }

  enterLastName(lastName) {
    this.getLastNameField().clear().type(lastName);
  }

  enterEmail(email) {
    this.getEmailField().clear().type(email);
  }

  enterPassword(password) {
    this.getPasswordField().clear().type(password);
  }

  enterMobile(mobile) {
    this.getMobileField().clear().type(mobile);
  }

  clickSignUp() {
    this.getSignUpButton().click();
  }

  clickCancel() {
    this.getCancelButton().click();
  }
}

export default new SignUpPage();
