Cypress.Commands.add('setup', (authenticate?: boolean) => {
  cy.intercept('/api/v2/internal/public-messages', { fixture: 'public-messages.json' });

  if (authenticate) {
    cy.intercept('/api/Authorize', { fixture: 'authorize.json' });
  } else {
    cy.intercept('/api/Authorize', { statusCode: 401, fixture: 'authorize-401.json' });
  }

  cy.visit('/');
});

Cypress.Commands.add('login', () => {
  cy.intercept('/api/authorize/antiforgery', '"ABC"');
  cy.intercept('/api/Authorize', { fixture: 'authorize.json' });
  cy.intercept('/api/Authorize?logout', { fixture: 'authorize-401.json' });

  cy.contains('Email').type('test@test.com');
  cy.contains('Password').type('123456');
  cy.contains('Log ind').click();
});
