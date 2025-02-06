/// <reference types="cypress" />

describe('Reset password', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setup(false);
  });

  it('Can send request for password reset', () => {
    cy.getByDataCy('go-to-reset-password-text').click();

    const emailInput = 'jens@jensen.dk';
    cy.inputByCy('send-request-email').type(emailInput);

    cy.intercept('POST', 'api/v2/internal/users/password-reset/create', (req) => {
      expect(req.body).to.have.property('email', emailInput);

      req.reply({ statusCode: 204, body: {} });
    }).as('sendRequest');

    cy.getByDataCy('send-request-button').click();

    cy.wait('@sendRequest');

    cy.get('app-popup-message').should('exist');
  });

  it('Can reset password if requestId is valid', () => {
    const email = 'jacob@test.dk';
    cy.intercept('GET', 'api/v2/internal/users/password-reset/anIdentifier', {
      statusCode: 200,
      body: { email },
    }).as('getRequest');

    cy.visit('/reset-password/anIdentifier');

    cy.wait('@getRequest');

    cy.get('[data-cy="email"] input').should('have.value', email);

    const password = 'aBadPassword';

    cy.getByDataCy('password').type(password);
    cy.getByDataCy('confirm-password').type(password);

    cy.intercept('POST', 'api/v2/internal/users/password-reset/anIdentifier', (req) => {
      expect(req.body).to.have.property('password', password);

      req.reply({ statusCode: 204, body: {} });
    }).as('resetPassword');

    cy.getByDataCy('reset-password-button').click();

    cy.wait('@resetPassword');

    cy.get('app-popup-message').should('exist');
  });

  it('Can not reset password if requestId is invalid', () => {
    cy.intercept('GET', 'api/v2/internal/users/password-reset/nonExistantId', {
      statusCode: 404,
      body: {},
    }).as('getRequest');

    cy.visit('/reset-password/nonExistantId');

    cy.wait('@getRequest');

    cy.getByDataCy('non-existant-id-text').should('exist');
    cy.getByDataCy('reset-password-button').should('not.exist');
  });

  it('Can not reset password if passwords do not match', () => {
    const password = 'aBadPassword';
    const repeatPassword = 'aBadPassword1';

    cy.intercept('GET', 'api/v2/internal/users/password-reset/anIdentifier', {
      statusCode: 200,
      body: { email: 'jacob@test.dk' },
    }).as('getRequest');

    cy.visit('/reset-password/anIdentifier');

    cy.wait('@getRequest');

    cy.getByDataCy('password').type(password);
    cy.getByDataCy('confirm-password').type(repeatPassword);

    cy.getByDataCy('reset-password-button').get('input').should('be.disabled');
  });
});
