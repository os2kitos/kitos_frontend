/// <reference types="Cypress" />

const generalInformation = 'Generel information';
const purposeInput = 'Systemets overordnede formål';
const businessCriticalDropdown = 'Forretningskritisk IT-System';
const hostedAtDropdown = 'IT-systemet driftes';
const personDataCheckbox = 'Almindelige personoplysninger';
const dataSensitivityAccordion = 'data-sensitivity-accordion';
const registedCategoriesAccordion = 'registed-categories-accordion';
const technicalPrecautionsAccordion = 'technical-precautions-accordion';
const userSupervisionAccordion = 'user-supervision-accordion';
const riskAssessmentAccordion = 'risk-assessment-accordion';
const datepickerToggle = 'datepicker-toggle';

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
    cy.intercept('/api/v2/it-system-usage-data-classification-types*', {
      fixture: './it-system-usage/classification-types.json',
    });
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: './shared/permissions.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' }); //gets the base system
    cy.intercept('/api/v2/it-system-usage-sensitive-personal-data-types?organizationUuid=*', {
      fixture: './it-system-usage/it-system-usage-sensitive-personal-data-types.json',
    });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/gdpr/it-system-usage-full-gdpr.json' });
    cy.intercept('/api/v2/it-system-usage-registered-data-category-types?organizationUuid=*', {
      fixture: './it-system-usage/it-system-usage-registered-data-category-types.json',
    });

    cy.setup(true, 'it-systems/it-system-usages');

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('GDPR');
  });

  it('can show GDPR tab and existing data in general input fields', () => {
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
    }).as('patch');

    cy.contains(generalInformation);
    cy.contains('Yderligere information');
    cy.input(purposeInput).should('have.value', 'Test purpose');
    cy.dropdown(businessCriticalDropdown).should('have.text', 'Ja');
    cy.dropdown(hostedAtDropdown).should('have.text', 'On-premise');

    verifyLinkTextbox('directory-documentation-link', 'newName: newUrl');
  });

  it('can edit purpose', () => {
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
    }).as('patch');
    const newPurpose = 'New purpose';
    cy.input(purposeInput).clear().type(newPurpose);
    cy.contains(generalInformation).click();

    cy.verifyRequestUsingDeepEq('patch', 'request.body', { gdpr: { purpose: newPurpose } });
    cy.input(purposeInput).should('have.value', newPurpose);
  });

  it('can edit business critical status', () => {
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
    }).as('patch');
    const newBusinessCritical = 'Nej';
    cy.dropdown(businessCriticalDropdown, newBusinessCritical, true);
    cy.contains(generalInformation).click();

    verifyGdprPatchRequest({ businessCritical: 'No' });
    cy.dropdown(businessCriticalDropdown).should('have.text', newBusinessCritical);
  });

  it('can edit hosted at status', () => {
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
    }).as('patch');
    const newHostedAt = 'Eksternt';
    cy.dropdown(hostedAtDropdown, newHostedAt, true);
    cy.contains(generalInformation).click();

    verifyGdprPatchRequest({ hostedAt: 'External' });
    cy.dropdown(hostedAtDropdown).should('have.text', newHostedAt);
  });

  it('can edit data sensitivity levels', () => {
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
    }).as('patch');
    cy.getByDataCy(dataSensitivityAccordion).click();

    cy.input('Straffedomme og lovovertrædelser').should('be.checked');
    cy.input(personDataCheckbox).should('not.be.checked');
    cy.input(personDataCheckbox).click();
    verifyGdprPatchRequest({ dataSensitivityLevels: ['PersonData', 'LegalData'] });
  });

  it('can edit specific personal data, and sub-options when main option is selected', () => {
    cy.getByDataCy(dataSensitivityAccordion).click();
    const nestedCheckboxes = ['CPR-nr.', 'Væsentlige sociale problemer', 'Andre rent private forhold'];
    nestedCheckboxes.forEach((checkBox) => {
      cy.input(checkBox).should('be.disabled');
    });
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/gdpr/it-system-usage-full-gdpr.json',
    }).as('patch');

    cy.input('Almindelige personoplysninger').click();
    verifyGdprPatchRequest({ dataSensitivityLevels: ['PersonData', 'LegalData'] });

    nestedCheckboxes.forEach((checkBox) => {
      cy.input(checkBox).should('be.enabled');
    });

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
    }).as('patchSpecificPersonalData');
    cy.input('CPR-nr.').click({ force: true });
    cy.verifyRequestUsingDeepEq('patchSpecificPersonalData', 'request.body', {
      gdpr: { specificPersonalData: ['CprNumber'] },
    });
  });

  it('can edit sensitive personal data, and sub-options when main option is selected', () => {
    cy.getByDataCy(dataSensitivityAccordion).click();
    const nestedCheckboxes = ['data type 1', 'data type 2'];
    nestedCheckboxes.forEach((checkBox) => {
      cy.input(checkBox).should('be.disabled');
    });
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/gdpr/it-system-usage-gdpr-sensitive-data.json',
    }).as('patch');

    cy.input('Følsomme personoplysninger').click();
    verifyGdprPatchRequest({ dataSensitivityLevels: ['SensitiveData', 'LegalData'] });

    nestedCheckboxes.forEach((checkBox) => {
      cy.input(checkBox).should('be.enabled');
    });

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
    }).as('patchSensitivePersonalData');
    cy.input('data type 1').click({ force: true });
    verifyGdprPatchRequest(
      { sensitivePersonDataUuids: ['00000000-0000-0000-0000-000000000000'] },
      'patchSensitivePersonalData'
    );
  });

  it('can edit registered categories of data', () => {
    cy.getByDataCy(registedCategoriesAccordion).click();
    const checkBox = 'data category 1';

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
    }).as('patch');
    cy.input(checkBox).click();
    verifyGdprPatchRequest({ registeredDataCategoryUuids: ['00000000-0000-0000-0000-000000000000'] });
  });

  it('can edit technical precautions', () => {
    cy.getByDataCy(technicalPrecautionsAccordion)
      .click()
      .within(() => {
        cy.getByDataCy('technical-precautions-dropdown').should('contain', 'Nej');
        const nestedCheckboxes = ['Kryptering', 'Pseudonomisering', 'Adgangsstyring', 'Logning'];
        nestedCheckboxes.forEach((checkBox) => {
          cy.input(checkBox).should('be.disabled');
        });

        cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
          fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
        }).as('patchYesToApplied');
        cy.getByDataCy('technical-precautions-dropdown').click().contains('Ja').click({ force: true });
        verifyGdprPatchRequest({ technicalPrecautionsInPlace: 'Yes' }, 'patchYesToApplied');
        nestedCheckboxes.forEach((checkBox) => {
          cy.input(checkBox).should('be.enabled');
        });

        cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
          fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
        }).as('patchAddPrecaution');
        cy.input('Kryptering').click();
        verifyGdprPatchRequest({ technicalPrecautionsApplied: ['Encryption'] }, 'patchAddPrecaution');
        verifyLinkTextAndPressEdit('technical-precautions-documentation-link', 'newName: newUrl');
      });
    verifyLinkEditDialog();
  });

  it('can edit user supervision', () => {
    cy.getByDataCy(userSupervisionAccordion)
      .click()
      .within(() => {
        const urlSectionDropdown = 'url-section-dropdown';
        cy.getByDataCy(urlSectionDropdown).should('contain', 'Nej');
        cy.get(datepickerToggle).should('not.exist');

        cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
          fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
        }).as('patchYesToSupervision');
        cy.getByDataCy(urlSectionDropdown).click().contains('Ja').click({ force: true });
        verifyGdprPatchRequest({ userSupervision: 'Yes' }, 'patchYesToSupervision');

        cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
          fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
        }).as('patchAddPrecaution');
        cy.getByDataCy('base-date-url-section-selector').type('2024-02-15');

        verifyLinkTextAndPressEdit('base-date-url-section-selector', 'newName: newUrl');
      });
    verifyLinkEditDialog();
  });

  it('can edit risk assessment', () => {
    cy.getByDataCy(riskAssessmentAccordion).click();
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
    }).as('riskAssessmentPatch');
    const date = '15-02-2024';

    cy.dropdownByCy('risk-assessment-dropdown', 'Ja', true);
    verifyGdprPatchRequest({ riskAssessmentConducted: 'Yes' }, 'riskAssessmentPatch');

    cy.inputByCy('planned-date-datepicker').type(date);
    verifyAppNotification();
    cy.getByDataCy('conducted-date-datepicker').type(date);
    verifyAppNotification();
    cy.dropdownByCy('assessment-result-dropdown', 'Lav risiko', true);
    verifyAppNotification();
    cy.getByDataCy('assessment-notes').type('Test');
    verifyAppNotification();

    verifyLinkTextAndPressEdit('risk-documentation-link', 'newName: newUrl');
    verifyLinkEditDialog();
  });

  it('can edit retention period', () => {
    cy.getByDataCy('retention-period-accordion').click();

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/gdpr/it-system-usage-updated-gdpr.json',
    }).as('retentionPeriodPatch');

    cy.dropdownByCy('retention-period-dropdown', 'Ja', true);
    verifyAppNotification();

    cy.clock().then((clock) => {
      clock.setSystemTime(new Date('10/10/2022'));
    });

    cy.datepickerByCy('retention-period-datepicker', '15');
    verifyAppNotification();

    cy.inputByCy('retention-period-numeric-input').click().type('20');
    verifyAppNotification();
  });
});

function verifyGdprPatchRequest(gdprUpdate: object, requestAlias?: string) {
  const requestName = requestAlias ?? 'patch';
  cy.verifyRequestUsingDeepEq(requestName, 'request.body', { gdpr: gdprUpdate });
}

function verifyLinkTextbox(textboxSelector: string, textboxText: string) {
  verifyLinkTextAndPressEdit(textboxSelector, textboxText);

  verifyLinkEditDialog();
}

function verifyLinkTextAndPressEdit(textboxSelector: string, textboxText: string) {
  cy.getByDataCy(textboxSelector).within(() => {
    cy.getByDataCy('link-textbox-input').should('have.value', textboxText).getByDataCy('edit-link-button').click();
  });
}

function verifyLinkEditDialog() {
  cy.get('app-edit-url-dialog').within(() => {
    cy.getByDataCy('link-name-textbox').type('Test');
    cy.getByDataCy('link-url-textbox').type('https://test.dk');
    cy.getByDataCy('edit-url-cancel-button').should('exist');
    cy.getByDataCy('edit-url-save-button').click();
  });

  verifyAppNotification();
}

function verifyAppNotification() {
  cy.get('app-popup-message').should('exist');
}
