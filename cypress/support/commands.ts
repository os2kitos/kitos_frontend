import { Method, RouteMatcher } from 'cypress/types/net-stubbing';

/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const picker = cy.contains(name);
  if (value) {
    picker.parentsUntil('mat-form-field').find('mat-datepicker-toggle').click();
    cy.document().within(() => {
      cy.wait(200);
      cy.get('mat-datepicker-content').contains(value).click();
    });
  }
  return picker;
});

Cypress.Commands.add('navigateToDetailsSubPage', (pageName: string) => {
  return cy.get('app-navigation-drawer').within(() => {
    cy.contains(pageName).click();
  });
});

Cypress.Commands.add('confirmAction', (message: string, confirmationButtonText?: string, title?: string) => {
  return cy
    .contains(title ? title : 'Bekræft handling')
    .parentsUntil('app-confirmation-dialog')
    .first()
    .parent()
    .within(() => {
      cy.contains(message);
      cy.contains(confirmationButtonText ? confirmationButtonText : 'Ja').click();
    });
});

Cypress.Commands.add('getCardWithTitle', (title: string) => {
  return getElementParentWithSelector(title, 'app-card');
});

Cypress.Commands.add('getRowForElementContent', (elementContent: string) => {
  return getElementParentWithSelector(elementContent, 'tr');
});

Cypress.Commands.add('verifyExternalReferenceHrefValue', (name: string, url: string) => {
  return cy.contains(name).should('have.attr', 'href').and('include', url);
});

Cypress.Commands.add('verifyTooltipText', (text: string) => {
  return cy.get('app-tooltip').should('have.attr', 'ng-reflect-text').and('include', text);
});

Cypress.Commands.add('clearInputText', (inputText: string) => {
  return cy.contains(inputText).parent().type('{selectAll}{backspace}');
});

Cypress.Commands.add(
  'verifyRequestUsingProvidedMethod',
  (
    requestAlias: string,
    propertyPath: string,
    verifyMethod: (actual: any, expectedObject: any) => boolean,
    expectedObject: any
  ) => {
    return cy
      .wait(`@${requestAlias}`)
      .its(propertyPath)
      .then((actual) => {
        expect(verifyMethod(actual, expectedObject)).to.be.true;
      });
  }
);

Cypress.Commands.add('verifyRequestUsingDeepEq', (requestAlias: string, propertyPath: string, expectedObject: any) => {
  return cy.wait(`@${requestAlias}`).its(propertyPath).should('deep.eq', expectedObject);
});

Cypress.Commands.add('interceptPatch', (url: string, fixturePath: string, alias: string) => {
  return cy
    .intercept('PATCH', url, {
      fixture: fixturePath,
    })
    .as(alias);
});

Cypress.Commands.add(
  'verifyYesNoConfirmationDialogAndConfirm',
  (method: string, url: string, fixture?: object, message?: string, title?: string) => {
    return cy
      .get('app-confirmation-dialog')
      .within(() => {
        if (!title) {
          title = 'Bekræft handling';
        }
        if (!message) {
          message = 'Er du sikker?';
        }
        cy.contains(title);
        cy.contains(message);

        cy.contains('Nej');

        if (!fixture) {
          fixture = {};
        }
        cy.intercept(method as Method, url as RouteMatcher, fixture);
        cy.contains('Ja').click();
      })
      .get('app-notification')
      .should('exist');
  }
);

Cypress.Commands.add('getByDataCy', (dataCy: string) => {
  return cy.get(`[data-cy=${dataCy}]`);
});

function getElementParentWithSelector(elementName: string, selector: string) {
  return cy.contains(elementName).parentsUntil(selector).parent();
}
