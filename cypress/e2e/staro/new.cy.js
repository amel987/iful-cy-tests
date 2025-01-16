/// <reference types="Cypress"/>

import pages from "../page_object/basePage";

// const pages = new basePage();

describe('Sign-Up Form Tests', () => {
  before(() => {
    cy.visit('/'); 
});

    it('should sign up successfully with valid details', () => {
     
      
      pages.home.navigateToSignUpPage()

      // //homePage.navigateToSignUp()
      // homePage.getUsernameField().should('exist');
      // homePage.navigateToSignUpPage();
      // SignUpPage.enterFirstName('test')
      
      //   // Assertions (Update based on app behavior)
      //   // cy.url().should('include', '/dashboard');
      //   // cy.contains('Welcome, John');




    });

});
