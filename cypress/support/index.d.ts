/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Log in with provided username and password.
     * Navigates to login page, fills in credentials, and asserts dashboard URL.
     */
    loginAs(username: string, password: string): Chainable<void>;

    /**
     * Log in as admin using credentials from cypress.env.json
     * (ADMIN_USERNAME / ADMIN_PASSWORD).
     */
    loginAsAdmin(): Chainable<void>;

    /**
     * Browser-based login used in before/after API hooks.
     * Clears all cookies and logs in via cy.visit() so the resulting session
     * is shared with subsequent cy.request() calls.
     */
    apiLogin(): Chainable<void>;

    /** Fetch the first available employee from the PIM API. */
    getFirstEmployee(): Chainable<{ empNumber: number; firstName: string; lastName: string }>;

    /** Create a user via API using credentials from userData fixture. */
    createUserViaApi(username: string): Chainable<void>;

    /** Delete a user via API by username (no-op if not found). */
    deleteUserViaApi(username: string): Chainable<void>;
  }
}
