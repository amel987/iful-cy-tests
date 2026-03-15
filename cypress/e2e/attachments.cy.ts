import { AttachmentsPage } from "../page_objects/AttachmentsPage";
import { generateUnique } from "../support/utils";

const attachmentsPage = new AttachmentsPage();

const fileName = "testAttachment.txt";
const description = generateUnique("QA_Attachment");
const attachmentsApi = "/web/index.php/api/v2/pim/employees/7/screen/personal/attachments?limit=50&offset=0";

describe("My Info - Attachments", () => {
  before(() => {
    cy.loginAsAdmin();
    attachmentsPage.navigateTo();
  });

  it("uploads, verifies, and deletes an attachment", () => {
    cy.intercept("GET", attachmentsApi).as("getAttachments");

    attachmentsPage.clickAdd();
    attachmentsPage.uploadFile(fileName);
    attachmentsPage.typeDescription(description);
    attachmentsPage.clickSave();
    cy.wait("@getAttachments");

    attachmentsPage.assertAttachmentVisible(fileName, description);
    attachmentsPage.assertDownloadButtonVisible(fileName);

    attachmentsPage.clickDeleteForAttachment(fileName);
    attachmentsPage.confirmDelete();
    cy.wait("@getAttachments");
    attachmentsPage.assertAttachmentNotVisible(fileName);
  });
});
