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
    cy.input('Systemnavn').should('have.value', 'kaldenavn');
    cy.input('Antal brugere').should('have.value', '>100');
    cy.input('Klassifikation af data').should('have.value', 'Almindelige oplysninger');
    cy.contains('Informationer, hvor offentliggørelse er naturlig eller ikke ');

    cy.contains('System anvendelse');
    cy.input('Sidst redigeret (bruger)').should('have.value', 'Martin');
    cy.input('Livscyklus').should('have.value', 'I drift');
    cy.input('Ibrugtagningsdato').should('have.value', '10-05-2022');

    cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' });
    cy.intercept('/api/v2/business-types*', { fixture: 'business-types.json' });
    cy.intercept('/api/v2/kle-options', { fixture: 'kles.json' });

    cy.contains('Data fra IT Systemkataloget').click();

    cy.contains('Ikke tilgængeligt');

    // Test parent system deactivated
    cy.input('Overordnet system').should('have.value', 'System 3 (ikke tilgængeligt)');

    // Test obselete option
    cy.input('Forretningstype').should('have.value', 'Test (udgået)');

    cy.input('KLE ID').should('have.value', '83.01.02');
    cy.input('KLE navn').should('have.value', 'IT-udstyr, anskaffelse');
  });

  it('can refresh page on IT system usage details', () => {
    cy.contains('System 3').click();

    cy.contains('IT system information');
    cy.input('Systemnavn').should('have.value', 'kaldenavn');

    cy.reload(true);

    cy.contains('IT system information');
    cy.input('Systemnavn').should('have.value', 'kaldenavn');
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
  });

  it('hides and disables input for IT system usage when user does not have rights', () => {
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: 'permissions-no.json' });

    cy.contains('System 3').click();
    cy.contains('Fjern anvendelse').should('not.exist');

    cy.input('Systemnavn (lokalt)').should('be.disabled');
    cy.input('Livscyklus').should('be.disabled');
  });

  it('can modify IT system usage', () => {
    cy.contains('System 3').click();

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' }).as('patch');

    cy.input('Systemnavn (lokalt)').clear().type('TEST');
    cy.input('Systemnavn ID').click();
    cy.wait('@patch')
      .its('request.body')
      .should('deep.eq', { general: { localCallName: 'TEST' } });

    cy.contains('Feltet er opdateret');

    cy.dropdown('Antal brugere', '50-100');
    cy.wait('@patch')
      .its('request.body')
      .should('deep.eq', { general: { numberOfExpectedUsers: { lowerBound: 50, upperBound: 100 } } });

    cy.dropdown('Livscyklus', 'Ikke i drift');
    cy.wait('@patch')
      .its('request.body')
      .should('deep.eq', { general: { validity: { lifeCycleStatus: 'NotInUse' } } });

    cy.clock().then((clock) => {
      clock.setSystemTime(new Date('10/10/2022'));
    });

    cy.dropdown('Ibrugtagningsdato', '30');
    cy.input('Systemnavn ID').click();
    cy.wait('@patch')
      .its('request.body')
      .should('deep.eq', { general: { validity: { validFrom: 'Mon May 30 2022' } } });

    cy.input('Ibrugtagningsdato').type('10052022');
    cy.input('Systemnavn ID').click();
    cy.wait('@patch')
      .its('request.body')
      .should('deep.eq', { general: { validity: { validFrom: 'Tue May 10 2022' } } });

    cy.contains('Feltet er opdateret');
  });

  it('does not override focused form fields', () => {
    cy.contains('System 3').click();

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json', delay: 500 }).as('patch');

    cy.input('Systemnavn (lokalt)').clear().type('TEST');
    cy.input('Systemnavn ID').clear().type('123');
    cy.wait('@patch');

    cy.contains('Feltet er opdateret');

    cy.input('Systemnavn ID').type('456');
    cy.input('Version').click();
    cy.wait('@patch')
      .its('request.body')
      .should('deep.eq', { general: { localSystemId: '123456' } });
  });

  it('shows error on invalid form', () => {
    cy.contains('System 3').click();

    cy.input('Slutdato for anvendelse').type('01012000');
    cy.input('Systemnavn ID').click();
    cy.contains('"Slutdato for anvendelse" er ugyldig');
  });

  it('can show DPR tab when no associated dprs', () => {
    cy.contains('System 3').click();

    cy.intercept('/api/v2/data-processing-registrations*', []);

    cy.navigateToDetailsSubPage('Databehandling');

    cy.contains('Systemet er ikke omfattet af registreringer i modulet "Databehandling"');
  });

  it('can show DPR with two, known associated dprs', () => {
    cy.contains('System 3').click();

    cy.intercept('/api/v2/data-processing-registrations*', { fixture: 'data-processing-registrations.json' });

    cy.navigateToDetailsSubPage('Databehandling');

    cy.contains('Systemet er omfattet af følgende registreringer i modulet "Databehandling"');

    const expectedRows = [
      {
        name: 'DPA 1 - INVALID',
        valid: false,
      },
      {
        name: 'DPA 2 - VALID',
        valid: true,
      },
    ];

    cy.get('tr').should('have.length', expectedRows.length);
    expectedRows.forEach((row) => {
      const rowElement = cy.contains(row.name);
      rowElement
        .parentsUntil('tr')
        .parent()
        .contains(row.valid ? 'Aktiv' : 'Ikke aktiv');
    });
  });

  it('shows help text dialog', () => {
    cy.intercept('/odata/HelpTexts*', { fixture: 'help-text.json' });

    cy.contains('System 3').click();

    cy.get('[data-cy="help-button"]').first().click();
    cy.contains('IT-systemforsiden finder du');
    cy.get('.close-button').click();

    cy.intercept('/odata/HelpTexts*', { value: [] });

    cy.get('[data-cy="help-button"]').first().click();
    cy.contains('Ingen hjælpetekst defineret');
  });
});
