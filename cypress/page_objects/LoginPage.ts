import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  private readonly usernameInput = 'input[name="username"]';
  private readonly passwordInput = 'input[name="password"]';
  private readonly loginButton = 'button[type="submit"]';
  private readonly errorAlert = ".oxd-alert-content-text";
  private readonly forgotPasswordLink = ".orangehrm-login-forgot > p";
  private readonly fieldError = ".oxd-input-field-error-message";

  navigateTo(): void {
    this.visit("/web/index.php/auth/login");
  }

  enterUsername(username: string): void {
    cy.get(this.usernameInput).clear().type(username);
  }

  enterPassword(password: string): void {
    cy.get(this.passwordInput).clear().type(password, { log: false });
  }

  clickLogin(): void {
    cy.get(this.loginButton).click();
  }

  login(username: string, password: string): void {
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLogin();
  }

  getErrorMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.errorAlert);
  }

  clickForgotPassword(): void {
    cy.get(this.forgotPasswordLink).click();
  }

  getUsernameInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.usernameInput);
  }

  getPasswordInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.passwordInput);
  }

  getFieldErrors(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.fieldError);
  }
}
