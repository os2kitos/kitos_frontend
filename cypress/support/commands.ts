import { verifyArrayContainsObject } from 'cypress/support/request-verification';
import { Method, RouteMatcher } from 'cypress/types/net-stubbing';

/* eslint-disable @typescript-eslint/no-explicit-any */
Cypress.Commands.add('setup', (authenticate?: boolean, path?: string) => {
  cy.intercept('/api/authorize/antiforgery', { fixture: './shared/antiforgery.json' });

  if (authenticate) {
    cy.intercept('/api/Authorize', { fixture: './shared/authorize.json' }).as('authorize');
  } else {
    cy.intercept('/api/Authorize', { statusCode: 401, fixture: './shared/authorize-401.json' }).as('authorize');
  }

  cy.intercept('/api/v2/internal/public-messages', { fixture: './shared/public-messages.json' });
  cy.intercept('/api/v2/organizations*', { fixture: './organizations/organizations.json' }).as('organizations');

  cy.visit(path || '/');

  if (authenticate) {
    cy.wait('@organizations');
  } else {
    cy.wait('@authorize');
  }
});

Cypress.Commands.add('login', () => {
  cy.intercept('/api/authorize/antiforgery', '"ABC"');
  cy.intercept('/api/Authorize', { fixture: './shared/authorize.json' }).as('authorize');

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

Cypress.Commands.add('inputByCy', (inputSelector: string) => {
  return cy.getByDataCy(inputSelector).find('input');
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

Cypress.Commands.add('dropdownByCy', (dropdownCySelector: string, value?: string, force = false) => {
  const dropdown = cy.getByDataCy(dropdownCySelector).find('input');
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

Cypress.Commands.add('datepickerByCy', (selector: string, value?: string) => {
  const picker = cy.getByDataCy(selector);
  if (value) {
    picker.find('mat-datepicker-toggle').click();
    cy.document().within(() => {
      cy.wait(200);
      cy.get('mat-datepicker-content').contains(value).click();
    });
  }
  return picker;
});

Cypress.Commands.add('textareaByCy', (selector: string) => {
  return cy.getByDataCy(selector).find('textarea');
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

Cypress.Commands.add('testCanShowExternalRefernces', () => {
  const expectedRows = [
    {
      title: 'Invalid url',
      documentId: 'document1',
      expectedInvalidUrl: 'www.google.com',
      masterReference: false,
    },
    {
      title: 'Valid url',
      documentId: 'document2',
      expectedValidUrl: 'https://www.google.com',
      masterReference: false,
    },
    {
      title: 'No url Master reference',
      documentId: 'document3',
      url: '',
      masterReference: true,
    },
  ];

  expectedRows.forEach((expectedRow) => {
    const row = () => cy.getRowForElementContent(expectedRow.title);
    row().contains(expectedRow.documentId);
    row().contains(expectedRow.masterReference ? 'Ja' : 'Nej');
    if (expectedRow.expectedInvalidUrl) {
      row().verifyTooltipText('Ugyldigt link: ' + expectedRow.expectedInvalidUrl);
    }
    if (expectedRow.expectedValidUrl) {
      row().verifyExternalReferenceHrefValue(expectedRow.title, expectedRow.expectedValidUrl);
    }
  });

  Cypress.Commands.add(
    'externalReferencesSaveAndValidate',
    (
      shouldMasterDataBeDisabled: boolean,
      shouldSelectMasterData: boolean,
      isEdit: boolean,
      requestUrl: string,
      responseBodyPath: string,
      rowTitle?: string
    ) => {
      cy.interceptPatch(requestUrl, responseBodyPath, 'patchRequest');

      if (isEdit) {
        openEditDialog(rowTitle!);
      } else {
        openCreateDialog();
      }

      const newReference = {
        title: 'Reference1',
        documentId: 'Document id',
        url: 'url',
        masterReference: true,
      };

      cy.get('app-external-reference-dialog').within(() => {
        cy.clearInputText('Titel').type(newReference.title);
        cy.clearInputText('Evt. DokumentID/sagsnr./Anden Reference').type(newReference.documentId);
        cy.clearInputText('URL, hvis dokumenttitel skal virke som link').type(newReference.url);

        if (shouldMasterDataBeDisabled) {
          cy.get('mat-checkbox input').should('be.checked').should('be.disabled');
        } else {
          cy.get('mat-checkbox input').should('be.empty').should('be.enabled');
        }
        if (shouldSelectMasterData) {
          cy.get('mat-checkbox').should('have.text', 'Vises i overblik').click();
        }

        cy.contains('Gem').click();
      });

      if (isEdit) {
        cy.contains('Referencen blev ændret');
      } else {
        cy.contains('Referencen blev oprettet');
      }

      cy.verifyRequestUsingProvidedMethod(
        'patchRequest',
        'request.body.externalReferences',
        (actual, expectedObject) => verifyArrayContainsObject(actual, expectedObject),
        {
          title: 'Reference1',
          documentId: 'Document id',
          url: 'url',
          masterReference: true,
        }
      );

      cy.getRowForElementContent(newReference.title)
        .first()
        .within(() => {
          cy.contains(newReference.documentId);
          cy.contains(newReference.masterReference ? 'Ja' : 'Nej');
          cy.verifyTooltipText('Ugyldigt link: ' + newReference.url);
        });
    }
  );
});

Cypress.Commands.add('setTinyMceContent', (dataCySelector, content) => {
    cy.window().should('have.property', 'tinymce');
    cy.getByDataCy(dataCySelector)
      .find('textarea')
      .as('editorTextarea')
      .should('exist');
    cy.window().then((win) =>
      cy.get('@editorTextarea').then((element) => {
          const editorId = element.attr('id');
          const editorInstance = (win as any).tinymce.EditorManager.get().filter((editor: { id: string | undefined; }) => editor.id === editorId)[0];
          editorInstance.setContent(content);
      })
    );
    cy.getByDataCy(dataCySelector).click({force: true})
});

Cypress.Commands.add('getIframe', () => {
  cy.get('iframe')
    .its('0.contentDocument').should('exist').its('body').should('not.be.undefined')
    .then(cy.wrap)
})

function getElementParentWithSelector(elementName: string, selector: string) {
  return cy.contains(elementName).parentsUntil(selector).parent();
}

function openCreateDialog() {
  cy.contains('Opret reference').click();
}

function openEditDialog(title: string) {
  cy.getRowForElementContent(title)
    .first()
    .within(() => cy.get('app-pencil-icon').click({ force: true }));
}
