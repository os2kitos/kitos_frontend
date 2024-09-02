/// <reference types="Cypress" />

describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: './it-system-usage/it-system-usages.json' });
    cy.intercept('/api/v1/itsystem-usage/options/overview/organizationUuid*', {
      fixture: './it-system-usage/options.json',
    });
    cy.intercept('/api/v2/organizations/*/organization-units?pageSize=*', {
      fixture: './organizations/organization-units-hierarchy.json',
    });
    cy.intercept('/api/v2/business-types*', { fixture: './shared/business-types.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });
    cy.intercept('/api/v2/it-system-usage-data-classification-types*', {
      fixture: './it-system-usage/classification-types.json',
    });
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: './shared/permissions.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' }); //gets the base system
    cy.intercept('/api/v2/internal/organizations/*/grid-configuration/ItSystemUsage/get', {statusCode: 404, body: {}});
    cy.setup(true, 'it-systems/it-system-usages');
  });

  function getKleRow(kleNumber: string) {
    return cy.contains(kleNumber).parentsUntil('tr').parent();
  }

  function verifyKle(kleNumber: string, name: string) {
    getKleRow(kleNumber).contains(name);
  }

  it('can show IT system usage details', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });
    cy.contains('System 3').click();

    cy.contains('Systeminformation');
    cy.input('Systemnavn').should('have.value', 'kaldenavn');
    cy.dropdown('Antal brugere').should('have.text', '>100');
    cy.dropdown('Klassifikation af data').should('have.text', 'Almindelige oplysninger');
    cy.contains('Informationer, hvor offentliggørelse er naturlig eller ikke ');

    cy.contains('Systemanvendelse');
    cy.input('Sidst redigeret (bruger)').should('have.value', 'Martin');
    cy.dropdown('Livscyklus').should('have.text', 'I drift');
    cy.input('Ibrugtagningsdato').should('have.value', '10-05-2022');

    cy.intercept('/api/v2/business-types*', { fixture: './shared/business-types.json' });
    cy.intercept('/api/v2/kle-options', { fixture: './shared/kles.json' });

    cy.contains('Data fra IT Systemkataloget').click();

    cy.contains('Ikke tilgængeligt');

    // Test parent system deactivated
    cy.input('Overordnet system').should('have.value', 'System 3 (ikke tilgængeligt)');

    // Test obselete option
    cy.dropdown('Forretningstype').should('have.text', 'Test (udgået)');

    cy.contains('Tilknyttede opgaver')
      .parentsUntil('app-card')
      .parent()
      .within(() => {
        verifyKle('83.01.02', 'IT-udstyr, anskaffelse');
      });
  });

  it('can refresh page on IT system usage details', () => {
    cy.contains('System 3').click();

    cy.contains('Systeminformation');
    cy.input('Systemnavn').should('have.value', 'kaldenavn');

    cy.reload(true);

    cy.contains('Systeminformation');
    cy.input('Systemnavn').should('have.value', 'kaldenavn');
  });

  it('redirects if missing read permission', () => {
    cy.intercept('/api/v2/it-system-usages/*/permissions', { read: false, modify: false, delete: false });

    cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');
    cy.contains('System 3').click();

    cy.contains('Du har ikke læseadgang til dette IT System');
    cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');

    // Also works if IT System Usage returns forbidden
    cy.intercept('/api/v2/it-system-usages/*', { statusCode: 403 });

    cy.contains('System 3').click();

    cy.contains('Du har ikke læseadgang til dette IT System');
    cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');
  });

  it('redirects if ressource is missing', () => {
    cy.intercept('/api/v2/it-system-usages/*', { statusCode: 404 });

    cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');
    cy.contains('System 3').click();

    cy.contains('IT System findes ikke');
    cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');
  });

  it('can remove IT system usage', () => {
    cy.contains('System 3').click();

    cy.contains('Fjern anvendelse').click();

    cy.get('app-dialog').within(() => {
      cy.contains('Fortryd');
      cy.contains('Fjern anvendelse').click();
    });

    cy.contains('IT Systemer i Fælles Kommune');
    cy.contains('Systemanvendelsen er slettet');
  });

  it('hides and disables input for IT system usage when user does not have rights', () => {
    cy.intercept('/api/v2/it-system-usages/*/permissions', { read: true, modify: false, delete: false });

    cy.contains('System 3').click();
    cy.contains('Fjern anvendelse').should('not.exist');

    cy.input('Systemnavn (lokalt)').should('be.disabled');
    cy.input('Livscyklus').should('be.disabled');
  });

  it('can modify IT system usage', () => {
    cy.contains('System 3').click();

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' }).as(
      'patch1'
    );

    cy.input('Systemnavn (lokalt)').clear().type('TEST');
    cy.input('Systemnavn ID').click();
    cy.wait('@patch1')
      .its('request.body')
      .should('deep.eq', { general: { localCallName: 'TEST' } });

    cy.contains('Feltet er opdateret');

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' }).as(
      'patch2'
    );
    cy.dropdown('Antal brugere', '50-100');
    cy.wait('@patch2')
      .its('request.body')
      .should('deep.eq', { general: { numberOfExpectedUsers: { lowerBound: 50, upperBound: 100 } } });

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' }).as(
      'patch3'
    );
    cy.dropdown('Livscyklus', 'Ikke i drift');
    cy.wait('@patch3')
      .its('request.body')
      .should('deep.eq', { general: { validity: { lifeCycleStatus: 'NotInUse' } } });

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' }).as(
      'patch4'
    );
    cy.input('Ibrugtagningsdato').clear().type('31052022');
    cy.input('Systemnavn ID').click({ force: true });
    cy.wait('@patch4')
      .its('request.body')
      .should('deep.eq', { general: { validity: { validFrom: 'Tue May 31 2022' } } });

    cy.contains('Feltet er opdateret');
  });

  it('does not override focused form fields', () => {
    cy.contains('System 3').click();

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/it-system-usage.json',
      delay: 500,
    }).as('patch');

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

    cy.input('Slutdato for anvendelse').clear().type('01012000');
    cy.input('Systemnavn ID').click();
    cy.contains('"Slutdato for anvendelse" er ugyldig');
  });
});
