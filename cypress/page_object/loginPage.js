/// <reference types="Cypress"/>

class loginPage {
  // Locators
  getUsernameField() {
    return cy.get('[type="text"]');  // Correctly returning the element
  }

  getPasswordField() {
    return cy.get('[type="password"]');  // Correctly returning the element
  }

  getSubmitBtn() {
    return cy.get('button');  // Correctly returning the element
  }

  // Methods

  fillEmail(email) {
    this.getUsernameField().type(email);  // Fixed by adding () to getUsernameField()
  }

  fillPassword(password) {
    this.getPasswordField().type(password);  // Fixed by adding () to getPasswordField()
  }

  submit() {
    this.getSubmitBtn().click();  // Fixed by adding () to getSubmitBtn()
  }
}

export default new loginPage();  // Exporting as a singleton instance
