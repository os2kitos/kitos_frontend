/// <reference types="cypress" />

import { FormControl, FormGroup } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { DatePickerComponent } from '../../shared/components/datepicker/datepicker.component';

describe('Datepicker keyboard entry with date bounds', () => {
  it('allows typing and correcting a date with a maximum of 26-11-2026', () => {
    const formGroup = new FormGroup({ date: new FormControl<Date | undefined>(undefined) });
    cy.mount(DatePickerComponent, {
      imports: [MatIconTestingModule],
      componentProperties: {
        formGroup,
        formName: 'date',
        minDate: new Date(2026, 9, 26),
        maxDate: new Date(2026, 10, 26),
      },
    });
    cy.get('input').type('01-11-2026').should('have.value', '01-11-2026').blur();
    cy.then(() => expect(formGroup.controls.date.valid).to.equal(true));
    cy.then(() => formGroup.controls.date.setValue(undefined));
    cy.get('input').type('02-11-2026').should('have.value', '02-11-2026').blur();
    cy.get('input').clear().type('27-11-2026').blur();
    cy.then(() => expect(formGroup.controls.date.hasError('matDatepickerMax')).to.equal(true));
    cy.get('input').clear().type('26-11-2026').should('have.value', '26-11-2026').blur();
    cy.then(() => expect(formGroup.controls.date.valid).to.equal(true));
  });
});
