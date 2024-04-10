import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
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
import { selectContract } from 'src/app/store/it-contract/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';

@Component({
  selector: 'app-it-contract-deadlines',
  templateUrl: './it-contract-deadlines.component.html',
  styleUrl: './it-contract-deadlines.component.scss',
})
export class ItContractDeadlinesComponent extends BaseComponent implements OnInit {
  public readonly extendTypes$ = this.store.select(selectRegularOptionTypes('it-contract-extend-types'));
  public readonly terminationPeriodTypes$ = this.store
    .select(selectRegularOptionTypes('it-contract-termination-period-types'))
    .pipe(
      filterNullish(),
      map((types) => types.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })))
    );
  public readonly yearSegmentChoices = yearSegmentChoiceOptions;

  public deadlinesFormGroup = new FormGroup({
    durationYears: new FormControl<number | undefined>(undefined),
    durationMonths: new FormControl<number | undefined>(undefined),
    isContinous: new FormControl<boolean | undefined>(undefined),
    extensionOptions: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
    extensionOptionUsed: new FormControl<number | undefined>(undefined),
    irrevocableUntil: new FormControl<Date | undefined>(undefined),
  });

  public terminationsFormGroup = new FormGroup({
    terminatedAt: new FormControl<Date | undefined>(undefined),
    noticePeriodMonths: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
    noticePeriodExtendsCurrent: new FormControl<YearSegmentChoice | undefined>(undefined),
    noticeByEndOf: new FormControl<YearSegmentChoice | undefined>(undefined),
  });

  constructor(private readonly store: Store, private readonly notificationService: NotificationService) {
    super();
  }

  public ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract-extend-types'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract-termination-period-types'));

    this.store
      .select(selectContract)
      .pipe(filterNullish())
      .subscribe((contract) => {
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

        if (isContinous) {
          this.deadlinesFormGroup.controls.durationYears.disable();
          this.deadlinesFormGroup.controls.durationMonths.disable();
        } else {
          this.deadlinesFormGroup.controls.durationYears.enable();
          this.deadlinesFormGroup.controls.durationMonths.enable();
        }
      });
  }

  public patch(request: APIUpdateContractRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.store.dispatch(ITContractActions.patchITContract(request));
    }
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
}
