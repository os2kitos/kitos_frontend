/// <reference types="cypress" />

import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';

it('Checkbox has correct text and emits correct values', () => {
  const onChangeSpy = cy.spy().as('onChange');
  const buttonText = 'Checkbox text';
  cy.mount(CheckboxComponent, {
    componentProperties: {
      text: buttonText,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      valueChange: { emit: onChangeSpy } as any,
    },
  });
  cy.getByDataCy('checkbox-input').click();
  cy.get('@onChange').should('have.been.calledWith', true);
  cy.getByDataCy('checkbox-input').click();
  cy.get('@onChange').should('have.been.calledWith', false);

  cy.contains(buttonText);
});
