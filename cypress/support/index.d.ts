/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Setup initial intercepters and go to path.
     */
    setup(authenticate?: boolean, path?: string): void;

    /**
     * Login using form.
     */
    login(): void;

    /**
     * Require all api request to be intercepted.
     */
    requireIntercept(): void;

    /**
     * Check Kendo floating label input value.
     */
    checkInput(inputName: string, expectedValue: string): void;
  }
}
