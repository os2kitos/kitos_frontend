import { TestRunner } from 'cypress/support/test-runner';

const setupTest = () => {
  cy.requireIntercept();
  cy.setupDataProcessingIntercepts();

  cy.intercept('PATCH', 'api/v2/data-processing-registrations/*', {
    fixture: './dpr/data-processing-registration-patch.json',
  });
};

describe('data-processing-front-page', () => {
  it('Tests', () => {
    const testRunner = new TestRunner(setupTest);

    testRunner.runTestWithSetup('Agreement conclusion date is enabled when agreement is concluded', () => {
      cy.setup(true, 'data-processing');
      cy.contains('Dpa 1').click();

      cy.getByDataCy('dpr-agreement-concluded-date').find('input').should('be.disabled');
      cy.dropdownByCy('dpr-agreement-concluded', 'Ja', true);
      cy.getByDataCy('dpr-agreement-concluded-date').find('input').should('not.be.disabled');
    });

    testRunner.runTestWithSetup('Can show responsible unit on startup', () => {
      cy.setup(true, 'data-processing');
      const responsibleUnit = { name: 'En enhed', uuid: '0c2c1b3b-0b1b-4b3b-8b3b-0b1b3b0b1b3b' };
      cy.intercept('api/v2/organizations/*/organization-units?pageSize=*', { body: [responsibleUnit] });
      cy.setup(true, 'data-processing');
      cy.contains('Dpa 1').click();

      cy.contains('En enhed').should('exist');
    });

    testRunner.runTestWithSetup('Can not see responsible unit dropdown, if disabled by UI customization', () => {
      cy.setup(true, 'data-processing', './shared/ui-customization/dpr-responsible-unit-disabled.json');
      cy.contains('Dpa 1').click().wait(500);

      cy.getByDataCy('responsible-unit-select').should('not.exist');
    });

    // testRunner.runTestWithSetup('Can patch and clear responsible unit', () => {
    //   cy.setup(true, 'data-processing');
    //   const responsibleUnitToSelect = {
    //     parentOrganizationUnit: null,
    //     ean: null,
    //     unitId: null,
    //     origin: 'Kitos',
    //     uuid: '0c2c1b3b-0b1b-4b3b-8b3b-0b1b3b0b1b3b',
    //     name: 'En anden enhed',
    //   };
    //   const existingUnit = {
    //     parentOrganizationUnit: null,
    //     ean: null,
    //     unitId: null,
    //     origin: 'Kitos',
    //     uuid: '0c2c1b3b-0b1b-4b3b-8b3b-0b1b3b0b1aaa',
    //     name: 'En enhed',
    //   };
    //   cy.intercept('api/v2/organizations/*/organization-units?pageSize=*', {
    //     body: [responsibleUnitToSelect, existingUnit],
    //   });
    //   cy.contains('Dpa 1').click();

    //   cy.intercept('PATCH', 'api/v2/data-processing-registrations/*', (req) => {
    //     expect(req.body.general.responsibleOrganizationUnitUuid).to.be.equal(responsibleUnitToSelect.uuid);
    //     req.reply({ body: { general: { responsibleOrganizationUnit: responsibleUnitToSelect } } });
    //   }).as('patchResponsibleUnit');

    //   cy.getByDataCy('responsible-unit-select').click();
    //   cy.contains(responsibleUnitToSelect.name).click();

    //   cy.contains(responsibleUnitToSelect.name).should('exist');

    //   cy.get('app-popup-message').should('exist');

    //   cy.intercept('PATCH', 'api/v2/data-processing-registrations/*', (req) => {
    //     cy.setup(true, 'data-processing');
    //     expect(req.body.general.responsibleOrganizationUnitUuid).to.be.equal(null);
    //     req.reply({ body: { general: { responsibleOrganizationUnit: null } } });
    //   }).as('patchResponsibleUnit');

    //   cy.contains(responsibleUnitToSelect.name).should('exist');

    //   cy.get('app-popup-message').should('exist');

    //   cy.intercept('PATCH', 'api/v2/data-processing-registrations/*', (req) => {
    //     cy.setup(true, 'data-processing');
    //     expect(req.body.general.responsibleOrganizationUnitUuid).to.be.equal(null);
    //     req.reply({ body: { general: { responsibleOrganizationUnit: null } } });
    //   }).as('patchResponsibleUnit');

    //   cy.getByDataCy('responsible-unit-select').find('.ng-clear-wrapper').click();

    //   cy.contains(responsibleUnitToSelect.name).should('not.exist');
    // });
  });
});
