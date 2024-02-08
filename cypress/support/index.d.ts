/* eslint-disable @typescript-eslint/no-explicit-any */
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
     * Get dropdown by cy selector and optionally set value.
     */
    dropdownByCy(dropdownCySelector: string, value?: string, force?: boolean): Chainable<Subject>;

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

    /**
     * Clears the input if it contains any text
     * @param inputText Input text
     */
    clearInputText(inputText: string): Chainable<Subject>;

    /**
     *
     * @param requestAlias Alias of the request
     * @param propertyPath Path to the property (e.g. request.body.testArray)
     * @param verifyMethod Method used to verify that request is correct
     * @param expectedObject Object that should be included in the request
     */
    verifyRequestUsingProvidedMethod(
      requestAlias: string,
      propertyPath: string,
      verifyMethod: (actual: any, expectedObject: any) => boolean,
      expectedObject: any
    ): Chainable<Subject>;

    /**
     *
     * @param requestAlias Alias of the request e.g. '@usagePatch'
     * @param propertyPath Path to the property to be compared(e.g. request.body.testArray)
     * @param expectedObject Expected object in the request body
     */
    verifyRequestUsingDeepEq(requestAlias: string, propertyPath: string, expectedObject: any): Chainable<Subject>;

    /**
     *
     * @param url Endpoint url
     * @param fixturePath Path to the fixture file
     * @param alias Alias of the request
     */
    interceptPatch(url: string, fixturePath: string, alias: string): Chainable<Subject>;

    /**
     * @param method HTTP Method of the request e.g. POST, PATCH, DELETE
     * @param url Request url
     * @param fixture Fixture object, e.g. {fixture: 'fixture.json'} or {}
     * @param message Message shown in the confirmation dialog
     * @param title Title of the confirmation dialog
     */
    verifyYesNoConfirmationDialogAndConfirm(
      method: string,
      url: string,
      fixture?: object,
      message?: string,
      title?: string
    ): Chainable<Subject>;

    /**
     * Gets an html element by it's data-cy attribute
     * @param dataCy data-cy attribute value
     */
    getByDataCy(dataCy: string): Chainable<Subject>;
  }
}
