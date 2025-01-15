import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatestWith, map } from 'rxjs';
import { APIIdentityNamePairResponseDTO, APIUpdateDataProcessingRegistrationRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { optionalNewDate } from 'src/app/shared/helpers/date.helpers';
import { toBulletPoints } from 'src/app/shared/helpers/string.helpers';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import {
  YesNoIrrelevantEnum,
  YesNoIrrelevantOptions,
  mapToYesNoIrrelevantEnum,
  yesNoIrrelevantOptions,
} from 'src/app/shared/models/yes-no-irrelevant.model';
import { YesNoEnum, yesNoOptions } from 'src/app/shared/models/yes-no.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import {
  selectDataProcessing,
  selectDataProcessingHasModifyPermissions,
  selectDataProcessingIsValid,
} from 'src/app/store/data-processing/selectors';
import {
  selectDprEnableAgreementConcluded,
  selectDprEnableDataResponsible,
  selectDprEnableLastChangedAt,
  selectDprEnableLastChangedBy,
  selectDprEnableProcessors,
  selectDprEnableStatus,
  selectDprEnableSubProcessors,
  selectDprEnableTransferBasis,
} from 'src/app/store/organization/ui-module-customization/selectors';
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
  public readonly dataResponsibleTypes$ = this.store.select(
    selectRegularOptionTypes('data-processing-data-responsible-types')
  );

  public readonly yesNoIrrelevantOptions = yesNoIrrelevantOptions;
  public readonly yesNoOptions = yesNoOptions.map((option) => ({ id: option.value, label: option.name }));

  public readonly agreementConcludedValue$ = new BehaviorSubject<YesNoIrrelevantEnum | undefined>(undefined);
  public readonly isAgreementConcluded$ = this.agreementConcludedValue$.pipe(map((value) => value === 'Yes'));

  public readonly hasSubprocessorsValue$ = new BehaviorSubject<YesNoEnum | undefined>(undefined);
  public readonly isHasSubprocessorsTrue$ = this.hasSubprocessorsValue$.pipe(map((value) => value === 'Yes'));

  public readonly dataProcessing$ = this.store.select(selectDataProcessing);
  public readonly dprInactiveMessage$ = this.dataProcessing$.pipe(
    map((dpr) => {
      if (dpr?.general.valid) return undefined;
      const reasonsForInactivity = [dpr?.general.valid ? undefined : $localize`Den markerede kontrakt er inaktiv`];

      return $localize`Følgende gør databehandlingen inaktiv: ` + '\n' + toBulletPoints(reasonsForInactivity);
    })
  );
  public readonly isValid$ = this.store.select(selectDataProcessingIsValid);

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

  public readonly transferBasisFormGroup = new FormGroup({
    transferBasis: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
  });

  public readonly dataResponsibleEnabled$ = this.store.select(selectDprEnableDataResponsible);
  public readonly statusEnabled$ = this.store.select(selectDprEnableStatus);
  public readonly lastChangedByEnabled$ = this.store.select(selectDprEnableLastChangedBy);
  public readonly lastChangedAtEnabled$ = this.store.select(selectDprEnableLastChangedAt);
  public readonly agreementConcludedEnabled$ = this.store.select(selectDprEnableAgreementConcluded);
  public readonly transferBasisEnabled$ = this.store.select(selectDprEnableTransferBasis);
  public readonly processorsEnabled$ = this.store.select(selectDprEnableProcessors);
  public readonly subProcessorsEnabled$ = this.store.select(selectDprEnableSubProcessors);

  constructor(private store: Store, private notificationService: NotificationService) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('data-processing-basis-for-transfer-types'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('data-processing-data-responsible-types'));

    this.subscriptions.add(
      this.dataProcessing$
        .pipe(filterNullish(), combineLatestWith(this.store.select(selectDataProcessingHasModifyPermissions)))
        .subscribe(([dpr, hasModifyPermission]) => {
          const agreementConcludedValue = mapToYesNoIrrelevantEnum(dpr.general.isAgreementConcluded);
          this.frontpageFormGroup.patchValue({
            name: dpr.name,
            status: dpr.general.valid ? `Aktiv` : `Inaktiv`,
            lastChangedBy: dpr.lastModifiedBy.name,
            lastChangedAt: optionalNewDate(dpr.lastModified),
            dataResponsible: dpr.general.dataResponsible,
            dataResponsibleRemarks: dpr.general.dataResponsibleRemark,
            agreementConcluded: agreementConcludedValue,
            agreementConclusionDate: optionalNewDate(dpr.general.agreementConcludedAt),
            agreementRemarks: dpr.general.isAgreementConcludedRemark,
          });

          this.transferBasisFormGroup.patchValue({
            transferBasis: dpr.general.basisForTransfer,
          });

          if (hasModifyPermission) {
            this.frontpageFormGroup.enable();
            this.transferBasisFormGroup.enable();
            this.agreementConcludedValue$.next(agreementConcludedValue?.value as YesNoIrrelevantEnum);
          } else {
            this.frontpageFormGroup.disable();
            this.transferBasisFormGroup.disable();
          }

          this.frontpageFormGroup.controls.status.disable();
          this.frontpageFormGroup.controls.lastChangedAt.disable();
          this.frontpageFormGroup.controls.lastChangedBy.disable();
        })
    );

    this.subscriptions.add(
      this.isAgreementConcluded$.subscribe((isAgreementConcluded) => {
        if (isAgreementConcluded) {
          this.frontpageFormGroup.controls.agreementConclusionDate.enable();
        } else {
          this.frontpageFormGroup.controls.agreementConclusionDate.disable();
        }
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

  public patchAgreementConcluded(value: YesNoIrrelevantEnum | undefined) {
    this.agreementConcludedValue$.next(value);
    this.patchFrontPage({ general: { isAgreementConcluded: value } });
  }
}
