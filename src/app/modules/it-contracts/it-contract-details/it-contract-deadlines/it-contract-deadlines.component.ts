import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  APIContractAgreementPeriodDataWriteRequestDTO,
  APIContractTerminationDataWriteRequestDTO,
  APIIdentityNamePairResponseDTO,
  APIUpdateContractRequestDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { YearSegmentChoice, yearSegmentChoiceOptions } from 'src/app/shared/models/it-contract/year-segment-choice';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';

@Component({
  selector: 'app-it-contract-deadlines',
  templateUrl: './it-contract-deadlines.component.html',
  styleUrl: './it-contract-deadlines.component.scss',
})
export class ItContractDeadlinesComponent extends BaseComponent implements OnInit {
  public readonly extendTypes$ = this.store.select(selectRegularOptionTypes('it-contract-extend-types'));
  public readonly yearSegmentChoices = yearSegmentChoiceOptions;
  public readonly noticePeriodMonths = Array.from({ length: 12 }, (_, i) => i + 1);

  public deadlinesFormGroup = new FormGroup({
    //deadlines
    durationYears: new FormControl<number | undefined>(undefined),
    durationMonths: new FormControl<number | undefined>(undefined),
    isContinous: new FormControl<boolean | undefined>(undefined),
    extensionOptions: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
    extensionOptionUsed: new FormControl<number | undefined>(undefined),
    irrevocableUntil: new FormControl<Date | undefined>(undefined),
    //termination
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
}
