/// <reference types="Cypress" />

interface RelationRow {
  systemUsageName: string;
  relationInterfaceName: string;
  associatedContractName: string;
  relationFrequencyName: string;
  isFrequencyObsolete: boolean;
  description: string;
  expectedValidUrlReference?: string;
  expectedInvalidUrlReference?: string;
}

describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: 'it-system-usages.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });
    cy.intercept('/api/v2/it-system-usage-data-classification-types*', { fixture: 'classification-types.json' });
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: 'permissions.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' }); //gets the base system
    cy.setup(true, 'it-systems/it-system-usages');
  });

  it('can show empty Relations', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage-no-relations.json' });

    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-system-usages/*/incoming-system-relations', []);
    cy.intercept('/api/v2/*it-system-usage-relation-frequency-types*', []);

    cy.navigateToDetailsSubPage('Relationer');

    cy.getCardWithTitle("'System 3' har følgende relationer til andre systemer/snitflader").within(() => {
      cy.contains("Endnu ingen relationer tilføjet fra 'System 3' til andre systemer/snitflader");
      cy.contains('Opret relation');
    });

    cy.getCardWithTitle("Andre systemer har følgende relationer til 'System 3'").within(() => {
      cy.contains("Ingen relationer fra andre systemer til 'System 3' fundet");
    });
  });

  it('can show Relations', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });

    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-system-usages/*/incoming-system-relations', {
      fixture: 'it-system-usage-incoming-relations.json',
    });
    cy.intercept('/api/v2/*it-system-usage-relation-frequency-types*', { fixture: 'relation-frequency-types.json' });

    cy.navigateToDetailsSubPage('Relationer');

    const expectedOutgoingRows = [
      {
        systemUsageName: 'Aplanner',
        relationInterfaceName: 'Lorem ipsum',
        associatedContractName: 'Dolor sit',
        relationFrequencyName: 'Kvartal',
        isFrequencyObsolete: false,
        description: 'Sed at nibh ac tellus tempor dignissim quis id urna',
        expectedValidUrlReference: 'https://www.google.com',
      },
      {
        systemUsageName: 'Vestibulum',
        relationInterfaceName: 'Quisque nec',
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
    verifyRelationTable('System 3', expectedIncomingRows, false);
  });

  it('can add Relation', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });

    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-system-usages/*/incoming-system-relations', []);
    cy.intercept('/api/v2/*it-system-usage-relation-frequency-types*', { fixture: 'relation-frequency-types.json' });

    cy.navigateToDetailsSubPage('Relationer');

    cy.intercept('/api/v2/internal/it-system-usages/search?organizationUuid*', {
      fixture: 'it-system-usages-internal.json',
    });
    cy.intercept('/api/v2/*it-contracts*', { fixture: 'it-contracts-by-it-system-usage-uuid.json' });
    cy.intercept('/api/v2/*it-interfaces*', { fixture: 'it-interfaces.json' });

    cy.contains('Opret relation').click();

    cy.get('app-system-relation-dialog').within(() => {
      cy.dropdown('Søg efter system', 'System 1', true);
      cy.dropdown('Søg efter snitflade', 'Interface 1 - ACTIVE', true);
      cy.contains('Beskrivelse').type('test');
      cy.contains('Reference').type('test');
      cy.dropdown('Søg efter kontrakt', 'The valid contract', true);
      cy.dropdown('Vælg frekvens', 'Ugentligt', true);

      cy.intercept('POST', '**system-relations', {});
      cy.contains('Tilføj').click();
    });
    cy.contains('Relation tilføjet');
  });

  it('can modify Relation', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });

    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-system-usages/*/incoming-system-relations', []);
    cy.intercept('/api/v2/*it-system-usage-relation-frequency-types*', { fixture: 'relation-frequency-types.json' });

    cy.navigateToDetailsSubPage('Relationer');

    cy.intercept('/api/v2/internal/it-system-usages/search?organizationUuid*', {
      fixture: 'it-system-usages-internal.json',
    });
    cy.intercept('/api/v2/*it-contracts*', { fixture: 'it-contracts-by-it-system-usage-uuid.json' });
    cy.intercept('/api/v2/*it-interfaces*', { fixture: 'it-interfaces.json' });

    cy.getRowForElementContent('Aplanner').get('app-pencil-icon').first().click({ force: true });

    cy.get('app-system-relation-dialog').within(() => {
      cy.dropdown('Søg efter system', 'System 1', true);
      cy.dropdown('Søg efter snitflade', 'Interface 1 - ACTIVE', true);
      cy.contains('Beskrivelse').type('test');
      cy.contains('Reference').type('test');
      cy.dropdown('Søg efter kontrakt', 'The valid contract', true);
      cy.dropdown('Vælg frekvens', 'Ugentligt', true);

      cy.intercept('PUT', '**/system-relations/*', {});
      cy.contains('Gem').click();
    });
    cy.contains('Relation ændret');
  });

  it('can delete Relation', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });

    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-system-usages/*/incoming-system-relations', []);
    cy.intercept('/api/v2/it-system-usage-relation-frequency-types*', []);

    cy.navigateToDetailsSubPage('Relationer');

    cy.getRowForElementContent('Aplanner').get('app-trashcan-icon').first().click({ force: true });
    cy.get('app-confirmation-dialog').within(() => {
      cy.contains('Bekræft handling');
      cy.contains('Nej');
      cy.intercept('DELETE', '**/system-relations/*', {});
      cy.contains('Ja').click();
    });
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
        row().contains(expectedRow.associatedContractName);
        row().contains(expectedRow.description);
        const expectedFrequencyName = expectedRow.isFrequencyObsolete
          ? expectedRow.relationFrequencyName + ' (udgået)'
          : expectedRow.relationFrequencyName;
        row().contains(expectedFrequencyName);
        if (expectedRow.expectedInvalidUrlReference) {
          row().verifyTooltipText('Ugyldigt link: ' + expectedRow.expectedInvalidUrlReference);
        }
        if (expectedRow.expectedValidUrlReference) {
          row().verifyExternalReferenceHrefValue('Læs mere', expectedRow.expectedValidUrlReference);
        }
      }
    });
  }
});
