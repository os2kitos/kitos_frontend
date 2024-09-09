describe('frontpage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
    cy.intercept('/api/v2/internal/organizations/*/grid/*/*', { statusCode: 404, body: {} });
    cy.setup();
  });

  it('can show frontpage', () => {
    cy.title().should('eq', 'Kitos');
    cy.contains('Kitos - Kommunernes IT OverbliksSystem');
  });
});
