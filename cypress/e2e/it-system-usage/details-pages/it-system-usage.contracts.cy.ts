import { TestRunner } from 'cypress/support/test-runner';

function setupTest() {
  cy.requireIntercept();
  cy.setupItSystemUsageIntercepts();
  cy.setup(true, 'it-systems/it-system-usages');
}

describe('it-system-usage contracts', () => {
  it('Tests', () => {
    const testRunner = new TestRunner(setupTest);

    testRunner.runTestWithSetup('can show Contracts tab when no associated contracts', () => {
      cy.contains('System 3').click();

      cy.intercept('/api/v2/it-contract-contract-types*', { fixture: './shared/contract-types.json' });
      cy.intercept('/api/v2/it-contracts*', []);

      cy.navigateToDetailsSubPage('Kontrakter');

      cy.contains('Systemet er ikke omfattet af registreringer i modulet "IT Kontrakter"');
    });

    testRunner.runTestWithSetup('can show Contracts tab associated contracts and no main contract selected', () => {
      cy.intercept('/api/v2/it-system-usages/*', {
        fixture: './it-system-usage/it-system-usage-no-main-contract.json',
      });

      cy.contains('System 3').click();

      cy.intercept('/api/v2/it-contract-contract-types*', { fixture: './shared/contract-types.json' });
      cy.intercept('/api/v2/it-contracts*', { fixture: './it-contracts/it-contracts-by-it-system-usage-uuid.json' });

      cy.navigateToDetailsSubPage('Kontrakter');

      const expectedRows = [
        {
          name: 'The valid contract',
          valid: true,
          contractType: 'Tillægskontrakt',
          contractTypeObsoleted: false,
          supplier: 'Ballerup kommune',
          operation: 'Nej',
          validFrom: '28-02-2023',
          validTo: '09-04-2023',
          terminated: '10-06-2023',
        },
        {
          name: 'The invalid contract',
          valid: false,
          contractType: 'Expected obsoleted contract type',
          contractTypeObsoleted: true,
          supplier: 'Fælles Kommune',
          operation: 'Ja',
          validFrom: '02-01-2023',
          validTo: '27-02-2023',
        },
      ];

      cy.getCardWithTitle('Kontrakt der gør systemet aktivt').contains('Vælg kontrakt');

      cy.getCardWithTitle('Tilknyttede kontrakter').within(() => {
        for (const expectedRow of expectedRows) {
          const row = () => cy.getRowForElementContent(expectedRow.name);
          row().contains(expectedRow.name);
          row()
            .get(expectedRow.operation === 'Ja' ? 'app-check-positive-green-icon' : 'app-check-negative-gray-icon')
            .should('exist');
          row().contains(expectedRow.validFrom);
          row().contains(expectedRow.validTo);
          if (expectedRow.terminated) {
            row().contains(expectedRow.terminated);
          }
          row().contains(expectedRow.valid ? 'Gyldig' : 'Ikke gyldig');
          row().contains(expectedRow.contractType + (expectedRow.contractTypeObsoleted ? ' (udgået)' : ''));
        }
      });
    });

    testRunner.runTestWithSetup('can change selected contract', () => {
      cy.intercept('/api/v2/it-system-usages/*', {
        fixture: './it-system-usage/it-system-usage-no-main-contract.json',
      });
      cy.contains('System 3').click();

      cy.intercept('/api/v2/it-contract-contract-types*', { fixture: './shared/contract-types.json' });
      cy.intercept('/api/v2/it-contracts?*', { fixture: './it-contracts/it-contracts-by-it-system-usage-uuid.json' });

      cy.navigateToDetailsSubPage('Kontrakter');

      cy.getCardWithTitle('Kontrakt der gør systemet aktivt').within(() => {
        cy.contains('Vælg kontrakt');

        //Try the valid contract
        cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
          fixture: './it-system-usage/it-system-usage-valid-main-contract.json',
        });
        cy.dropdown('Vælg kontrakt', 'The valid contract', true);
        cy.contains('Gyldig');
        cy.contains('Ikke gyldig').should('not.exist');

        //Try the invalid contract
        cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
          fixture: './it-system-usage/it-system-usage-invalid-main-contract.json',
        });
        cy.dropdown('Vælg kontrakt', 'The invalid contract', true);
        cy.contains('Ikke gyldig');
      });
    });

    testRunner.runTestWithSetup('Can create and associate contract, if no associated contracts exist', () => {
      const usageUuid = '85cc6bd8-da66-4d4e-8e56-4dbc16e5c109'; //Comes from it-system-usage.json
      cy.contains('System 3').click();

      cy.intercept('/api/v2/it-contract-contract-types*', { fixture: './shared/contract-types.json' });
      cy.intercept('/api/v2/it-contracts*', []);

      cy.navigateToDetailsSubPage('Kontrakter');

      cy.getByDataCy('open-create-and-associate-contract-dialog-button').click();
      cy.getByDataCy('contract-name-input').type('New contract');

      cy.intercept('POST', '/api/v2/it-contracts', (req) => {
        expect(req.body).to.have.property('name', 'New contract');
        expect(req.body.systemUsageUuids).to.be.an('array').that.has.lengthOf(1);
        expect(req.body.systemUsageUuids[0]).to.equal(usageUuid);
      });

      cy.intercept('/api/v2/it-contracts*', {
        fixture: './it-contracts/it-contracts-with-newly-associated-contract.json',
      }).as('getContracts');

      cy.getByDataCy('create-and-associate-contract-button').click();

      cy.wait('@getContracts');
      cy.contains('New contract');

      cy.get('app-popup-message').should('exist');
    });

    testRunner.runTestWithSetup('Can create and associate contract, if associated contracts exist', () => {
      cy.contains('System 3').click();

      cy.intercept('/api/v2/it-contract-contract-types*', { fixture: './shared/contract-types.json' });
      cy.intercept('/api/v2/it-contracts*', { fixture: './it-contracts/it-contracts-by-it-system-usage-uuid.json' });

      cy.navigateToDetailsSubPage('Kontrakter');

      cy.getByDataCy('open-create-and-associate-contract-dialog-button').should('exist');
    });

    testRunner.runTestWithSetup('Can not create and associate contract, if no permission to create contract', () => {
      cy.contains('System 3').click();

      cy.intercept('/api/v2/it-contract-contract-types*', { fixture: './shared/contract-types.json' });
      cy.intercept('/api/v2/it-contracts*', []);

      cy.intercept('GET', '/api/v2/it-contracts/permissions*', { body: { create: false } });

      cy.navigateToDetailsSubPage('Kontrakter');

      cy.getByDataCy('open-create-and-associate-contract-dialog-button').should('not.exist');
    });

    testRunner.runTestWithSetup('Can not create and associate contract, if name is empty or already exists', () => {
      cy.contains('System 3').click();

      cy.intercept('/api/v2/it-contract-contract-types*', { fixture: './shared/contract-types.json' });
      cy.intercept('/api/v2/it-contracts*', []);

      cy.navigateToDetailsSubPage('Kontrakter');

      cy.getByDataCy('open-create-and-associate-contract-dialog-button').click();
      cy.getByDataCy('create-and-associate-contract-button').find('button').should('be.disabled'); //Disabled because name is empty

      cy.intercept('/api/v2/it-contracts?nameEquals=*', [{ name: 'Existing contract' }]);

      cy.getByDataCy('contract-name-input').type('invalid-name');
      cy.getByDataCy('create-and-associate-contract-button').find('button').should('be.disabled'); //Disabled because name is invalid
    });
  });
});
