import { VacanciesPage } from "../page_objects/VacanciesPage";
import { generateUnique } from "../support/utils";
import vacancyData from "../fixtures/vacancyData.json";

const vacanciesPage = new VacanciesPage();
const vacancyName = generateUnique("vacancy");
let vacancyId: number;

describe("Recruitment - Vacancies Search", () => {
  before(() => {
    cy.apiLogin();
    cy.request({
      method: "POST",
      url: "/web/index.php/api/v2/recruitment/vacancies",
      headers: { "Content-Type": "application/json" },
      body: { ...vacancyData.vacancy, name: vacancyName },
    }).then(() => {
      cy.request({
        method: "GET",
        url: `/web/index.php/api/v2/recruitment/vacancies?name=${vacancyName}`,
      }).then((response) => {
        vacancyId = response.body.data[0].id;
      });
    });
  });

  after(() => {
    cy.apiLogin();
    cy.request({
      method: "DELETE",
      url: "/web/index.php/api/v2/recruitment/vacancies",
      headers: { "Content-Type": "application/json" },
      body: { ids: [vacancyId] },
    });
  });

  beforeEach(() => {
    cy.loginAsAdmin();
    vacanciesPage.navigateTo();
  });

  context("Search by Status", () => {
    it("returns results when filtering by Active status", () => {
      vacanciesPage.selectStatus(vacancyData.search.activeStatus);
      vacanciesPage.clickSearch();

      vacanciesPage.assertResultsFound(vacancyData.search.activeStatus);
    });

    it("does not show Active vacancies when filtering by Closed", () => {
      vacanciesPage.selectStatus(vacancyData.search.inactiveStatus);
      vacanciesPage.clickSearch();

      vacanciesPage.assertNoRecordsFound();
    });
  });

  context("Search by Vacancy", () => {
    it("returns the created vacancy when searching by exact name", () => {
      vacanciesPage.typeVacancy(vacancyName);
      vacanciesPage.clickSearch();

      vacanciesPage.assertResultsFound(vacancyName);
    });
  });

  context("Search by Hiring Manager", () => {
    it("returns results for a valid hiring manager name", () => {
      vacanciesPage.typeHiringManager(vacancyData.search.hiringManager);
      vacanciesPage.clickSearch();

      vacanciesPage.assertResultsFound(vacancyData.search.hiringManager);
    });
  });

  context("Search by Job Title", () => {
    it("returns results for a valid job title name", () => {
      vacanciesPage.selectJobTitle(vacancyData.search.jobTitle);
      vacanciesPage.clickSearch();

      vacanciesPage.assertResultsFound(vacancyData.search.jobTitle);
    });
  });

  context("Reset filter", () => {
    it("clears all filters and restores full results after reset", () => {
      vacanciesPage.typeVacancy(vacancyName);
      vacanciesPage.selectStatus(vacancyData.search.activeStatus);
      vacanciesPage.clickSearch();
      vacanciesPage.assertResultsFound();

      vacanciesPage.clickReset();

      vacanciesPage.assertVacancyInputIsEmpty();
      vacanciesPage.assertStatusIsReset();
      vacanciesPage.assertResultsFound();
    });
  });
});
