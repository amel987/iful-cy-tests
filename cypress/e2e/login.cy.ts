import { LoginPage } from "../page_objects/LoginPage";
import { DashboardPage } from "../page_objects/DashboardPage";
import credentials from "../fixtures/credentials.json";

const loginPage = new LoginPage();
const dashboardPage = new DashboardPage();

describe("Login", () => {
  beforeEach(() => {
    loginPage.navigateTo();
  });

  it("redirects to dashboard and shows username in header", () => {
    loginPage.login(Cypress.env("ADMIN_USERNAME") as string, Cypress.env("ADMIN_PASSWORD") as string);
    dashboardPage.isLoaded();
    dashboardPage.getWelcomeMessage().should("be.visible");
  });

  it("navigates to Forgot Password page", () => {
    loginPage.clickForgotPassword();
    cy.url().should("include", "/requestPasswordResetCode");
  });

  context("Session", () => {
    it("stays on dashboard after page reload", () => {
      cy.loginAsAdmin();
      dashboardPage.navigateTo();
      cy.reload();
      dashboardPage.isLoaded();
    });

    it("redirects to login page after logout", () => {
      cy.loginAsAdmin();
      dashboardPage.navigateTo();
      dashboardPage.logout();
      cy.url().should("include", "/auth/login");
    });

    it("cannot access dashboard when not logged in", () => {
      cy.visit("/web/index.php/dashboard/index");
      cy.url().should("include", "/auth/login");
    });
  });

  context("Invalid credentials", () => {
    credentials.invalidCredentials.forEach(({ username, password, description }) => {
      it(`shows error for ${description}`, () => {
        loginPage.login(username, password);
        loginPage
          .getErrorMessage()
          .should("be.visible")
          .and("contain.text", "Invalid credentials");
      });
    });
  });

  context("Field validation", () => {
    it("shows Required on both fields when submitting empty form", () => {
      loginPage.clickLogin();
      loginPage.getFieldErrors().should("have.length", 2).and("contain.text", "Required");
    });

    it("shows Required on password field when only username is filled", () => {
      loginPage.enterUsername(Cypress.env("ADMIN_USERNAME") as string);
      loginPage.clickLogin();
      loginPage.getFieldErrors().should("have.length", 1).and("contain.text", "Required");
    });

    it("shows Required on username field when only password is filled", () => {
      loginPage.enterPassword(Cypress.env("ADMIN_PASSWORD") as string);
      loginPage.clickLogin();
      loginPage.getFieldErrors().should("have.length", 1).and("contain.text", "Required");
    });

    it("masks the password input", () => {
      loginPage.getPasswordInput().should("have.attr", "type", "password");
    });
  });
});
