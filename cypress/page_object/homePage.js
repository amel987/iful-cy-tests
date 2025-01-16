/// <reference types="cypress"/>

class homePage {
  //locators

  getFacebookBtn() {
    return cy.get(".fb").should("be.visible");
  }

  getTwitterBtn() {
    return cy.get(".twitter").should("be.visible");
  }

  getGoogleBtn() {
    return cy.get(".google").should("be.visible");
  }

  getUsernameField() {
    return cy.get('[type="text"]').should("be.visible");
  }

  getPasswordField() {
    return cy.get('[type="password"]').should("be.visible");
  }

  getNavSignUpBtn() {
    return cy.contains("Sign up").should("be.visible");
  }

  getNavLoginBtn() {
    return cy.contains("Log In").should("be.visible");
  }

  submit() {
    return cy.get('[type="submit"]').should("be.visible");
  }

  //methods

  fillUsername(email) {
    this.getUsernameField().type(email);
  }

  fillPassword(password) {
    this.getPasswordField().type(password);
  }

  navigateToSignUpPage() {
    this.getNavSignUpBtn().click();
    cy.get("h1").should("contain.text", "Sign Up");
    cy.contains("Please fill in this form to create an account.").should(
      "be.visible"
    );
  }
  navigateToLoginPage() {
    this.getNavLoginBtn().click();
  }

  clickOnFaceBookBtn() {
    this.getFacebookBtn().click();
  }

  clickOnTwitterBtn() {
    this.getTwitterBtn().click();
  }

  clickOnGoogleBtn() {
    this.getGoogleBtn().click();
  }

  loginSubmit() {
    this.submit().click();
  }
}

export default new homePage();
