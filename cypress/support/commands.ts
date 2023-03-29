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

Cypress.Commands.add('dropdown', (dropdownName: string, value?: string, force = false) => {
  const dropdown = cy.contains(dropdownName);
  if (value) {
    dropdown.click({ force });
    cy.get('ng-dropdown-panel').contains(value).click();
  }
  if (force) {
    return dropdown;
  }
  return dropdown.siblings('.ng-value').find('.ng-value-label');
});

Cypress.Commands.add('datepicker', (name: string, value?: string) => {
  const dropdown = cy.contains(name);
  if (value) {
    dropdown.parent().find('button').click();
    cy.document().within(() => {
      cy.get('kendo-popup').contains(value).click();
    });
  }
  return dropdown;
});

Cypress.Commands.add('navigateToDetailsSubPage', (pageName: string) => {
  return cy.get('app-navigation-drawer').within(() => {
    cy.contains(pageName).click();
  });
});
