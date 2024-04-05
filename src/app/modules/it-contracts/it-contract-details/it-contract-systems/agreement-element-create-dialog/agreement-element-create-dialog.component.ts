import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-agreement-element-create-dialog',
  templateUrl: './agreement-element-create-dialog.component.html',
  styleUrl: './agreement-element-create-dialog.component.scss',
})
export class AgreementElementCreateDialogComponent extends BaseComponent implements OnInit {
  public readonly agreementElementTypes$ = this.store
    .select(selectRegularOptionTypes('it-contract-agreement-element-types'))
    .pipe(
      filterNullish(),
      combineLatestWith(this.store.select(selectItContractSystemAgreementElements)),
      map(([agreementElementTypes, existingAgreementElements]) => {
        if (!existingAgreementElements || existingAgreementElements.length == 0) return agreementElementTypes;

        return agreementElementTypes.filter((type: APIRegularOptionResponseDTO) =>
          existingAgreementElements?.some((element) => element.uuid !== type.uuid)
        );
      })
    );

  public agreementElementForm = new FormGroup({
    agreementElement: new FormControl<APIRegularOptionResponseDTO | undefined>(undefined, Validators.required),
  });

  public isBusy = false;

  constructor(
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<AgreementElementCreateDialogComponent>,
    private readonly actions$: Actions
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
