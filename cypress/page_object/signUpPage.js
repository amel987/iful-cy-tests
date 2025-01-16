class SignUpPage {
  // Locators
  getFirstNameField() {
    return cy.contains("First Name").eq(0).next();
  }

  getFirstNameFieldDuplicate() {
    return cy.get(':nth-child(7)');

  }

  getLastNameField() {
    return cy.contains("Last Name").next();
  }

  getEmailField() {
    return cy.get('[name="user_email"]');
  }

  getPasswordField() {
    return cy.get('[name="user_pass"]');
  }

  getMobileField() {
    return cy.get('[name="user_mobile"]');
    
  }

  getSignUpButton() {
    return cy.get('.signupbtn')
  }

  getCancelButton() {
    return cy.get('.cancelbtn')
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
