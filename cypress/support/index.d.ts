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
     * Get Kendo input.
     */
    input(inputName: string): Chainable<Subject>;

    /**
     * Get Kendo dropdown and optionally set value.
     */
    dropdown(dropdownName: string, value?: string): Chainable<Subject>;

    /**
     * In the context of a standard details page, navigate to a specific sub page
     * @param pageName The menu item text shown to the user
     */
    navigateToDetailsSubPage(pageName: string): Chainable<Subject>;
  }
}
