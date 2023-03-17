/// <reference types="Cypress" />

interface ItInterfaceResponse {
  name: string;
  deactivated: boolean;
  description: string;
  itInterfaceType: {
    name: string
  };
  urlReference: string
}

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

  it('can show DPR tab when no associated dprs', () => {
    cy.contains('System 3').click();

    cy.intercept('/api/v2/data-processing-registrations*', { fixture: 'empty-json-array-result.json' });

    cy.navigateToDetailsSubPage('Databehandling');

    cy.contains('Systemet er ikke omfattet af registreringer i modulet "Databehandling"');
  });

  it('can show DPR with two, known associated dprs', () => {
    cy.contains('System 3').click();

    cy.intercept('/api/v2/data-processing-registrations*', { fixture: 'data-processing-registrations.json' });

    cy.navigateToDetailsSubPage('Databehandling');

    cy.contains('Systemet er omfattet af følgende registreringer i modulet "Databehandling"');

    const expectedRows: Array<{ name: string; valid: boolean }> = [
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

  it('can show interfaces when no associated interfaces', () => {
    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-interfaces*', { fixture: 'empty-json-array-result.json'});

    cy.navigateToDetailsSubPage("Udstillede snitflader");

    cy.contains('No interfaces found //TODO: Change paragraph text');
  });

  it('can show interfaces with 2 associated interfaces', () => {
    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-interfaces*', { fixture: 'it-interfaces.json'});

    cy.navigateToDetailsSubPage("Udstillede snitflader");

    const expectedRows: Array<ItInterfaceResponse> = [
      {
        name: "Interface 1 - INACTIVE",
        deactivated: false,
        description: "Test description 1",
        itInterfaceType: {
          name: "InterfaceType1"
        },
        urlReference: "www.kitos.dk"
      },
      {
        name: "Interface 2 - ACTIVE",
        deactivated: true,
        description: "Test description 2",
        itInterfaceType: {
          name: "InterfaceType2"
        },
        urlReference: "www.google.com"
      },
    ];

    cy.get('tr').should('have.length', expectedRows.length);
    expectedRows.forEach((row) => {
      const rowElement = cy.contains(row.name);
      rowElement
        .parentsUntil('tr')
        .parent()
        .contains(row.deactivated ? 'Ikke aktiv' : 'Aktiv')
        .parentsUntil('tr')
        .parent()
        .contains(row.itInterfaceType.name)
        .parent()
        .contains(row.description)
        .parent()
        .contains(row.urlReference);
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
