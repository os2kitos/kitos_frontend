/// <reference types="cypress" />

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TextAreaComponent } from '../../shared/components/textarea/textarea.component';
import { TextBoxComponent } from '../../shared/components/textbox/textbox.component';

for (const [name, component, selector] of [
  ['textarea', TextAreaComponent, 'textarea'],
  ['textbox', TextBoxComponent, 'input'],
] as const) {
  describe(name + ' form length restrictions', () => {
    it('shows the form error and does not autosave an overlong value', () => {
      const formGroup = new FormGroup({ purpose: new FormControl('', Validators.maxLength(200)) });
      const onChange = cy.spy().as('onChange');
      const onValidatedChange = cy.spy().as('onValidatedChange');
      cy.mount<TextAreaComponent | TextBoxComponent>(component, {
        componentProperties: {
          formGroup,
          formName: 'purpose',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          valueChange: { emit: onChange } as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          validatedValueChange: { emit: onValidatedChange } as any,
        },
      });

      cy.get(selector).type('a'.repeat(201), { delay: 0 }).blur();
      cy.then(() => expect(formGroup.controls.purpose.hasError('maxlength')).to.equal(true));
      cy.get('mat-error').should('contain.text', '200');
      cy.get('@onChange').should('not.have.been.called');
      cy.get('@onValidatedChange').should('have.been.calledWithMatch', { valid: false });

      cy.get(selector).focus().type('{backspace}').blur();
      cy.then(() => expect(formGroup.valid).to.equal(true));
      cy.get('@onChange').should('have.been.calledWith', 'a'.repeat(200));
    });

    it('validates programmatic values and permits clearing an optional field', () => {
      const control = new FormControl('', Validators.maxLength(200));
      cy.mount<TextAreaComponent | TextBoxComponent>(component, {
        componentProperties: { formGroup: new FormGroup({ purpose: control }), formName: 'purpose' },
      });
      cy.then(() => {
        control.setValue('b'.repeat(201));
        expect(control.hasError('maxlength')).to.equal(true);
        control.setValue('b'.repeat(200));
        expect(control.valid).to.equal(true);
        control.setValue('');
        expect(control.valid).to.equal(true);
      });
    });
  });
}
