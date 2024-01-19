/// <reference types="Cypress" />

import { verifyArrayContainsObject } from "cypress/support/request-verification";

const generalInformation = 'Generel information';
const purposeInput = 'Systemets overordnede formål';
const businessCriticalDropdown = 'Forretningskritisk IT-System';
const hostedAtDropdown = 'IT-systemet driftes';

describe('it-system-usage', () => {
    beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: 'it-system-usages.json' });
    cy.intercept('/api/v2/it-system-usage-data-classification-types*', { fixture: 'classification-types.json' });
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: 'permissions.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' }); //gets the base system
    cy.intercept('/api/v2/it-system-usage-sensitive-personal-data-types?organizationUuid=*', { fixture: 'it-system-usage-sensitive-personal-data-types.json'})
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage-full-gdpr.json' });
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'it-system-usage-updated-gdpr.json' }).as('patch');

    cy.setup(true, 'it-systems/it-system-usages')

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('GDPR');
  })

  it('can show GDPR tab and existing data in general input fields', () => {
    cy.contains(generalInformation);
    cy.input(purposeInput).should('have.value', 'Test purpose');
    cy.dropdown(businessCriticalDropdown).should('have.text', "Ja");
    cy.dropdown(hostedAtDropdown).should('have.text', 'On-premise')
    //cy.contains('Link til fortegnelse');
  })

  it('can edit purpose', () => {
    const newPurpose = 'New purpose';
    cy.input(purposeInput).clear().type(newPurpose);
    cy.contains(generalInformation).click();

    cy.wait('@patch')
      .its('request.body')
      .should('deep.equal', { gdpr: { purpose: newPurpose }} );
    cy.input(purposeInput).should('have.value', newPurpose);
  })

  it('can edit business critical status', () => {
    const newBusinessCritical = "Nej";
    cy.dropdown(businessCriticalDropdown, newBusinessCritical, true)
    cy.contains(generalInformation).click();

    cy.wait('@patch')
      .its('request.body')
      .should('deep.equal', { gdpr: { businessCritical: "No" }} );
    cy.dropdown(businessCriticalDropdown).should('have.text', newBusinessCritical);
  })


  it('can expand data types section to show checkboxes', () => {
    cy.contains('Yderligere information')
    cy.contains('Hvilke typer data indeholder systemet?').click()
  })
})
