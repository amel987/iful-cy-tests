import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  private readonly dashboardHeader = ".oxd-topbar-header-breadcrumb h6";
  private readonly userDropdown = ".oxd-userdropdown-tab";
  private readonly logoutMenuItem = ".oxd-userdropdown-link:last-child";
  private readonly welcomeMessage = ".oxd-userdropdown-name";
  private readonly widgetName = ".orangehrm-dashboard-widget-name";
  private readonly widgetContainer = ".orangehrm-dashboard-widget";

  navigateTo(): void {
    this.visit("/web/index.php/dashboard/index");
  }

  isLoaded(): void {
    cy.url().should("include", "/dashboard/index");
    cy.get(this.dashboardHeader).should("contain.text", "Dashboard");
  }

  getWelcomeMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.welcomeMessage);
  }

  logout(): void {
    cy.get(this.userDropdown).click();
    cy.contains('a', 'Logout').click()
  }

  // ── Widget helpers ────────────────────────────────────────────────────────

  getWidget(title: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.contains(this.widgetName, title)
      .closest(this.widgetContainer);
  }

  assertWidgetVisible(title: string): void {
    this.getWidget(title).should("be.visible");
  }

  assertChartRendered(title: string): void {
    this.getWidget(title)
      .find("canvas")
      .should("exist")
      .and(($canvas) => {
        expect(($canvas[0] as HTMLCanvasElement).width).to.be.greaterThan(0);
        expect(($canvas[0] as HTMLCanvasElement).height).to.be.greaterThan(0);
      });
  }

  assertWidgetDoesNotContain(title: string, text: string): void {
    this.getWidget(title).should("not.contain.text", text);
  }

  assertWidgetHasNoErrorState(title: string): void {
    this.getWidget(title).should("not.contain.text", "No data available");
    this.getWidget(title).should("not.contain.text", "Error");
  }

  getQuickLaunchWidget(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getWidget("Quick Launch");
  }
}
