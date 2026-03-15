import { BasePage } from "./BasePage";

export class AttachmentsPage extends BasePage {
  private readonly attachmentsCard = ".orangehrm-horizontal-padding";
  private readonly tableRows = ".oxd-table-body .oxd-table-row";
  private readonly fileInput = 'input[type="file"]';
  private readonly deleteConfirmButton = ".oxd-button--label-danger";
  private readonly spinner = ".oxd-loading-spinner";

  navigateTo(): void {
    this.visit("/web/index.php/pim/viewMyDetails");
  }

  clickAdd(): void {
    cy.contains(".orangehrm-card-container", "Attachments")
      .contains("button", "Add")
      .click();
  }

  uploadFile(fileName: string): void {
    cy.get(this.fileInput).selectFile(`cypress/fixtures/${fileName}`, { force: true });
  }

  typeDescription(description: string): void {
    cy.get(".oxd-textarea")
      .clear()
      .type(description);
  }

  clickSave(): void {
    cy.contains('.orangehrm-card-container', 'Add Attachment')
      .contains('button', 'Save')
      .click()

    cy.get(this.spinner).should("not.exist");
  }

  // ── Assertions ───────────────────────────────────────────────────────────

  getRowByFileName(fileName: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.contains(".orangehrm-card-container", "Attachments")
      .contains(this.tableRows, fileName);
  }

  assertAttachmentVisible(fileName: string, description: string): void {

    cy.get('[role="row"]')
      .contains(fileName)
      .closest('[role="row"]')
      .within(() => {
        cy.contains(description).should('be.visible')
        cy.contains('Admin').should('be.visible')
      })
  }

  assertDownloadButtonVisible(fileName: string): void {
    this.getRowByFileName(fileName)
      .find(".bi-download")
      .closest("button")
      .should("be.visible");
  }

  clickDeleteForAttachment(fileName: string): void {
    this.getRowByFileName(fileName)
      .find(".bi-trash")
      .closest("button")
      .click();
  }

  confirmDelete(): void {
    cy.get(this.deleteConfirmButton).click();
    cy.get(this.spinner).should("not.exist");
  }

  assertAttachmentNotVisible(fileName: string): void {
    cy.contains(".orangehrm-card-container", "Attachments")
      .should("not.contain.text", fileName);
  }
}
