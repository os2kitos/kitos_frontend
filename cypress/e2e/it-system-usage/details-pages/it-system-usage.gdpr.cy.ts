/// <reference types="Cypress" />

describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: 'it-system-usages.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });
    cy.intercept('/api/v2/it-system-usage-data-classification-types*', { fixture: 'classification-types.json' });
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: 'permissions.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' }); //gets the base system
    cy.setup(true, 'it-systems/it-system-usages')

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('GDPR');
  })

  it('can show GDPR tab and general input fields', () => {
    cy.contains('Generel information');
    cy.contains('Systemets overordnede formål');
    cy.contains('Forretningskritisk IT-System');
    cy.contains('IT-systemet driftes');
    cy.contains('Link til fortegnelse');
  })

  it('can expand data types section to show checkboxes', () => {
    cy.contains('Yderligere information')
    cy.contains('Hvilke typer data indeholder systemet?').click()
    cy.contains('Ingen personoplysninger')
    cy.contains('Almindelige personoplysninger')
    cy.contains('Følsomme personoplysninger')
    cy.contains('Straffedomme og lovovertrædelser')
  })
})
