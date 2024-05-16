import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatestWith } from 'rxjs';
import { APIIdentityNamePairResponseDTO, APIUpdateDataProcessingRegistrationRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { optionalNewDate } from 'src/app/shared/helpers/date.helpers';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import {
  YesNoIrrelevantOptions,
  mapToYesNoIrrelevantEnum,
  yesNoIrrelevantOptions,
} from 'src/app/shared/models/yes-no-irrelevant.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import {
  selectDataProcessing,
  selectDataProcessingHasModifyPermissions,
} from 'src/app/store/data-processing/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';

@Component({
  selector: 'app-data-processing-frontpage',
  templateUrl: './data-processing-frontpage.component.html',
  styleUrl: './data-processing-frontpage.component.scss',
})
export class DataProcessingFrontpageComponent extends BaseComponent implements OnInit {
  public readonly basisForTransferTypes$ = this.store.select(
    selectRegularOptionTypes('data-processing-basis-for-transfer-types')
  );
  public readonly countryTypes$ = this.store.select(selectRegularOptionTypes('data-processing-country-types'));
  public readonly dataResponsibleTypes$ = this.store.select(
    selectRegularOptionTypes('data-processing-data-responsible-types')
  );

  public readonly yesNoIrrelevantOptions = yesNoIrrelevantOptions;

  public readonly frontpageFormGroup = new FormGroup({
    name: new FormControl<string>({ value: '', disabled: true }, Validators.required),
    status: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    lastChangedBy: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    lastChangedAt: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    dataResponsible: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    dataResponsibleRemarks: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    agreementConcluded: new FormControl<YesNoIrrelevantOptions | undefined>({ value: undefined, disabled: true }),
    agreementConclusionDate: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    agreementRemarks: new FormControl<string | undefined>({ value: undefined, disabled: true }),
  });

  constructor(private store: Store, private notificationService: NotificationService) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('data-processing-basis-for-transfer-types'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('data-processing-country-types'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('data-processing-data-responsible-types'));

    this.subscriptions.add(
      this.store
        .select(selectDataProcessing)
        .pipe(filterNullish(), combineLatestWith(this.store.select(selectDataProcessingHasModifyPermissions)))
        .subscribe(([dpr, hasModifyPermission]) => {
          const isActiveBaseText = 'Databehandlingen er';
          this.frontpageFormGroup.patchValue({
            name: dpr.name,
            status: dpr.general.valid ? `${isActiveBaseText} aktiv` : `${isActiveBaseText} inaktiv`,
            lastChangedBy: dpr.lastModifiedBy.name,
            lastChangedAt: optionalNewDate(dpr.lastModified),
            dataResponsible: dpr.general.dataResponsible,
            dataResponsibleRemarks: dpr.general.dataResponsibleRemark,
            agreementConcluded: mapToYesNoIrrelevantEnum(dpr.general.isAgreementConcluded),
            agreementConclusionDate: optionalNewDate(dpr.general.agreementConcludedAt),
            agreementRemarks: dpr.general.isAgreementConcludedRemark,
          });

          if (hasModifyPermission) {
            this.frontpageFormGroup.enable();
          }

          this.frontpageFormGroup.controls.status.disable();
          this.frontpageFormGroup.controls.lastChangedAt.disable();
          this.frontpageFormGroup.controls.lastChangedBy.disable();
        })
    );
  }
  public patchFrontPage(
    frontpage: APIUpdateDataProcessingRegistrationRequestDTO,
    valueChange?: ValidatedValueChange<unknown>
  ) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.store.dispatch(DataProcessingActions.patchDataProcessing(frontpage));
    }
  }

  public patchName(value: string | undefined, valueChange?: ValidatedValueChange<unknown>) {
    if (!value) {
      return;
    }

    this.patchFrontPage({ name: value }, valueChange);
  }
}
