export class BasePage {
  visit(path = "/"): void {
    cy.visit(path);
  }

 assertToast(message: string): void {
  cy.contains(".oxd-toast-content-text", message)
    .should("be.visible");
}
}
