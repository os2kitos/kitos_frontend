import { MatDialogRef } from '@angular/material/dialog';
import { Actions } from '@ngrx/effects';
import { of, Subject } from 'rxjs';
import {
  BulkActionDialogComponent,
  BulkActionOption,
} from 'src/app/shared/components/dialogs/bulk-action-dialog/bulk-action-dialog.component';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { EntitySelectionService } from 'src/app/shared/services/entity-selector-service';
import { ITContractActions } from 'src/app/store/it-contract/actions';

describe('BulkActionDialog', () => {
  const exampleContract1: BulkActionOption = {
    id: '1',
    name: 'Contract 1',
  };
  const exampleContract2: BulkActionOption = {
    id: '2',
    name: 'Contract 2',
    secondaryName: 'Contract 1',
  };

  it('Can select and deselect all', () => {
    mountComponent(exampleContract1, exampleContract2);

    validateEachOption(false);
    cy.getByDataCy('select-all-bulk-action-button').click();
    validateEachOption(true);
    cy.getByDataCy('deselect-all-bulk-action-button').click();
    validateEachOption(false);

    cy.getByDataCy('select-all-bulk-action-checkbox').click();
    validateEachOption(true);
    cy.getByDataCy('deselect-all-bulk-action-button').should('not.be.disabled');
    cy.getByDataCy('select-all-bulk-action-checkbox').click();
    validateEachOption(false);
    cy.getByDataCy('select-all-bulk-action-button').should('not.be.disabled');

    cy.getByDataCy('bulk-action-checkbox').each(($checkbox) => {
      cy.wrap($checkbox).click();
    });

    cy.getByDataCy('deselect-all-bulk-action-button').should('not.be.disabled');
    cy.getByDataCy('select-all-bulk-action-button').find('button').should('be.disabled');
    cy.getByDataCy('select-all-bulk-action-checkbox').find('input[type="checkbox"]').should('be.checked');
  });
});

function validateEachOption(shouldBeSelected: boolean) {
  cy.getByDataCy('bulk-action-checkbox').each(($checkbox) => {
    if (shouldBeSelected) {
      cy.wrap($checkbox).find('input[type="checkbox"]').should('be.checked');
    } else {
      cy.wrap($checkbox).find('input[type="checkbox"]').should('not.be.checked');
    }
  });
}

function mountComponent(exampleContract1: BulkActionOption, exampleContract2: BulkActionOption) {
  const actions$ = new Subject();
  cy.mount(BulkActionDialogComponent, {
    componentProperties: {
      sections: [
        {
          options$: of([exampleContract1, exampleContract2]),
          entityType: 'it-contract',
          title: 'Test',
          primaryColumnTitle: 'Primary',
          secondaryColumnTitle: 'Secondary',
        },
      ],
      actionButtons: [{ text: 'Confirm test', color: 'secondary', buttonStyle: 'secondary', callback: () => {} }],
      dropdownDisabledUuids$: of([]),
      dropdownType: 'it-contract',
      allowEmptyDropdownSelection: true,
      successActionTypes: [ITContractActions.bulkAddItContractRoleSuccess],
      errorActionTypes: [ITContractActions.bulkAddItContractRoleError],
    },
    providers: [
      { provide: MatDialogRef, useValue: { close: cy.spy().as('close') } },
      EntitySelectionService<BulkActionOption, RegistrationEntityTypes>,
      { provide: Actions, useValue: actions$ },
    ],
  });
}
