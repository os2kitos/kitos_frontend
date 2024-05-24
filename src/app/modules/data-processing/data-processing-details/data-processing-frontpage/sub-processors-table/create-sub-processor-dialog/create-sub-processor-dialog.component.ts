import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, first } from 'rxjs';
import {
  APIDataProcessingRegistrationGeneralDataResponseDTO,
  APIDataProcessorRegistrationSubDataProcessorResponseDTO,
  APIIdentityNamePairResponseDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { YesNoOptions, mapToYesNoEnum, yesNoOptions } from 'src/app/shared/models/yes-no.model';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { selectDataProcessingSubProcessors } from 'src/app/store/data-processing/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { CountryCreateDialogComponent } from '../../third-countries-table/country-create-dialog/country-create-dialog.component';
import { CreateSubProcessorDialogComponentStore } from './create-sub-processor-dialog.component-store';

@Component({
  selector: 'app-create-sub-processor-dialog',
  templateUrl: './create-sub-processor-dialog.component.html',
  styleUrl: './create-sub-processor-dialog.component.scss',
  providers: [CreateSubProcessorDialogComponentStore],
})
export class CreateSubProcessorDialogComponent extends BaseComponent implements OnInit {
  @Input() public subprocessor: APIDataProcessorRegistrationSubDataProcessorResponseDTO | undefined;

  public readonly organizations$ = this.componentStore.organizations$;
  public readonly countryTypes$ = this.store.select(selectRegularOptionTypes('data-processing-country-types'));
  public readonly basisForTransferTypes$ = this.store.select(
    selectRegularOptionTypes('data-processing-basis-for-transfer-types')
  );

  public readonly yesNoOptions = yesNoOptions;

  public readonly subprocessorsFormGroup = new FormGroup({
    subprocessor: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined, [Validators.required]),
    basisForTransfer: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    transferToInsecureCountry: new FormControl<YesNoOptions | undefined>({ value: undefined, disabled: true }),
    insecureThirdCountrySubjectToDataProcessing: new FormControl<APIIdentityNamePairResponseDTO | undefined>({
      value: undefined,
      disabled: true,
    }),
  });

  constructor(
    private store: Store,
    private dialog: MatDialogRef<CountryCreateDialogComponent>,
    private actions$: Actions,
    private componentStore: CreateSubProcessorDialogComponentStore
  ) {
    super();
  }

  public isBusy = false;
  public title = '';
  public isEdit = false;

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('data-processing-country-types'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('data-processing-basis-for-transfer-types'));

    if (this.subprocessor !== undefined) {
      this.subprocessorsFormGroup.patchValue({
        subprocessor: this.subprocessor.dataProcessorOrganization,
        basisForTransfer: this.subprocessor.basisForTransfer,
        transferToInsecureCountry: mapToYesNoEnum(this.subprocessor.transferToInsecureThirdCountry),
        insecureThirdCountrySubjectToDataProcessing: this.subprocessor.insecureThirdCountrySubjectToDataProcessing,
      });
      this.subprocessorsFormGroup.enable();
      this.checkTransferToInsecureCountry(this.subprocessorsFormGroup.controls.transferToInsecureCountry.value?.value);

      this.title = $localize`Rediger underdatabehandler`;
      this.isEdit = true;
    } else {
      this.title = $localize`Opret underdatabehandler`;
    }

    this.subscriptions.add(
      this.actions$.pipe(ofType(DataProcessingActions.patchDataProcessingSuccess)).subscribe(() => {
        this.onClose();
      })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(DataProcessingActions.patchDataProcessingError)).subscribe(() => {
        this.isBusy = false;
      })
    );

    this.subscriptions.add(
      this.subprocessorsFormGroup.statusChanges.pipe(distinctUntilChanged()).subscribe((status) => {
        if (status === 'VALID') {
          this.subprocessorsFormGroup.enable();
          this.checkTransferToInsecureCountry(
            this.subprocessorsFormGroup.controls.transferToInsecureCountry.value?.value
          );
        } else {
          this.subprocessorsFormGroup.disable();
          this.subprocessorsFormGroup.controls.subprocessor.enable();
        }
      })
    );

    this.subscriptions.add(
      this.subprocessorsFormGroup.controls.transferToInsecureCountry.valueChanges.subscribe((value) => {
        this.checkTransferToInsecureCountry(value?.value);
      })
    );
  }

  public onSubmit() {
    if (this.subprocessorsFormGroup.invalid || !this.subprocessorsFormGroup.value.subprocessor) {
      return;
    }
    this.isBusy = true;

    const request = {
      dataProcessorOrganizationUuid: this.subprocessorsFormGroup.controls.subprocessor.value!.uuid,
      basisForTransferUuid: this.subprocessorsFormGroup.controls.basisForTransfer.value?.uuid,
      transferToInsecureThirdCountry: this.subprocessorsFormGroup.controls.transferToInsecureCountry.value?.value,
      insecureThirdCountrySubjectToDataProcessingUuid:
        this.subprocessorsFormGroup.controls.insecureThirdCountrySubjectToDataProcessing.value?.uuid,
    };

    this.store
      .select(selectDataProcessingSubProcessors)
      .pipe(first())
      .subscribe((subprocessors) => {
        if (this.isEdit) {
          this.store.dispatch(DataProcessingActions.patchDataProcessingSubProcessor(request, subprocessors));
          return;
        }
        this.store.dispatch(DataProcessingActions.addDataProcessingSubProcessor(request, subprocessors));
      });
  }

  public onClose() {
    this.dialog.close();
  }

  public searchOrganizations(search?: string) {
    this.componentStore.getOrganizations(search);
  }

  private checkTransferToInsecureCountry(
    value: APIDataProcessingRegistrationGeneralDataResponseDTO.TransferToInsecureThirdCountriesEnum | undefined
  ) {
    if (value === 'Yes') {
      this.subprocessorsFormGroup.controls.insecureThirdCountrySubjectToDataProcessing.enable();
    } else {
      this.subprocessorsFormGroup.controls.insecureThirdCountrySubjectToDataProcessing.setValue(undefined);
      this.subprocessorsFormGroup.controls.insecureThirdCountrySubjectToDataProcessing.disable();
    }
  }
}
