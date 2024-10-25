import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { isNumber } from 'lodash';
import { combineLatestWith, map } from 'rxjs';
import {
  APIContractAgreementPeriodDataWriteRequestDTO,
  APIContractTerminationDataWriteRequestDTO,
  APIIdentityNamePairResponseDTO,
  APIUpdateContractRequestDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { optionalNewDate } from 'src/app/shared/helpers/date.helpers';
import {
  YearSegmentChoice,
  mapYearSegmentChoice,
  yearSegmentChoiceOptions,
} from 'src/app/shared/models/it-contract/year-segment-choice';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { selectContract, selectItContractHasModifyPermissions } from 'src/app/store/it-contract/selectors';
import { selectDataProcessingUIModuleConfigEnabledFieldAgreementDeadlines, selectDataProcessingUIModuleConfigEnabledFieldTermination } from 'src/app/store/organization/ui-module-customization/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';

@Component({
  selector: 'app-it-contract-deadlines',
  templateUrl: './it-contract-deadlines.component.html',
  styleUrl: './it-contract-deadlines.component.scss',
})
export class ItContractDeadlinesComponent extends BaseComponent implements OnInit {
  private readonly deadlineDurationYearsUpperLimit = 100;

  public readonly extendTypes$ = this.store.select(selectRegularOptionTypes('it-contract-extend-types'));
  public readonly terminationPeriodTypes$ = this.store
    .select(selectRegularOptionTypes('it-contract-termination-period-types'))
    .pipe(
      filterNullish(),
      map((types) => types.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })))
    );
  public readonly yearSegmentChoices = yearSegmentChoiceOptions;

  public deadlinesFormGroup = new FormGroup({
    durationYears: new FormControl<number | undefined>(
      { value: undefined, disabled: true },
      Validators.max(this.deadlineDurationYearsUpperLimit)
    ),
    durationMonths: new FormControl<number | undefined>({ value: undefined, disabled: true }),
    isContinous: new FormControl<boolean | undefined>({ value: undefined, disabled: true }),
    extensionOptions: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    extensionOptionUsed: new FormControl<number>({ value: 0, disabled: true }, { validators: [Validators.required] }),
    irrevocableUntil: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
  });

  public terminationsFormGroup = new FormGroup({
    terminatedAt: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    noticePeriodMonths: new FormControl<APIIdentityNamePairResponseDTO | undefined>({
      value: undefined,
      disabled: true,
    }),
    noticePeriodExtendsCurrent: new FormControl<YearSegmentChoice | undefined>({ value: undefined, disabled: true }),
    noticeByEndOf: new FormControl<YearSegmentChoice | undefined>({ value: undefined, disabled: true }),
  });

  public readonly agreementDeadlinesEnabled$ = this.store.select(selectDataProcessingUIModuleConfigEnabledFieldAgreementDeadlines);
  public readonly terminationEnabled$ = this.store.select(selectDataProcessingUIModuleConfigEnabledFieldTermination);

  constructor(private readonly store: Store, private readonly notificationService: NotificationService) {
    super();
  }

  public ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract-extend-types'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract-termination-period-types'));

    this.store
      .select(selectContract)
      .pipe(filterNullish(), combineLatestWith(this.store.select(selectItContractHasModifyPermissions)))
      .subscribe(([contract, hasModifyPermission]) => {
        const isContinous = contract.agreementPeriod?.isContinuous;
        this.deadlinesFormGroup.patchValue({
          durationYears: contract.agreementPeriod?.durationYears,
          durationMonths: contract.agreementPeriod?.durationMonths,
          isContinous: isContinous,
          extensionOptions: contract.agreementPeriod?.extensionOptions,
          extensionOptionUsed: contract.agreementPeriod?.extensionOptionsUsed,
          irrevocableUntil: optionalNewDate(contract.agreementPeriod?.irrevocableUntil),
        });
        this.terminationsFormGroup.patchValue({
          terminatedAt: optionalNewDate(contract.termination?.terminatedAt),
          noticePeriodMonths: contract.termination?.terms?.noticePeriodMonths,
          noticePeriodExtendsCurrent: mapYearSegmentChoice(contract.termination?.terms?.noticePeriodExtendsCurrent),
          noticeByEndOf: mapYearSegmentChoice(contract.termination?.terms?.noticeByEndOf),
        });
        if (hasModifyPermission) {
          this.deadlinesFormGroup.enable();
          this.terminationsFormGroup.enable();

          if (isContinous) {
            this.deadlinesFormGroup.controls.durationYears.disable();
            this.deadlinesFormGroup.controls.durationMonths.disable();
          }
        }
      });
  }

  public patch(request: APIUpdateContractRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showInvalidFormField(valueChange.text);
    } else {
      this.store.dispatch(ITContractActions.patchITContract(request));
    }
  }

  public patchDurationYears(
    value: APIContractAgreementPeriodDataWriteRequestDTO,
    valueChange?: ValidatedValueChange<unknown>
  ): void {
    if (this.deadlinesFormGroup.controls.durationYears.valid) this.patchDeadlines(value, valueChange);
    else if (valueChange) this.notificationService.showInvalidFormField(valueChange.text);
  }

  public patchDeadlines(
    value: APIContractAgreementPeriodDataWriteRequestDTO,
    valueChange?: ValidatedValueChange<unknown>
  ): void {
    this.patch({ agreementPeriod: value }, valueChange);
  }

  public patchTermination(
    value: APIContractTerminationDataWriteRequestDTO,
    valueChange?: ValidatedValueChange<unknown>
  ): void {
    this.patch({ termination: value }, valueChange);
  }

  public patchIsContinous(isContinous: boolean | undefined, valueChange?: ValidatedValueChange<unknown>): void {
    //the below type is required in order to pass the '' as the null value for the duration fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let request: { isContinuous: boolean | undefined; durationYears?: any; durationMonths?: any } = {
      isContinuous: isContinous,
    };
    if (isContinous) {
      request = { ...request, durationYears: '', durationMonths: '' };
    }

    this.patchDeadlines(request, valueChange);
  }

  public patchExtensionOptionUsed(value: number | undefined, valueChange?: ValidatedValueChange<unknown>): void {
    if (value === undefined || !isNumber(value)) {
      this.notificationService.showError($localize`Ugyldig nummer`);
      return;
    }
    this.patchDeadlines({ extensionOptionsUsed: value }, valueChange);
  }

  public durationYearsPlaceholder() {
    return $localize`Indtast et heltal mellem 0 og ${this.deadlineDurationYearsUpperLimit}`;
  }
}
