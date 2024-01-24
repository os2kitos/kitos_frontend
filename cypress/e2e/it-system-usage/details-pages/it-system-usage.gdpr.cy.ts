/// <reference types="Cypress" />


const generalInformation = 'Generel information';
const purposeInput = 'Systemets overordnede formål';
const businessCriticalDropdown = 'Forretningskritisk IT-System';
const hostedAtDropdown = 'IT-systemet driftes';
const nameInput = 'Navn';
const urlInput = 'URL';
const noSensitiveDataCheckbox = 'Ingen personoplysninger';
const dataTypesAccordion = 'Hvilke typer data indeholder systemet?';

describe('it-system-usage', () => {
    beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: 'it-system-usages.json' });
    cy.intercept('/api/v2/it-system-usage-data-classification-types*', { fixture: 'classification-types.json' });
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: 'permissions.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' }); //gets the base system
    cy.intercept('/api/v2/it-system-usage-sensitive-personal-data-types?organizationUuid=*', { fixture: 'it-system-usage-sensitive-personal-data-types.json'})
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage-full-gdpr.json' });
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'it-system-usage-updated-gdpr.json' }).as('patch');

    cy.setup(true, 'it-systems/it-system-usages')

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('GDPR');
  })

  it('can show GDPR tab and existing data in general input fields', () => {
    cy.contains(generalInformation);
    cy.contains('Yderligere information')
    cy.input(purposeInput).should('have.value', 'Test purpose');
    cy.dropdown(businessCriticalDropdown).should('have.text', "Ja");
    cy.dropdown(hostedAtDropdown).should('have.text', 'On-premise')
    cy.contains('Intet link til fortegnelse');
  })

  it('can edit purpose', () => {
    const newPurpose = 'New purpose';
    cy.input(purposeInput).clear().type(newPurpose);
    cy.contains(generalInformation).click();

    cy.verifyApiCallWithBody('patch', { gdpr: { purpose: newPurpose } })
    cy.input(purposeInput).should('have.value', newPurpose);
  })

  it('can edit business critical status', () => {
    const newBusinessCritical = "Nej";
    cy.dropdown(businessCriticalDropdown, newBusinessCritical, true)
    cy.contains(generalInformation).click();

    cy.verifyApiCallWithBody('patch', { gdpr: { businessCritical: "No" }});
    cy.dropdown(businessCriticalDropdown).should('have.text', newBusinessCritical);
  })

  it('can edit hosted at status', () => {
    const newHostedAt = "Eksternt";
    cy.dropdown(hostedAtDropdown, newHostedAt, true)
    cy.contains(generalInformation).click();

    cy.verifyApiCallWithBody('patch', { gdpr: { hostedAt: "External" } })
    cy.dropdown(hostedAtDropdown).should('have.text', newHostedAt);
  })

  it('can edit directory documentation', () => {
    const newName = "newName";
    const newUrl = "newUrl";
    cy.get('app-edit-url-section').within(() => cy.get('app-icon-button').click({ force: true }));
    cy.get("[data-cy='edit-url-button']").first().click();
    cy.input(nameInput).clear().type(newName);
    cy.input(urlInput).clear().type(newUrl)
    cy.contains('Gem').click()

    cy.verifyApiCallWithBody('patch', { gdpr: { directoryDocumentation: { name: newName, url: newUrl } } });
    cy.get("[data-cy='directory-link']")
    .should('have.attr', 'href', '/' + newUrl)
    .should('have.text', 'Link til fortegnelse: ' + newName + ' ')
  })

  it('can edit data sensitivity levels', () => {
    cy.contains(dataTypesAccordion).click()
    const preselectedDataSensitivityLevels = ['Almindelige personoplysninger',
    'Straffedomme og lovovertrædelser']

    preselectedDataSensitivityLevels.forEach((level) => {
      cy.input(level).should('be.checked')
    })
    cy.input(noSensitiveDataCheckbox).should('not.be.checked')
    cy.input(noSensitiveDataCheckbox).click()
    cy.verifyApiCallWithBody('patch', { gdpr: { dataSensitivityLevels: ['None', 'PersonData', 'LegalData'] } });
  })

  it('can edit specific personal data', () => {
    cy.contains(dataTypesAccordion).click()
    cy.input('Almindelige personoplysninger').click()
    cy.input('Væsentlige sociale problemer').should('not.be.checked')
    cy.input('Andre rent private forhold').should('not.be.checked')
    cy.input('CPR-nr.').should('not.be.checked').click()
    cy.verifyApiCallWithBody('patch', { gdpr: { specificPersonalData: ['CprNumber'] } });
  })
})
