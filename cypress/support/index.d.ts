/// <reference types="cypress" />

declare namespace Cypress {
  // Commands
  interface Chainable<Subject> {
    /**
     * Setup initial intercepters and go to path.
     */
    setup(
      authenticate?: boolean,
      urlPath?: string,
      uiCustomizationFixturePath?: string,
      interceptAlerts?: boolean
    ): void;

    /**
     * Login using form.
     */
    login(authorizeFixturePath: string): void;

    /**
     * Require all api request to be intercepted.
     */
    requireIntercept(): void;

    /**
     * Get input.
     */
    input(inputName: string): Chainable<Subject>;

    /**
     * Get input.
     */
    inputByCy(inputSelector: string): Chainable<Subject>;

    /**
     * Get dropdown and optionally set value.
     */
    dropdown(dropdownName: string, value?: string, force?: boolean): Chainable<Subject>;

    /**
     * Get dropdown by data-cy selector and optionally set value.
     */
    dropdownByCy(dropdownCySelector: string, value?: string, force?: boolean): Chainable<Subject>;

    /**
     * Get datepicker and optionally set value.
     */
    datepicker(name: string, value?: string): Chainable<Subject>;

    /**
     * Get datepicker by data-cy selector and optionally set value.
     */
    datepickerByCy(selector: string, value?: string, force?: boolean): Chainable<Subject>;

    /**
     * Get textarea by data-cy selector.
     */
    textareaByCy(selector: string): Chainable<Subject>;

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

    /**
     * Verifies that the external references are shown
     */
    testCanShowExternalReferences(): Chainable<Subject>;

    /**
     * Test the external eference can save and edit as expected
     * @param shouldMasterDataBeDisabled
     * @param shouldSelectMasterData
     * @param isEdit
     * @param requestUrl
     * @param responseBodyPath
     * @param rowTitle
     */
    externalReferencesSaveAndValidate(
      shouldMasterDataBeDisabled: boolean,
      shouldSelectMasterData: boolean,
      isEdit: boolean,
      requestUrl: string,
      responseBodyPath: string,
      rowTitle?: string
    ): Chainable<Subject>;

    /**
     * Set tinymce editor content
     * @param content String content to set
     */
    setTinyMceContent(dataCySelector: string, content: string): Chainable<Subject>;

    /**
     * Get an iframe if only one found on the page
     */
    getIframe(): Chainable<Subject>;

    /**
     * Clear an input and insert new content.
     * @param dataCySelector: selector for target element
     * @param newContent: the new content to be entered
     */
    replaceTextByDataCy(dataCySelector: string, newContent: string): Chainable<Subject>;

    /**
     * Check if the input inside a textbox is enabled/disabled
     * @param dataCySelector: selector for target element
     * @param shouldBeEnabled: true if input is expected to be enabled, false otherwise
     */
    confirmTextboxStateByDataCy(dataCySelector: string, shouldBeEnabled: boolean): Chainable<Subject>;

    /**
     * Hover on an element
     * @param dataCySelector: selector for target element
     */
    hoverByDataCy(dataCySelector: string): Chainable<Subject>;
  }

  // Intercept commands
  interface Chainable<Subject> {
    /**
     * Setup base contract intercepts, commmon for all contract sub-pages.
     */
    setupContractIntercepts(): void;
    /**
     * Setup base data processing intercepts, commmon for all contract sub-pages.
     */
    setupDataProcessingIntercepts(): void;
    /**
     * Setup base it system intercepts, commmon for all it system sub-pages.
     */
    setupItSystemCatalogIntercepts(): void;
    /**
     * Setup base it system usage intercepts, commmon for all organization sub-pages.
     */
    setupItSystemUsageIntercepts(): void;
  }
}
