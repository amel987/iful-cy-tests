import { BasePage } from "./BasePage";

export class UserManagementPage extends BasePage {
  private readonly tableRows = ".oxd-table-body .oxd-table-row";
  private readonly noRecordsMessage = "No Records Found";
  private readonly deleteConfirmButton = ".oxd-button--label-danger";
  private readonly selectDropdown = ".oxd-select-dropdown";
  private readonly spinner = ".oxd-loading-spinner";

  navigateTo(): void {
    this.visit("/web/index.php/admin/viewSystemUsers");
  }

  clickAdd(): void {
    cy.contains("button", "Add").click();
  }

  // ── Add / Edit form ──────────────────────────────────────────────────────

  selectUserRole(role: string): void {
    cy.contains(".oxd-label", "User Role")
      .closest(".oxd-input-group")
      .find(".oxd-select-wrapper")
      .click();
    cy.get(this.selectDropdown).contains(role).click();
  }

  typeEmployeeName(partialName: string): void {
    cy.contains(".oxd-label", "Employee Name")
      .closest(".oxd-input-group")
      .find("input")
      .clear()
      .type(partialName);
    cy.get('[role="listbox"]')
      .find('[role="option"]')
      .contains(partialName)
      .click();
  }

  selectStatus(status: string): void {
    cy.contains(".oxd-label", "Status")
      .closest(".oxd-input-group")
      .find(".oxd-select-wrapper")
      .click();
    cy.get(this.selectDropdown).contains(status).click();
  }

  typeUsername(username: string): void {
    cy.contains(".oxd-label", "Username")
      .closest(".oxd-input-group")
      .find("input")
      .clear()
      .type(username);
  }

  typePassword(password: string): void {
    cy.contains(".oxd-label", "Password")
      .closest(".oxd-input-group")
      .find("input[type='password']")
      .type(password, { log: false });
  }

  typeConfirmPassword(password: string): void {
    cy.contains(".oxd-label", "Confirm Password")
      .closest(".oxd-input-group")
      .find("input[type='password']")
      .type(password, { log: false });
  }

  clickSave(): void {
    cy.contains("button", "Save").click();
    cy.get(this.spinner).should("not.exist");
  }

  // ── List page ────────────────────────────────────────────────────────────

  searchByUsername(username: string): void {
    cy.contains(".oxd-label", "Username")
      .closest(".oxd-input-group")
      .find("input")
      .clear()
      .type(username);
    cy.contains("button", "Search").click();
    cy.get(this.spinner).should("not.exist");
  }

  getTableRows(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.tableRows);
  }

  getRowByUsername(username: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.contains(this.tableRows, username);
  }

  clickEditForUser(username: string): void {
    this.getRowByUsername(username)
      .find(".bi-pencil-fill")
      .closest("button")
      .click();
  }

  clickDeleteForUser(username: string): void {
    this.getRowByUsername(username)
      .find(".bi-trash")
      .closest("button")
      .click();
  }

  confirmDelete(): void {
    cy.get(this.deleteConfirmButton).click();
    cy.get(this.spinner).should("not.exist");
  }

  assertUserNotVisible(): void {
    cy.contains(this.noRecordsMessage).should("be.visible");
  }
}
