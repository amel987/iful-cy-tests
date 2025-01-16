/// <reference types="cypress"/>

class loginPage {
  // Locators
  getUsernameField() {
    return cy.get('[type="text"]').should('be.visible');
  }

  getPasswordField() {
    return cy.get('[type="password"]').should('be.visible'); 
  }

  getSubmitBtn() {
    return cy.get('button').should('be.visible');
  }

  // Methods

  fillEmail(email) {
    this.getUsernameField().type(email);
  }

  fillPassword(password) {
    this.getPasswordField().type(password);
  }

  submit() {
    this.getSubmitBtn().click();
  }
}

export default new loginPage();
