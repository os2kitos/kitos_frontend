Cypress.Commands.add('setup', (authenticate?: boolean, path?: string) => {
  cy.intercept('/api/v2/internal/public-messages', { fixture: 'public-messages.json' });

  if (authenticate) {
    cy.intercept('/api/Authorize', { fixture: 'authorize.json' }).as('authorize');
  } else {
    cy.intercept('/api/Authorize', { statusCode: 401, fixture: 'authorize-401.json' }).as('authorize');
  }

  cy.intercept('/api/v2/organizations*', { fixture: 'organizations.json' }).as('organizations');

  cy.visit(path || '/');

  if (authenticate) {
    cy.wait('@organizations');
  } else {
    cy.wait('@authorize');
  }
});

Cypress.Commands.add('login', () => {
  cy.intercept('/api/authorize/antiforgery', '"ABC"');
  cy.intercept('/api/Authorize', { fixture: 'authorize.json' }).as('authorize');

  cy.contains('Email').parent().find('input').type('test@test.com');
  cy.contains('Password').parent().find('input').type('123456');
  cy.contains('Log ind').click();

  cy.wait('@authorize');
});

Cypress.Commands.add('requireIntercept', () => {
  cy.intercept({ url: 'api/**' }, (req) => {
    throw new Error('Request not intercepted by Cypress: ' + req.url);
  }).as('Require intercept');
});

Cypress.Commands.add('checkInput', (inputName: string, expectedValue: string) => {
  cy.contains(inputName).parent().find('input').should('have.value', expectedValue);
});
