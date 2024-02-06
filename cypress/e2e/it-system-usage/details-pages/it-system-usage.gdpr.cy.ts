/// <reference types="Cypress" />


const generalInformation = 'Generel information';
const purposeInput = 'Systemets overordnede formål';
const businessCriticalDropdown = 'Forretningskritisk IT-System';
const hostedAtDropdown = 'IT-systemet driftes';
const personDataCheckbox = 'Almindelige personoplysninger';
const dataSensitivityAccordion = "[data-cy='data-sensitivity-accordion']";
const registedCategoriesAccordion = "[data-cy='registed-categories-accordion']"
const technicalPrecautionsAccordion = "[data-cy='technical-precautions-accordion']"
const userSupervisionAccordion = "[data-cy='user-supervision-accordion']"

describe('it-system-usage', () => {
    beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: 'it-system-usages.json' });
    cy.intercept('/api/v2/it-system-usage-data-classification-types*', { fixture: 'classification-types.json' });
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: 'permissions.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' }); //gets the base system
    cy.intercept('/api/v2/it-system-usage-sensitive-personal-data-types?organizationUuid=*', { fixture: 'it-system-usage-sensitive-personal-data-types.json'})
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'gdpr/it-system-usage-full-gdpr.json' });
    cy.intercept('/api/v2/it-system-usage-registered-data-category-types?organizationUuid=*', { fixture: 'it-system-usage-registered-data-category-types.json'})

    cy.setup(true, 'it-systems/it-system-usages')

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('GDPR');
  })

  it('can show GDPR tab and existing data in general input fields', () => {
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'gdpr/it-system-usage-updated-gdpr.json' }).as('patch');

    cy.contains(generalInformation);
    cy.contains('Yderligere information')
    cy.input(purposeInput).should('have.value', 'Test purpose');
    cy.dropdown(businessCriticalDropdown).should('have.text', "Ja");
    cy.dropdown(hostedAtDropdown).should('have.text', 'On-premise')
    cy.contains('Intet link til fortegnelse');
  })

  it('can edit purpose', () => {
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'gdpr/it-system-usage-updated-gdpr.json' }).as('patch');
    const newPurpose = 'New purpose';
    cy.input(purposeInput).clear().type(newPurpose);
    cy.contains(generalInformation).click();

    cy.verifyRequestUsingDeepEq('patch', 'request.body', { gdpr: { purpose: newPurpose } })
    cy.input(purposeInput).should('have.value', newPurpose);
  })

  it('can edit business critical status', () => {
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'gdpr/it-system-usage-updated-gdpr.json' }).as('patch');
    const newBusinessCritical = "Nej";
    cy.dropdown(businessCriticalDropdown, newBusinessCritical, true)
    cy.contains(generalInformation).click();

    verifyGdprPatchRequest({ businessCritical: "No" });
    cy.dropdown(businessCriticalDropdown).should('have.text', newBusinessCritical);
  })

  it('can edit hosted at status', () => {
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'gdpr/it-system-usage-updated-gdpr.json' }).as('patch');
    const newHostedAt = "Eksternt";
    cy.dropdown(hostedAtDropdown, newHostedAt, true)
    cy.contains(generalInformation).click();

  verifyGdprPatchRequest({ hostedAt: "External" })
    cy.dropdown(hostedAtDropdown).should('have.text', newHostedAt);
  })

  it('can edit data sensitivity levels', () => {
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'gdpr/it-system-usage-updated-gdpr.json' }).as('patch');
    cy.get(dataSensitivityAccordion).click()

    cy.input('Straffedomme og lovovertrædelser').should('be.checked')
    cy.input(personDataCheckbox).should('not.be.checked')
    cy.input(personDataCheckbox).click()
    verifyGdprPatchRequest({ dataSensitivityLevels: ['PersonData', 'LegalData'] });
  })

  it('can edit specific personal data, and sub-options when main option is selected', () => {
    cy.get(dataSensitivityAccordion).click()
    const nestedCheckboxes = ['CPR-nr.', 'Væsentlige sociale problemer', 'Andre rent private forhold']
    nestedCheckboxes.forEach((checkBox) => {
      cy.input(checkBox).should('be.disabled')
    })
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'gdpr/it-system-usage-full-gdpr.json' }).as('patch');

    cy.input('Almindelige personoplysninger').click()
    verifyGdprPatchRequest({ dataSensitivityLevels: ['PersonData', 'LegalData'] });

    nestedCheckboxes.forEach((checkBox) => {
      cy.input(checkBox).should('be.enabled')
    })

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'gdpr/it-system-usage-updated-gdpr.json' }).as('patchSpecificPersonalData');
    cy.input('CPR-nr.').click({force: true})
    cy.verifyRequestUsingDeepEq('patchSpecificPersonalData', 'request.body', { gdpr:{ specificPersonalData: ['CprNumber'] }  });
  })

  it('can edit sensitive personal data, and sub-options when main option is selected', () => {
    cy.get(dataSensitivityAccordion).click()
    const nestedCheckboxes = ['data type 1', 'data type 2']
    nestedCheckboxes.forEach((checkBox) => {
      cy.input(checkBox).should('be.disabled')
    })
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'gdpr/it-system-usage-gdpr-sensitive-data.json' }).as('patch');

    cy.input('Følsomme personoplysninger').click()
    verifyGdprPatchRequest({ dataSensitivityLevels: ['SensitiveData', 'LegalData'] });

    nestedCheckboxes.forEach((checkBox) => {
      cy.input(checkBox).should('be.enabled')
    })

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'gdpr/it-system-usage-updated-gdpr.json' }).as('patchSensitivePersonalData');
    cy.input('data type 1').click({force: true})
    verifyGdprPatchRequest({ sensitivePersonDataUuids: ["00000000-0000-0000-0000-000000000000"] }, 'patchSensitivePersonalData');
  })

  it('can edit registered categories of data', () => {
    cy.get(registedCategoriesAccordion).click()
    const checkBox = 'data category 1';

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'gdpr/it-system-usage-updated-gdpr.json' }).as('patch');
    cy.input(checkBox).click();
    verifyGdprPatchRequest({registeredDataCategoryUuids: ["00000000-0000-0000-0000-000000000000" ]})
  })

  it('can edit technical precautions', () => {
    cy.get(technicalPrecautionsAccordion).click().within(() => {
      cy.get("[data-cy='technical-precautions-dropdown']").should('contain', 'Nej')
      const nestedCheckboxes = ['Kryptering', 'Pseudonomisering', 'Adgangsstyring', 'Logning']
      nestedCheckboxes.forEach((checkBox) => {
        cy.input(checkBox).should('be.disabled')
      })

      cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'gdpr/it-system-usage-updated-gdpr.json' }).as('patchYesToApplied');
      cy.get("[data-cy='technical-precautions-dropdown']").click().contains('Ja').click({ force: true });
      verifyGdprPatchRequest({ technicalPrecautionsInPlace: "Yes" }, 'patchYesToApplied');
      nestedCheckboxes.forEach((checkBox) => {
        cy.input(checkBox).should('be.enabled')
      })

      cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'gdpr/it-system-usage-updated-gdpr.json' }).as('patchAddPrecaution');
      cy.input('Kryptering').click();
      verifyGdprPatchRequest({ technicalPrecautionsApplied: [ "Encryption" ] }, 'patchAddPrecaution');
    });
  })

  it('can edit user supervision', () => {
    cy.get(userSupervisionAccordion).click().within(() => {
      const urlSectionDropdown = "[data-cy='url-section-dropdown']";
      cy.get(urlSectionDropdown).should('contain', 'Nej');
      const datepickerToggle = "[data-cy='datepicker-toggle']";
      cy.get(datepickerToggle).should('not.exist');

      cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'gdpr/it-system-usage-updated-gdpr.json' }).as('patchYesToSupervision');
      cy.get(urlSectionDropdown).click().contains('Ja').click({ force: true });
      verifyGdprPatchRequest({ userSupervision: "Yes" }, 'patchYesToSupervision');

      cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'gdpr/it-system-usage-updated-gdpr.json' }).as('patchAddPrecaution');
      cy.get(datepickerToggle).should('exist');
      //todo click toggle, click a date, verify date has changed in ui and verify patchrequest

    })
  })
})

function verifyGdprPatchRequest(gdprUpdate: object, requestAlias?: string) {
  const requestName = requestAlias ?? 'patch';
  cy.verifyRequestUsingDeepEq(requestName, 'request.body', { gdpr: gdprUpdate });
}
