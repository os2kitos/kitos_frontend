/// <reference types="cypress" />

const generalInformation = 'Systeminformation';

describe('it-system-usage frontpage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupItSystemUsageIntercepts();
    cy.setup(true, 'it-systems/it-system-usages');
  });

  function getKleRow(kleNumber: string) {
    return cy.contains(kleNumber).parentsUntil('tr').parent();
  }

  function verifyKle(kleNumber: string, name: string) {
    getKleRow(kleNumber).contains(name);
  }

  it('shows technical system type descriptions, including saved selections loaded before the options', () => {
    cy.intercept('GET', '/api/v2/it-system-usage-technical-system-types*', {
      delay: 500,
      body: [
        {
          uuid: '1a2b3c4d-0001-0001-0001-000000000001',
          name: 'Fagsystem',
          description: 'Description of Fagsystem',
        },
        {
          uuid: '1a2b3c4d-0001-0001-0001-000000000002',
          name: 'Infrastruktur',
          description: 'Description of Infrastruktur',
        },
      ],
    }).as('technicalTypes');
    cy.contains('System 3').click();
    cy.wait('@technicalTypes');
    cy.contains('app-multi-select-dropdown', 'Tekniske systemtyper').within(() => {
      cy.get('app-textbox-info').should('contain.text', 'Description of Fagsystem');
      cy.get('.ng-select-container').click();
      cy.get('.ng-option').should('contain.text', 'Description of Infrastruktur');
    });
  });

  it('preserves newer technical system type selections when earlier PATCH responses arrive', () => {
    const options = ['A', 'B', 'C', 'D'].map((name, index) => ({
      uuid: `1a2b3c4d-0001-0001-0001-00000000000${index + 1}`,
      name,
      description: `Description of ${name}`,
    }));
    const releaseResponses: (() => void)[] = [];
    const dropdown = () => cy.contains('app-multi-select-dropdown', 'Tekniske systemtyper');
    const expectSelectedNames = (...names: string[]) =>
      dropdown().find('.ng-value-label').should(($labels) => {
        expect([...$labels].map((label) => label.textContent?.replace(/[,\s]+$/, ''))).to.deep.eq(names);
      });

    cy.fixture('it-system-usage/it-system-usage.json').then((usage) => {
      cy.intercept('GET', '/api/v2/it-system-usage-technical-system-types*', { body: options });
      cy.intercept('GET', '/api/v2/it-system-usages/*', {
        body: { ...usage, general: { ...usage.general, technicalSystemTypes: [options[0]] } },
      });
      cy.intercept('PATCH', '/api/v2/it-system-usages/*', (req) => {
        const ids: string[] = req.body.general.technicalSystemTypeUuids;
        req.alias = `technicalPatch${releaseResponses.length + 1}`;
        return new Cypress.Promise<void>((resolve) => {
          releaseResponses.push(() => {
            req.reply({
              body: {
                ...usage,
                general: {
                  ...usage.general,
                  technicalSystemTypes: options.filter((option) => ids.includes(option.uuid)),
                },
              },
            });
            resolve();
          });
        });
      });
    });

    cy.contains('System 3').click();
    expectSelectedNames('A');
    dropdown().find('.ng-select-container').click();
    dropdown().find('.ng-option').contains('Description of B').click();
    cy.wrap(releaseResponses).should('have.length', 1);
    dropdown().find('.ng-option').contains('Description of C').click();
    cy.wrap(releaseResponses).should('have.length', 2);
    expectSelectedNames('A', 'B', 'C');

    cy.then(() => releaseResponses[0]());
    cy.wait('@technicalPatch1').its('request.body.general.technicalSystemTypeUuids')
      .should('deep.eq', options.slice(0, 2).map((option) => option.uuid));
    expectSelectedNames('A', 'B', 'C');
    dropdown().find('app-textbox-info').should('contain.text', 'Description of C');

    dropdown().find('.ng-option').contains('Description of D').click();
    cy.wrap(releaseResponses).should('have.length', 3);
    cy.then(() => releaseResponses[2]());
    cy.wait('@technicalPatch3').its('request.body.general.technicalSystemTypeUuids')
      .should('deep.eq', options.map((option) => option.uuid));
    expectSelectedNames('A', 'B', 'C', 'D');

    cy.then(() => releaseResponses[1]());
    cy.wait('@technicalPatch2');
    expectSelectedNames('A', 'B', 'C', 'D');
    dropdown().find('app-textbox-info').should('contain.text', 'Description of D');
  });

  it('can edit business critical status', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });
    cy.contains('System 3').click();

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' }).as(
      'patchRequest',
    );

    cy.dropdown('Forretningskritisk IT-system', 'Nej', true);

    cy.wait('@patchRequest')
      .its('request.body')
      .should('deep.eq', {
        general: { isBusinessCritical: 'No' },
      });
  });

  it('can show IT system usage details', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });
    cy.contains('System 3').click();

    cy.contains('Systeminformation');
    cy.input('Systemnavn').should('have.value', 'kaldenavn');
    cy.dropdown('Antal brugere').should('have.text', '100-499');
    cy.dropdown('Klassifikation af data').should('have.text', 'Almindelige oplysninger');
    cy.contains('Informationer, hvor offentliggørelse er naturlig eller ikke ');
    cy.dropdown('Tekniske systemtyper').should('have.text', 'Fagsystem');

    cy.contains('Systemanvendelse');
    cy.input('Sidst redigeret (bruger)').should('have.value', 'Martin');
    cy.dropdown('Livscyklus').should('have.text', 'I drift');
    cy.input('Ibrugtagningsdato').should('have.value', '10-05-2022');

    cy.intercept('/api/v2/business-types*', { fixture: './shared/business-types.json' });
    cy.intercept('/api/v2/kle-options', { fixture: './shared/kles.json' });

    cy.getByDataCy('web-accessibility-compliance').within(() => cy.contains('Ja'));
    cy.inputByCy('last-web-accessibility-check').should('have.value', '27-02-2025');
    cy.textareaByCy('web-accessibility-notes').should('have.value', 'en note om tilgængelighed');

    cy.dropdown('Forretningskritisk IT-system').should('have.text', 'Ja');
    cy.dropdown('IT-systemet driftes').should('have.text', 'On-premise');

    cy.contains('Data fra IT Systemkataloget').click();

    cy.contains('Ikke tilgængeligt');

    // Test parent system deactivated
    cy.input('Overordnet system').should('have.value', 'System 3 (ikke tilgængeligt)');
    cy.getByDataCy('legal-name').find('input').should('have.value', 'DBS navn 123');
    cy.getByDataCy('legal-data-processor-name').find('input').should('have.value', 'DBS databehandler navn 123');

    // Test obselete option
    cy.dropdown('Forretningstype').should('have.text', 'Test (udgået)');

    cy.contains('Tilknyttede opgaver')
      .parentsUntil('app-card')
      .parent()
      .within(() => {
        verifyKle('83.01.02', 'IT-udstyr, anskaffelse');
      });

    cy.reload(true);

    cy.contains('Systeminformation');
    cy.input('Systemnavn').should('have.value', 'kaldenavn');
  });

  it('can edit hosted at status', () => {
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/it-system-usage-updated.json',
    }).as('patch');
    cy.contains('System 3').click();

    const newHostedAt = 'Eksternt';
    cy.dropdown('IT-systemet driftes', newHostedAt, true);
    cy.contains(generalInformation).click();

    cy.wait('@patch')
      .its('request.body')
      .should('deep.eq', { general: { hostedAt: 'External' } });
    cy.dropdown('IT-systemet driftes').should('have.text', newHostedAt);
  });

  it('redirects if missing read permission', () => {
    cy.intercept('/api/v2/it-system-usages/*/permissions', { read: false, modify: false, delete: false });

    cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');
    cy.contains('System 3').click();

    cy.contains('Du har ikke læseadgang til dette IT System');
    cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');
  });

  it('returns to the overview if the usage request is forbidden', () => {
    cy.intercept(
      { method: 'GET', pathname: /^\/api\/v2\/it-system-usages\/[^/]+$/ },
      { statusCode: 403 },
    ).as('forbiddenUsage');

    cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');
    cy.contains('System 3').click();

    cy.wait('@forbiddenUsage').its('response.statusCode').should('eq', 403);
    cy.contains('IT System findes ikke');
    cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');
  });

  it('redirects if ressource is missing', () => {
    cy.intercept(
      { method: 'GET', pathname: /^\/api\/v2\/it-system-usages\/[^/]+$/ },
      { statusCode: 404 },
    ).as('missingUsage');

    cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');
    cy.contains('System 3').click();

    cy.wait('@missingUsage').its('response.statusCode').should('eq', 404);
    cy.contains('IT System findes ikke');
    cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');
  });

  it('can remove IT system usage', () => {
    cy.contains('System 3').click();

    cy.intercept('DELETE', '/api/v2/it-system-usages/*', { statusCode: 200, body: {} }).as('deleteUsage');

    cy.contains('Fjern anvendelse').click();

    cy.get('app-dialog').within(() => {
      cy.contains('Fortryd');
      cy.get('app-dialog-actions').contains('Bekræft').click();
    });

    cy.wait('@deleteUsage');

    cy.contains('Systemanvendelsen blev slettet');
    cy.contains('IT Systemer i Fælles Kommune');
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
      'patch1',
    );

    cy.input('Systemnavn (lokalt)').clear().type('TEST');
    cy.input('Systemnavn ID').click();
    cy.wait('@patch1')
      .its('request.body')
      .should('deep.eq', { general: { localCallName: 'TEST' } });

    cy.contains('Feltet blev opdateret');

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' }).as(
      'patch2',
    );
    cy.dropdown('Antal brugere', '50-99');
    cy.wait('@patch2')
      .its('request.body')
      .should('deep.eq', { general: { numberOfExpectedUsers: { lowerBound: 50, upperBound: 99 } } });

    expectGeneralPropertyUpdate(
      { technicalSystemTypeUuids: ['1a2b3c4d-0001-0001-0001-000000000001', '1a2b3c4d-0001-0001-0001-000000000002'] },
      () => cy.dropdown('Tekniske systemtyper', 'Infrastruktur', true),
    );

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' }).as(
      'patch3',
    );
    cy.dropdown('Livscyklus', 'Ikke i drift');
    cy.wait('@patch3')
      .its('request.body')
      .should('deep.eq', { general: { validity: { lifeCycleStatus: 'NotInUse' } } });

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' }).as(
      'patch4',
    );
    cy.input('Ibrugtagningsdato').clear().type('31052022');
    cy.input('Systemnavn ID').click({ force: true });
    cy.wait('@patch4')
      .its('request.body')
      .should('deep.eq', { general: { validity: { validFrom: 'Tue May 31 2022' } } });

    cy.contains('Feltet blev opdateret');

    expectGeneralPropertyUpdate({ webAccessibilityCompliance: 'No' }, () =>
      cy.dropdownByCy('web-accessibility-compliance', 'Nej', true),
    );
    expectGeneralPropertyUpdate({ lastWebAccessibilityCheck: 'Thu Mar 27 2025' }, () =>
      cy.inputByCy('last-web-accessibility-check').clear().type('27032025').blur(),
    );
    expectGeneralPropertyUpdate({ webAccessibilityNotes: 'ny note' }, () =>
      cy.textareaByCy('web-accessibility-notes').clear().type('ny note').blur(),
    );
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

    cy.contains('Feltet blev opdateret');

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

function expectGeneralPropertyUpdate(generalBody: object, initiator: () => void) {
  const randomPatchName = Math.random().toString(36).substring(7);
  cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' }).as(
    randomPatchName,
  );

  initiator();

  cy.wait('@' + randomPatchName)
    .its('request.body')
    .should('deep.eq', {
      general: generalBody,
    });
}
