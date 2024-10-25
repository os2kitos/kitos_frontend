import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatestWith } from 'rxjs';
import { APIIdentityNamePairResponseDTO, APIUpdateContractRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { optionalNewDate } from 'src/app/shared/helpers/date.helpers';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import {
  selectItContractExternalPayments,
  selectItContractHasModifyPermissions,
  selectItContractInternalPayments,
  selectItContractPaymentModel,
} from 'src/app/store/it-contract/selectors';
import {
  selectItContractsUIModuleConfigEnabledFieldExternalPayment,
  selectItContractsUIModuleConfigEnabledFieldInternalPayment,
  selectItContractsUIModuleConfigEnabledFieldPaymentModel,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';

@Component({
  selector: 'app-it-contract-economy',
  templateUrl: './it-contract-economy.component.html',
  styleUrl: './it-contract-economy.component.scss',
})
export class ItContractEconomyComponent extends BaseComponent implements OnInit {
  public readonly paymentFrequencyOptions$ = this.store.select(
    selectRegularOptionTypes('it-contract-payment-frequency-types')
  );
  public readonly paymentModelOptions$ = this.store.select(selectRegularOptionTypes('it-contract-payment-model-types'));
  public readonly priceRegulationOptions$ = this.store.select(
    selectRegularOptionTypes('it-contract-price-regulation-types')
  );

  public readonly externalPayments$ = this.store.select(selectItContractExternalPayments).pipe(filterNullish());
  public readonly anyExternalPayments$ = this.externalPayments$.pipe(matchNonEmptyArray());

  public readonly internalPayments$ = this.store.select(selectItContractInternalPayments).pipe(filterNullish());
  public readonly anyInternalPayments$ = this.internalPayments$.pipe(matchNonEmptyArray());

  public readonly economyFormGroup = new FormGroup({
    operationsRemunerationStartedAt: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    paymentFrequency: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    paymentModel: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    priceRegulation: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
  });

  public readonly paymentModelEnabled$ = this.store.select(selectItContractsUIModuleConfigEnabledFieldPaymentModel);
  public readonly externalPaymentEnabled$ = this.store.select(
    selectItContractsUIModuleConfigEnabledFieldExternalPayment
  );
  public readonly internalPaymentEnabled$ = this.store.select(
    selectItContractsUIModuleConfigEnabledFieldInternalPayment
  );

  constructor(private store: Store, private notificationService: NotificationService) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract-payment-frequency-types'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract-payment-model-types'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract-price-regulation-types'));

    this.subscriptions.add(
      this.store
        .select(selectItContractPaymentModel)
        .pipe(filterNullish(), combineLatestWith(this.store.select(selectItContractHasModifyPermissions)))
        .subscribe(([paymentModel, hasModifyPermission]) => {
          this.economyFormGroup.patchValue({
            operationsRemunerationStartedAt: optionalNewDate(paymentModel?.operationsRemunerationStartedAt),
            paymentFrequency: paymentModel?.paymentFrequency,
            paymentModel: paymentModel?.paymentModel,
            priceRegulation: paymentModel?.priceRegulation,
          });

          if (hasModifyPermission) {
            this.economyFormGroup.enable();
          }
        })
    );
  }

  public patchEconomy(request: APIUpdateContractRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.store.dispatch(ITContractActions.patchITContract(request));
    }
  }
}
