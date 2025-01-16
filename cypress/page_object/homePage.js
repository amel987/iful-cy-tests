/// <reference types="Cypress"/>

class homePage {

  //locators

  getFacebookBtn() {
    return cy.get(".fb");
  }

  getTwitterBtn() {
    return cy.get(".twitter");
  }

  getGoogleBtn() {
    return cy.get(".google");
  }

  getUsernameField() {
    return cy.get('[type="text"]');
  }

  getPasswordField() {
    return cy.get('[type="password"]');
  }

  getNavSignUpBtn() {
    return cy.contains("Sign up");
  }

  getNavLoginBtn() {
    return cy.contains("Log In");
  }

  submit() {
    return cy.get('[type="submit"]');
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
    cy.get('h1')
      .should('contain.text', 'Sign Up')
    cy.contains('Please fill in this form to create an account.')
      .should('be.visible');
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
