const marketingPageUrl = 'https://www.os2.eu/os2kitos';

describe('frontpage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
    cy.intercept('/api/v2/internal/organizations/*/grid/*/*', { statusCode: 404, body: {} });
    cy.setup();
  });

  it('can show frontpage', () => {
    cy.title().should('eq', 'Kitos');
    cy.contains('Kitos er Kommunernes IT Overblikssystem');
  });

  it('Can go to marketing page', () => {
    assertCanGoToMarketingPage(false, () => {
      cy.contains('Hvad er Kitos?').click();
    });

    assertCanGoToMarketingPage(true, () => {
      cy.contains('Læs mere om Kitos').click();
    });
  });
});

function assertCanGoToMarketingPage(authenticate: boolean, initiator: () => void) {
  cy.setup(authenticate);
  cy.window().then((win) => {
    cy.stub(win, 'open').as('windowOpen');
  });
  initiator();
  cy.get('@windowOpen').should('be.calledWith', marketingPageUrl);
}
