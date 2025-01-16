/// <reference types="cypress" />

// Importing the pages object
import pages from "../page_object/basePage";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Logs in a user with the provided email and password.
       * @param email - The email of the user.
       * @param password - The password of the user.
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Signs up a new user with the provided details.
       * @param first_name - The first name of the user.
       * @param duplicate_first_name - A duplicate first name for testing purposes.
       * @param last_name - The last name of the user.
       * @param email - The email of the user.
       * @param mobile - The mobile number of the user.
       */
      signupNewUser(
        first_name: string,
        duplicate_first_name: string,
        last_name: string,
        email: string,
        mobile: string
      ): Chainable<void>;

      /**
       * Checks for a validation message on a form field.
       * @param fieldGetter - A function that retrieves the field to check.
       * @param expectedMessage - The expected validation message.
       */
      checkValidationMessage(
        fieldGetter: () => Cypress.Chainable<JQuery<HTMLElement>>,
        expectedMessage: string
      ): Chainable<void>;
    }
  }
}

// Export the pages object so it can be referenced elsewhere
export { };
