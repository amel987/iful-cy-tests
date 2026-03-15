import { DashboardPage } from "../page_objects/DashboardPage";

const dashboardPage = new DashboardPage();

describe("Dashboard", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    dashboardPage.navigateTo();
    dashboardPage.isLoaded();
  });

  context("Employee Distribution by Sub Unit widget", () => {
    const widgetTitle = "Employee Distribution by Sub Unit";

    it("is visible on the dashboard", () => {
      dashboardPage.assertWidgetVisible(widgetTitle);
    });

    it("renders a chart with non-zero dimensions", () => {
      dashboardPage.assertChartRendered(widgetTitle);
    });

    it("does not show an error or no-data state", () => {
      dashboardPage.assertWidgetHasNoErrorState(widgetTitle);
    });

    it("does not display a non-existent sub unit label", () => {
      dashboardPage.assertWidgetDoesNotContain(widgetTitle, "Narnia Division");
    });

    it("does not show content from an unrelated widget", () => {
      dashboardPage.assertWidgetDoesNotContain(widgetTitle, "Employee Distribution by Location");
    });
  });

  context("Employee Distribution by Location widget", () => {
    const widgetTitle = "Employee Distribution by Location";

    it("is visible on the dashboard", () => {
      dashboardPage.assertWidgetVisible(widgetTitle);
    });

    it("renders a chart with non-zero dimensions", () => {
      dashboardPage.assertChartRendered(widgetTitle);
    });

    it("does not show an error or no-data state", () => {
      dashboardPage.assertWidgetHasNoErrorState(widgetTitle);
    });

    it("does not display a non-existent location label", () => {
      dashboardPage.assertWidgetDoesNotContain(widgetTitle, "Moon Base Alpha");
    });

    it("does not show content from an unrelated widget", () => {
      dashboardPage.assertWidgetDoesNotContain(widgetTitle, "Employee Distribution by Sub Unit");
    });
  });

  context("Quick Launch widget", () => {
    const widgetTitle = "Quick Launch";
    const expectedShortcuts = ["Assign Leave", "Leave List", "Timesheets", "Apply Leave"];
    const nonExistentShortcut = "Teleport";

    it("is visible on the dashboard", () => {
      dashboardPage.assertWidgetVisible(widgetTitle);
    });

    it("displays all expected shortcut buttons", () => {
      expectedShortcuts.forEach((label) => {
        dashboardPage.getQuickLaunchWidget().contains(label).should("be.visible");
      });
    });

    it("does not display a non-existent shortcut", () => {
      dashboardPage.assertWidgetDoesNotContain(widgetTitle, nonExistentShortcut);
    });
  });
});
