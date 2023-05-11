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
     * Get input.
     */
    input(inputName: string): Chainable<Subject>;

    /**
     * Get dropdown and optionally set value.
     */
    dropdown(dropdownName: string, value?: string, force?: boolean): Chainable<Subject>;

    /**
     * Get datepicker and optionally set value.
     */
    datepicker(name: string, value?: string): Chainable<Subject>;

    /**
     * In the context of a standard details page, navigate to a specific sub page
     * @param pageName The menu item text shown to the user
     */
    navigateToDetailsSubPage(pageName: string): Chainable<Subject>;

    /**
     * Select and confirms through the means of a modal using the app-dialog to display content
     * @param message Expected message in the confirmation dialog
     * @param confirmationButtonText Optionally define the text of the confirm button. Otherwise "Ja" is expected
     * @param title Optionally define the title of the confirmation modal. Otherwise "Bekræft handling" is expected
     */
    confirmAction(message: string, confirmationButtonText?: string, title?: string): Chainable<Subject>;

    /**
     * Selects the parent with the provided selector
     * @param title Title of the card
     */
    getCardWithTitle(title: string): Chainable<Subject>;

    /**
     * Selects the parent with the provided selector
     * @param elementContent Name of an element inside of a row
     */
    getRowForElementContent(elementContent: string): Chainable<Subject>;

    /**
     * Verifies the href value of an External reference
     * @param name Name of the External reference Title
     * @param url External reference url
     */
    verifyExternalReferenceHrefValue(name: string, url: string): Chainable<Subject>;

    /**
     * Verifies the tooltip text
     * @param text Tooltip text
     */
    verifyTooltipText(text: string): Chainable<Subject>;
  }
}
