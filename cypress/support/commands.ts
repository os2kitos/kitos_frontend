Cypress.Commands.add('setup', (authenticate?: boolean, path?: string) => {
  cy.intercept('/api/authorize/antiforgery', { fixture: 'antiforgery.json' });

  if (authenticate) {
    cy.intercept('/api/Authorize', { fixture: 'authorize.json' }).as('authorize');
  } else {
    cy.intercept('/api/Authorize', { statusCode: 401, fixture: 'authorize-401.json' }).as('authorize');
  }

  cy.intercept('/api/v2/internal/public-messages', { fixture: 'public-messages.json' });
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

Cypress.Commands.add('input', (inputName: string) => {
  return cy.contains(inputName).parent().find('input');
});

Cypress.Commands.add('dropdown', (dropdownName: string, value?: string) => {
  cy.contains(dropdownName).parent().find('button').click();
  if (value) {
    cy.get('kendo-popup').contains(value).click();
  }
  return cy.contains(dropdownName);
});

Cypress.Commands.add('navigateToDetailsSubPage', (pageName: string) => {
  return cy.get('.navigation').within(() => {
    cy.contains(pageName).click();
  });
});
