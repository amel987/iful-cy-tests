/// <reference types="cypress" />
import { LoginPage } from "../page_objects/LoginPage";

const loginPage = new LoginPage();

Cypress.Commands.add("loginAs", (username: string, password: string) => {
  loginPage.navigateTo();
  loginPage.login(username, password);
  cy.url().should("include", "/dashboard/index");
});

Cypress.Commands.add("loginAsAdmin", () => {
  const username = Cypress.env("ADMIN_USERNAME") as string;
  const password = Cypress.env("ADMIN_PASSWORD") as string;
  cy.session(
    "adminSession",
    () => cy.loginAs(username, password),
    {
      cacheAcrossSpecs: true,
      validate() {
        cy.request({
          method: "GET",
          url: "/web/index.php/api/v2/dashboard/shortcuts",
          failOnStatusCode: false,
        }).its("status").should("eq", 200);
      },
    }
  );
});

Cypress.Commands.add("apiLogin", () => {
  cy.clearAllCookies();
  cy.visit("/web/index.php/auth/login");
  cy.get('input[name="username"]').type(Cypress.env("ADMIN_USERNAME") as string);
  cy.get('input[name="password"]').type(Cypress.env("ADMIN_PASSWORD") as string, { log: false });
  cy.get('button[type="submit"]').click();
  cy.url().should("include", "/dashboard/index");
});
