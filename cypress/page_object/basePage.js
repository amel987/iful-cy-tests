/// <reference types="cypress"/>

import homePage from "../page_object/homePage";
import signUpPage from "../page_object/signUpPage";
import loginPage from "../page_object/loginPage";

class basePage {
  constructor() {
    this.home = homePage;
    this.signUp = signUpPage;
    this.login = loginPage;
  }
}

export default new basePage();
