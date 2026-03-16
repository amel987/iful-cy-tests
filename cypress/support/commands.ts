/// <reference types="cypress" />
import { LoginPage } from "../page_objects/LoginPage";
import userData from "../fixtures/userData.json";

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

Cypress.Commands.add("getFirstEmployee", () => {
  return cy
    .request({ method: "GET", url: "/web/index.php/api/v2/pim/employees?limit=1" })
    .then((response) => {
      const emp = response.body.data[0];
      return {
        empNumber: emp.empNumber as number,
        firstName: emp.firstName as string,
        lastName: emp.lastName as string,
      };
    });
});

Cypress.Commands.add("createUserViaApi", (username: string) => {
  cy.apiLogin();
  cy.getFirstEmployee().then((employee) => {
    cy.request({
      method: "POST",
      url: "/web/index.php/api/v2/admin/users",
      headers: { "Content-Type": "application/json" },
      body: {
        username,
        password: userData.newUser.password,
        userRoleId: userData.newUser.userRoleId,
        empNumber: employee.empNumber,
        status: userData.newUser.status === "Enabled",
      },
    });
  });
});

Cypress.Commands.add("deleteUserViaApi", (username: string) => {
  cy.apiLogin();
  cy.request({
    method: "GET",
    url: `/web/index.php/api/v2/admin/users?userName=${username}`,
    failOnStatusCode: false,
  }).then((response) => {
    if (response.body.data?.length > 0) {
      const id = response.body.data[0].id as number;
      cy.request({
        method: "DELETE",
        url: "/web/index.php/api/v2/admin/users",
        headers: { "Content-Type": "application/json" },
        body: { ids: [id] },
      });
    }
  });
});
