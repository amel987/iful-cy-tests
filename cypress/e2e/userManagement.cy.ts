import { UserManagementPage } from "../page_objects/UserManagementPage";
import { generateUnique } from "../support/utils";
import userData from "../fixtures/userData.json";

const userPage = new UserManagementPage();

describe("User Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    userPage.navigateTo();
  });

  describe("Create", () => {
    const username = generateUnique("qa_user_create");

    after(() => cy.deleteUserViaApi(username));

    it("creates a new user via UI and verifies it appears in the list", () => {
      cy.getFirstEmployee().then((employee) => {
      userPage.clickAdd();
      userPage.selectUserRole(userData.newUser.role);
      userPage.typeEmployeeName(employee.firstName);
      userPage.selectStatus(userData.newUser.status);
      userPage.typeUsername(username);
      userPage.typePassword(userData.newUser.password);
      userPage.typeConfirmPassword(userData.newUser.password);
      userPage.clickSave();

      userPage.assertToast("Successfully Saved");
      cy.url().should("include", "/viewSystemUsers");

      userPage.searchByUsername(username);
      userPage.getTableRows().should("have.length", 1);
      userPage.getRowByUsername(username).within(() => {
        cy.contains(username).should("be.visible");
        cy.contains(userData.newUser.role).should("be.visible");
        cy.contains(userData.newUser.status).should("be.visible");
      });
      });
    });
  });

  describe("Edit", () => {
    const username = generateUnique("qa_user_edit");

    before(() => cy.createUserViaApi(username));
    after(() => cy.deleteUserViaApi(username));

    it("edits the user status and verifies the update in the list", () => {
      userPage.searchByUsername(username);
      userPage.clickEditForUser(username);

      cy.url().should("include", "/saveSystemUser");

      userPage.selectStatus(userData.updatedStatus);
      userPage.clickSave();

      userPage.assertToast("Successfully Updated");
      cy.url().should("include", "/viewSystemUsers");

      userPage.searchByUsername(username);
      userPage.getRowByUsername(username).within(() => {
        cy.contains(userData.updatedStatus).should("be.visible");
      });
    });
  });

  describe("Delete", () => {
    const username = generateUnique("qa_user_delete");

    before(() => cy.createUserViaApi(username));
    after(() => cy.deleteUserViaApi(username));

    it("deletes the user and confirms it no longer appears in the list", () => {
      userPage.searchByUsername(username);
      userPage.clickDeleteForUser(username);
      userPage.confirmDelete();

      userPage.assertToast("Successfully Deleted");

      userPage.searchByUsername(username);
      userPage.assertUserNotVisible();
    });
  });
});
