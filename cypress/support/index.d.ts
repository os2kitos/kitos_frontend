/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Setup initial intercepters and go to root.
     */
    setup(authenticate?: boolean): void;

    /**
     * Login using form.
     */
    login(): void;
  }
}
