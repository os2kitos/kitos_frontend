/// <reference types="cypress" />

describe('grid columns', () => {

  //eslint-disable-next-line
  let cache: {columns: any[], hash: string};

  beforeEach(() => {
    cy.intercept('/odata/DataProcessingRegistrationReadModels*', {
      fixture: './dpr/data-processings-odata.json',
    });

    cy.intercept('/api/v1/data-processing-registration/available-options-in/organization/*', {
      fixture: 'dpr/data-processing-options.json',
    });
    cy.intercept('/api/v2/data-processing-registrations/permissions*', { fixture: 'shared/create-permissions.json' });
    cy.intercept('/api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
    cy.intercept('/api/v2/internal/organizations/*/grid/*/*', { statusCode: 404, body: {} });

    cy.clearAllLocalStorage();
    cy.setup(true, 'data-processing');
    cy.wait(2000);
    cy.window().then((window) => {
      const dprGridColumnsString = window.localStorage.getItem('data-processing-grid-columns') ?? '';
      cache = JSON.parse(dprGridColumnsString);
    });
  });

  it('Doesnt invalidate columns when visibility has been changed', () => {
    cy.contains('Tilpas kolonner').click();
    cy.getByDataCy('checkbox-input').eq(2).click()
    cy.contains('Gem').click();

    cy.window().then((window) => {
      const dprGridColumnsString = window.localStorage.getItem('data-processing-grid-columns') ?? '';
      const newCache = JSON.parse(dprGridColumnsString);
      expect(newCache.hash).to.eq(cache.hash);
    });
  });

  it('Invalidates columns when hash is different', () => {
    const mockHashChange = {...cache, hash: '12345678'};
    cy.window().then((window) => {
      window.localStorage.setItem('data-processing-grid-columns', JSON.stringify(mockHashChange));
    });

    cy.visit('/data-processing');
    cy.wait(2000);

    cy.window().then((window) => {
      const dprColumnsString = window.localStorage.getItem('data-processing-grid-columns') ?? '';
      const newCache = JSON.parse(dprColumnsString);
      expect(mockHashChange.hash).to.not.eq(newCache.hash);
    });
  });
});
