/// <reference types="Cypress" />

describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: 'it-system-usages.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });
    cy.intercept('/api/v2/it-system-usage-data-classification-types*', { fixture: 'classification-types.json' });
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: 'permissions.json' });
    cy.setup(true, 'it-systems/it-system-usages');
  });

  it('can show IT system usage grid', () => {
    cy.get('h3').should('have.text', 'IT systemer i Fælles Kommune');

    cy.contains('System 1');
    cy.contains('System 2');
    cy.contains('System 3');
  });

  it('can filter grid', () => {
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: 'it-system-usages.json' }).as('itSystemUsages');

    cy.contains('Søg på IT systemnavn').parent().find('input').type('System');

    cy.wait('@itSystemUsages').its('request.url').should('contain', 'contains(systemName,%27System%27)');

    cy.contains('Søg på Sidst ændret ID').parent().find('input').type('1');

    cy.wait('@itSystemUsages')
      .its('request.url')
      .should('contain', 'contains(systemName,%27System%27)%20and%20lastChangedById%20eq%201');
  });

  it('can show IT system usage details', () => {
    cy.contains('System 3').click();

    cy.contains('IT system information');
    cy.checkInput('Systemnavn', 'kaldenavn');
    cy.checkInput('Antal brugere', '>100');
    cy.checkInput('Klassifikation af data', 'Almindelige oplysninger');

    cy.contains('System anvendelse');
    cy.checkInput('Sidst redigeret (bruger)', 'Martin');
    cy.checkInput('Livscyklus', 'I drift');
    cy.checkInput('Ibrugtagningsdato', '10-05-2022');

    cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' });
    cy.intercept('/api/v2/business-types*', { fixture: 'business-types.json' });
    cy.intercept('/api/v2/kle-options', { fixture: 'kles.json' });

    cy.contains('Data fra IT Systemkataloget').click();

    cy.contains('Tilgængeligt');
    cy.checkInput('Systemnavn', 'System 3');
    cy.checkInput('Forretningstype', 'Selvbetjening og indberetning (STORM)');
    cy.checkInput('KLE ID', '83.01.02');
    cy.checkInput('KLE navn', 'IT-udstyr, anskaffelse');
  });

  it('can remove IT system usage', () => {
    cy.contains('System 3').click();

    cy.contains('Fjern anvendelse').click();

    cy.get('app-dialog').within(() => {
      cy.contains('Fortryd');
      cy.contains('Fjern anvendelse').click();
    });

    cy.contains('IT systemer i Fælles Kommune');
    cy.contains('IT System anvendelsen er slettet');

    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: 'permissions-no.json' });

    cy.contains('System 3').click();
    cy.contains('Fjern anvendelse').should('not.exist');
  });
});
