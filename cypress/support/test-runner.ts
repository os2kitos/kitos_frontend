export class TestRunner {
  private setupFn: () => void;
  constructor(setupFunction: () => void) {
    this.setupFn = setupFunction;
  }

  public runTestWithSetup(testTitle: string, testFn: () => void) {
    this.runTest(testTitle, this.setupFn, testFn);
  }

  public runTest = (testTitle: string, setupFn: () => void, testFn: () => void) => {
    cy.log(`**** SETTING UP TEST: ${testTitle}****`);
    setupFn();
    cy.log(`**** RUNNING TEST: ${testTitle}****`);
    testFn();
  };
}
