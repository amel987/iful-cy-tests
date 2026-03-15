import { BasePage } from "./BasePage";

export class VacanciesPage extends BasePage {
  private readonly tableRows = ".oxd-table-body .oxd-table-row";
  private readonly selectDropdown = ".oxd-select-dropdown";
  private readonly spinner = ".oxd-loading-spinner";
  private readonly noRecordsMessage = "No Records Found";

  navigateTo(): void {
    this.visit("/web/index.php/recruitment/viewJobVacancy");
  }

  // ── Search form ───────────────────────────────────────────────────────────

  typeVacancy(name: string): void {
    cy.contains('.oxd-input-group', 'Vacancy')
      .find('.oxd-select-text-input')
      .click()

    cy.get('.oxd-select-dropdown')
      .contains(name)
      .click()
  }

  typeHiringManager(name: string): void {

    cy.contains('.oxd-input-group', 'Hiring Manager')
      .find('.oxd-select-text-input')
      .click()

    cy.get('.oxd-select-dropdown')
      .contains(name)
      .click()
  }

  selectJobTitle(title: string): void {
    cy.contains(".oxd-label", "Job Title")
      .closest(".oxd-input-group")
      .find(".oxd-select-wrapper")
      .click();
    cy.get(this.selectDropdown).contains(title).click();
  }

  selectStatus(status: string): void {
    cy.contains(".oxd-label", "Status")
      .closest(".oxd-input-group")
      .find(".oxd-select-wrapper")
      .click();
    cy.get(this.selectDropdown).contains(status).click();
  }

  clickSearch(): void {
    cy.intercept("GET", "**/api/v2/recruitment/vacancies**").as("vacancySearch");
    cy.contains("button", "Search").click();
    cy.wait("@vacancySearch");
    cy.get(this.spinner).should("not.exist");
  }

  clickReset(): void {
    cy.contains("button", "Reset").click();
    cy.get(this.spinner).should("not.exist");
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  getTableRows(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.tableRows);
  }

  assertResultsFound(expectedContent?: string): void {
    cy.get(this.tableRows).should("have.length.greaterThan", 0);
    if (expectedContent) {
      this.getTableRows().each(($row) => {
        cy.wrap($row).should("contain.text", expectedContent);
      });
    }
  }

  assertNoRecordsFound(): void {
    cy.contains(this.noRecordsMessage).should("be.visible");
  }

  assertVacancyInputIsEmpty(): void {
    cy.contains(".oxd-label", "Vacancy")
      .closest(".oxd-input-group")
      .should("contain", "-- Select --");
  }

  assertStatusIsReset(): void {
    cy.contains(".oxd-label", "Status")
      .closest(".oxd-input-group")
      .find(".oxd-select-text-input")
      .should("contain", "-- Select --");
  }
}
