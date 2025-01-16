/// <reference types="Cypress"/>

import pageElements from "./POM/pageElements"
const pe = new pageElements()

let urls = []

describe("Abstract WebUI test", () => {
  it("Make a search by language", () => {
    
    
    pe.OpenHomePage_and_verifyTitle()
    pe.OpenMenuExplore()
    pe.selectSubMenuTrending()
    pe.clickOnLanguageFilter()
    pe.EnterYourLanguage("javaScript{downArrow}{downArrow}{enter}")
    pe.SelectLinkThisWeek()
    pe.SelectDateRange({timeout:3000})

      cy.get('[aria-label="star"]')
      .parent()
      .filter((k, el) => {
        return el.innerText.replace(/,/g, '') > 30000
      })     
      .parent().parent().find('h1 > a').each($a => {
        const href = $a.attr('href')
        urls.push(href)
      })      
  })

  it("should check for the title on each page", () => {
    cy.log(urls)

    
    urls.forEach((url) => {
      cy.visit(`/${url}`)
      cy.title().should('exist')
    })
  })

})