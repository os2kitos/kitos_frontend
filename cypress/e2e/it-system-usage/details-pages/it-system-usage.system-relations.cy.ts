/// <reference types="cypress" />

interface RelationRow {
  systemUsageName: string;
  relationInterfaceName: string;
  systemRelationDirectionName?: string;
  associatedContractName: string;
  relationFrequencyName: string;
  isFrequencyObsolete: boolean;
  description: string;
  expectedValidUrlReference?: string;
  expectedInvalidUrlReference?: string;
}

describe('it-system-usage system-relations', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupItSystemUsageIntercepts();
    cy.setup(true, 'it-systems/it-system-usages');
  });

  it('can show empty Relations', () => {
    cy.intercept('/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/relations/it-system-usage-no-relations.json',
    });

    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-system-usages/*/incoming-system-relations', []);
    cy.intercept('/api/v2/*it-system-usage-relation-frequency-types*', []);

    cy.navigateToDetailsSubPage('Relationer');

    cy.getCardWithTitle("'System 3' har følgende relationer til andre systemer/snitflader").within(() => {
      cy.contains("Endnu ingen relationer tilføjet fra 'System 3' til andre systemer/snitflader");
      cy.contains('Opret relation');
    });

    cy.getByDataCy('incoming-relations-segment-button').click();

    cy.getCardWithTitle("Andre systemer har følgende relationer til 'System 3'").within(() => {
      cy.contains("Ingen relationer fra andre systemer til 'System 3' fundet");
    });
  });

  it('can show Relations', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });

    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-system-usages/*/incoming-system-relations', {
      fixture: './it-system-usage/relations/it-system-usage-incoming-relations.json',
    });
    cy.intercept('/api/v2/*it-system-usage-relation-frequency-types*', {
      fixture: './it-system-usage/relations/relation-frequency-types.json',
    });

    cy.navigateToDetailsSubPage('Relationer');

    const expectedOutgoingRows = [
      {
        systemUsageName: 'Aplanner',
        relationInterfaceName: 'Lorem ipsum',
        systemRelationDirectionName: 'Udgående data',
        associatedContractName: 'Dolor sit',
        relationFrequencyName: 'Kvartal',
        isFrequencyObsolete: false,
        description: 'Sed at nibh ac tellus tempor dignissim quis id urna',
        expectedValidUrlReference: 'https://www.google.com',
      },
      {
        systemUsageName: 'Vestibulum',
        relationInterfaceName: 'Quisque nec',
        systemRelationDirectionName: 'Bidirektionel',
        associatedContractName: 'erat volutpat',
        relationFrequencyName: 'Kvartal2',
        isFrequencyObsolete: true,
        description:
          'Nulla non quam rhoncus lacus ultricies interdum ac ut dui. Duis quis egestas arcu. Integer ultrices turpis nec felis lobortis, in pretium erat lobortis',
        expectedInvalidUrlReference: 'www.google.com',
      },
    ];

    const expectedIncomingRows = [
      {
        systemUsageName: 'testUsage',
        relationInterfaceName: 'testInterface',
        systemRelationDirectionName: 'Indgående data',
        associatedContractName: 'DefaultTestItContract',
        relationFrequencyName: 'Kvartal',
        isFrequencyObsolete: false,
        description: 'test description',
        expectedValidUrlReference: 'https://www.google.com',
      },
      {
        systemUsageName: 'testUsage2',
        relationInterfaceName: 'testInterface2',
        associatedContractName: 'DefaultTestItContract2',
        relationFrequencyName: 'Kvartal2',
        isFrequencyObsolete: true,
        description: 'test description2',
        expectedInvalidUrlReference: 'www.google.com',
      },
    ];

    verifyRelationTable('System 3', expectedOutgoingRows, true);

    cy.getByDataCy('incoming-relations-segment-button').click();

    verifyRelationTable('System 3', expectedIncomingRows, false);
  });

  it('can add Relation', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });

    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-system-usages/*/incoming-system-relations', []);
    cy.intercept('/api/v2/*it-system-usage-relation-frequency-types*', {
      fixture: './it-system-usage/relations/relation-frequency-types.json',
    });

    cy.navigateToDetailsSubPage('Relationer');

    cy.intercept('/api/v2/internal/it-system-usages/search?organizationUuid*', {
      fixture: './it-system-usage/it-system-usages-internal.json',
    });
    cy.intercept('/api/v2/*it-contracts*', { fixture: './it-contracts/it-contracts-by-it-system-usage-uuid.json' });
    cy.intercept('/api/v2/*it-interfaces*', { fixture: './it-interfaces/it-interfaces.json' });

    cy.contains('Opret relation').click();

    cy.get('app-system-relation-dialog').within(() => {
      cy.dropdown('Søg efter system', 'System 1', true);
      cy.dropdown('Søg efter snitflade', 'Interface 1 - ACTIVE', true);
      cy.dropdown('Søg efter snitflade', 'Interface 2 - INACTIVE', true);
      cy.dropdown('Dataretning', 'Udgående data', true);
      cy.contains('Reference').type('test');
      cy.contains('Beskrivelse').type('test');
      cy.dropdown('Søg efter kontrakt', 'The valid contract', true);
      cy.dropdown('Vælg frekvens', 'Ugentligt', true);

      cy.intercept('POST', '**system-relations', {}).as('createRelations');
      cy.contains('Tilføj').click();
    });
    cy.wait('@createRelations').its('request.body').should((requests) => {
      expect(requests).to.have.length(2);
      for (const request of requests) {
        expect(request.systemRelationDirection).to.equal('OutgoingData');
        expect(request.relationInterfaceUuid).to.be.a('string');
      }
    });
    cy.contains('Relationer tilføjet');
  });

  for (const direction of [
    { name: 'Indgående data', value: 'IncomingData' },
    { name: 'Bidirektionel', value: 'BidirectionalData' },
    { name: undefined, value: undefined },
  ]) {
    it(`can add Relation without an interface and direction ${direction.value ?? 'unset'}`, () => {
      cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });
      cy.contains('System 3').click();
      cy.intercept('/api/v2/it-system-usages/*/incoming-system-relations', []);
      cy.intercept('/api/v2/*it-system-usage-relation-frequency-types*', []);
      cy.navigateToDetailsSubPage('Relationer');
      cy.intercept('/api/v2/internal/it-system-usages/search?organizationUuid*', {
        fixture: './it-system-usage/it-system-usages-internal.json',
      });
      cy.intercept('/api/v2/*it-contracts*', []);
      cy.intercept('/api/v2/*it-interfaces*', []);
      cy.intercept('POST', '**system-relations', {}).as('createRelations');

      cy.contains('Opret relation').click();
      cy.get('app-system-relation-dialog').within(() => {
        cy.dropdown('Søg efter system', 'System 1', true);
        if (direction.name) {
          cy.dropdown('Dataretning', direction.name, true);
        }
        cy.contains('Tilføj').click();
      });
      cy.wait('@createRelations').its('request.body').should((requests) => {
        expect(requests).to.have.length(1);
        expect(requests[0].systemRelationDirection).to.equal(direction.value);
        expect(requests[0]).not.to.have.property('relationInterfaceUuid');
      });
      cy.contains('Relationer tilføjet');
    });
  }

  it('can modify Relation', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });

    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-system-usages/*/incoming-system-relations', []);
    cy.intercept('/api/v2/*it-system-usage-relation-frequency-types*', {
      fixture: './it-system-usage/relations/relation-frequency-types.json',
    });

    cy.navigateToDetailsSubPage('Relationer');

    cy.intercept('/api/v2/internal/it-system-usages/search?organizationUuid*', {
      fixture: './it-system-usage/it-system-usages-internal.json',
    });
    cy.intercept('/api/v2/*it-contracts*', { fixture: './it-contracts/it-contracts-by-it-system-usage-uuid.json' });
    cy.intercept('/api/v2/*it-interfaces*', { fixture: './it-interfaces/it-interfaces.json' });

    cy.getRowForElementContent('Aplanner').get('app-pencil-icon').first().click({ force: true });

    cy.get('app-system-relation-dialog').within(() => {
      cy.get('app-dropdown[formName="systemRelationDirection"]').should('contain', 'Udgående data');
      cy.dropdown('Søg efter system', 'System 1', true);
      cy.dropdown('Søg efter snitflade', 'Interface 1 - ACTIVE', true);
      cy.dropdown('Dataretning', 'Bidirektionel', true);
      cy.contains('Beskrivelse').type('test');
      cy.contains('Reference').type('test');
      cy.dropdown('Søg efter kontrakt', 'The valid contract', true);
      cy.dropdown('Vælg frekvens', 'Ugentligt', true);

      cy.intercept('PUT', '**/system-relations/*', {}).as('modifyRelation');
      cy.contains('Gem').click();
    });
    cy.wait('@modifyRelation').its('request.body.systemRelationDirection').should('equal', 'BidirectionalData');
    cy.contains('Relation ændret');
  });

  for (const clearDirection of [false, true]) {
    it(`can ${clearDirection ? 'clear' : 'preserve'} the direction when editing a Relation`, () => {
      cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });
      cy.contains('System 3').click();
      cy.intercept('/api/v2/it-system-usages/*/incoming-system-relations', []);
      cy.intercept('/api/v2/*it-system-usage-relation-frequency-types*', {
        fixture: './it-system-usage/relations/relation-frequency-types.json',
      });
      cy.navigateToDetailsSubPage('Relationer');
      cy.intercept('/api/v2/internal/it-system-usages/search?organizationUuid*', {
        fixture: './it-system-usage/it-system-usages-internal.json',
      });
      cy.intercept('/api/v2/*it-contracts*', []);
      cy.intercept('/api/v2/*it-interfaces*', []);
      cy.intercept('PUT', '**/system-relations/*', {}).as('modifyRelation');
      cy.getRowForElementContent('Aplanner').get('app-pencil-icon').first().click({ force: true });

      cy.get('app-system-relation-dialog').within(() => {
        cy.get('app-dropdown[formName="systemRelationDirection"]').should('contain', 'Udgående data');
        if (clearDirection) {
          cy.get('app-dropdown[formName="systemRelationDirection"] .ng-clear-wrapper').click();
        }
        cy.contains('Gem').click();
      });
      cy.wait('@modifyRelation').its('request.body').should((request) => {
        expect(request.systemRelationDirection).to.equal(clearDirection ? undefined : 'OutgoingData');
      });
      cy.contains('Relation ændret');
    });
  }

  it('can delete Relation', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });

    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-system-usages/*/incoming-system-relations', []);
    cy.intercept('/api/v2/it-system-usage-relation-frequency-types*', []);

    cy.navigateToDetailsSubPage('Relationer');

    cy.getRowForElementContent('Aplanner').get('app-trashcan-icon').first().click({ force: true });

    cy.verifyYesNoConfirmationDialogAndConfirm(
      'DELETE',
      '**/system-relations/*',
      {},
      'Er du sikker på at du vil fjerne denne relation'
    );

    cy.contains('Relationen er slettet');
  });

  function verifyRelationTable(systemName: string, rows: RelationRow[], isOutgoing: boolean) {
    cy.getCardWithTitle(
      isOutgoing
        ? `'${systemName}' har følgende relationer til andre systemer/snitflader`
        : `Andre systemer har følgende relationer til '${systemName}'`
    ).within(() => {
      for (const expectedRow of rows) {
        const row = () => cy.getRowForElementContent(expectedRow.systemUsageName);
        row().contains(expectedRow.relationInterfaceName);
        if (expectedRow.systemRelationDirectionName) {
          row().contains(expectedRow.systemRelationDirectionName);
        } else {
          row().find('td').eq(2).should('have.text', '');
        }
        row().contains(expectedRow.associatedContractName);
        row().contains(expectedRow.description);
        const expectedFrequencyName = expectedRow.isFrequencyObsolete
          ? expectedRow.relationFrequencyName + ' (udgået)'
          : expectedRow.relationFrequencyName;
        row().contains(expectedFrequencyName);
        if (expectedRow.expectedInvalidUrlReference) {
          row().contains(expectedRow.expectedInvalidUrlReference);
        }
        if (expectedRow.expectedValidUrlReference) {
          row().verifyExternalReferenceHrefValue('Læs mere', expectedRow.expectedValidUrlReference);
        }
      }
    });
  }
});
