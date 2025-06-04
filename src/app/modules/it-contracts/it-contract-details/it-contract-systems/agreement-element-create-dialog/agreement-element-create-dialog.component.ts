import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, map } from 'rxjs';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { selectItContractSystemAgreementElements } from 'src/app/store/it-contract/selectors';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { DialogComponent } from '../../../../../shared/components/dialogs/dialog/dialog.component';
import { StandardVerticalContentGridComponent } from '../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { DropdownComponent } from '../../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { DialogActionsComponent } from '../../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../../../../shared/components/buttons/button/button.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-agreement-element-create-dialog',
  templateUrl: './agreement-element-create-dialog.component.html',
  styleUrl: './agreement-element-create-dialog.component.scss',
  imports: [
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    DropdownComponent,
    DialogActionsComponent,
    ButtonComponent,
    AsyncPipe,
  ],
})
export class AgreementElementCreateDialogComponent extends BaseComponent implements OnInit {
  public readonly agreementElementTypes$ = this.store
    .select(selectRegularOptionTypes('it-contract-agreement-element-types'))
    .pipe(
      filterNullish(),
      combineLatestWith(
        this.store
          .select(selectItContractSystemAgreementElements)
          .pipe(map((elements) => elements?.map((element) => element.uuid))),
      ),
      map(([agreementElementTypes, existingAgreementElementUuids]) => {
        if (!existingAgreementElementUuids || existingAgreementElementUuids.length == 0) return agreementElementTypes;

        return agreementElementTypes.filter(
          (type: APIRegularOptionResponseDTO) => !existingAgreementElementUuids.includes(type.uuid),
        );
      }),
    );

  public agreementElementForm = new FormGroup({
    agreementElement: new FormControl<APIRegularOptionResponseDTO | undefined>(undefined, Validators.required),
  });

  public isBusy = false;

  constructor(
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<AgreementElementCreateDialogComponent>,
    private readonly actions$: Actions,
  ) {
    super();
  }

  ngOnInit(): void {
    this.actions$.pipe(ofType(ITContractActions.addITContractSystemAgreementElementSuccess)).subscribe(() => {
      this.dialogRef.close();
    });

    this.actions$.pipe(ofType(ITContractActions.addITContractSystemAgreementElementError)).subscribe(() => {
      this.isBusy = false;
    });
  }

  public save(): void {
    if (this.agreementElementForm.valid) {
      this.isBusy = true;
      const agreementElement = this.agreementElementForm.value.agreementElement;
      if (!agreementElement) {
        this.isBusy = false;
        return;
      }

      this.store.dispatch(ITContractActions.addITContractSystemAgreementElement(agreementElement));
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }
}
