import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  APIContractProcurementDataResponseDTO,
  APIIdentityNamePairResponseDTO,
  APIProcurementPlanDTO,
  APIShallowOrganizationResponseDTO,
  APIUpdateContractRequestDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { optionalNewDate } from 'src/app/shared/helpers/date.helpers';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { selectContract } from 'src/app/store/it-contract/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';

@Component({
  selector: 'app-it-contract-frontpage',
  templateUrl: './it-contract-frontpage.component.html',
  styleUrl: './it-contract-frontpage.component.scss',
})
export class ItContractFrontpageComponent extends BaseComponent implements OnInit {
  public readonly contractTypes$ = this.store
    .select(selectRegularOptionTypes('it-contract_contract-type'))
    .pipe(filterNullish());
  public readonly contractTemplates$ = this.store
    .select(selectRegularOptionTypes('it-contract_contract-template-type'))
    .pipe(filterNullish());
  public readonly criticalityTypes$ = this.store
    .select(selectRegularOptionTypes('it-contract_criticality-type'))
    .pipe(filterNullish());
  public readonly purchaseFormTypes$ = this.store
    .select(selectRegularOptionTypes('it-contract_purchase-form-type'))
    .pipe(filterNullish());
  public readonly procurementStrategyTypes$ = this.store
    .select(selectRegularOptionTypes('it-contract_procurement-strategy-type'))
    .pipe(filterNullish());

  public readonly frontpageFormGroup = new FormGroup({
    //It Contract information
    name: new FormControl<string>({ value: '', disabled: true }, Validators.required),
    contractId: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    contractType: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    contractTemplate: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    criticality: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    purchaseType: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    status: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    isValid: new FormControl<boolean | undefined>({ value: undefined, disabled: true }),
    validFrom: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    validTo: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    enforcedValid: new FormControl<boolean | undefined>({ value: undefined, disabled: true }),
    notes: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    //Responsible entity
    responsibleEntityOrganizationUnit: new FormControl<APIIdentityNamePairResponseDTO | undefined>({
      value: undefined,
      disabled: true,
    }),
    responsibleEntitySignedBy: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    responsibleEntitySignedAt: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    responsibleEntitySigned: new FormControl<boolean | undefined>({ value: undefined, disabled: true }),
    //Supplier
    supplierOrganization: new FormControl<APIShallowOrganizationResponseDTO | undefined>({
      value: undefined,
      disabled: true,
    }),
    supplierSignedBy: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    supplierSignedAt: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    supplierSigned: new FormControl<boolean | undefined>({ value: undefined, disabled: true }),
    //Procurement
    procurementStrategy: new FormControl<APIIdentityNamePairResponseDTO | undefined>({
      value: undefined,
      disabled: true,
    }),
    procurementPlan: new FormControl<APIProcurementPlanDTO | undefined>({ value: undefined, disabled: true }),
    procurementInitiated: new FormControl<APIContractProcurementDataResponseDTO.ProcurementInitiatedEnum | undefined>({
      value: undefined,
      disabled: true,
    }),
    //History
    createdBy: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    lastModifiedBy: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    lastModified: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
  });

  constructor(private store: Store, private notificationService: NotificationService) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract_contract-type'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract_contract-template-type'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract_criticality-type'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract_procurement-strategy-type'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract_purchase-form-type'));

    this.subscribeToItSystem();
  }

  public patchFrontPage(frontpage: APIUpdateContractRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.store.dispatch(ITContractActions.patchITContract(frontpage));
    }
  }

  public patchName(value: string | undefined, valueChange?: ValidatedValueChange<unknown>) {
    if (!value) {
      return;
    }

    this.patchFrontPage({ name: value }, valueChange);
  }

  private subscribeToItSystem() {
    this.subscriptions.add(
      this.store
        .select(selectContract)
        .pipe(filterNullish())
        .subscribe((contract) => {
          const enforcedValid = contract.general.validity.enforcedValid;
          this.frontpageFormGroup.patchValue({
            name: contract.name,
            contractId: contract.general.contractId,
            contractTemplate: contract.general.contractTemplate,
            criticality: contract.general.criticality,
            purchaseType: contract.procurement.purchaseType,
            status: enforcedValid
              ? $localize`Gennemtvunget gyldig`
              : contract.general.validity.valid
              ? $localize`Gyldig`
              : $localize`Ugyldig`,
            isValid: contract.general.validity.valid,
            validFrom: optionalNewDate(contract.general.validity.validFrom),
            validTo: optionalNewDate(contract.general.validity.validTo),
            enforcedValid: enforcedValid,
            notes: contract.general.notes,
            responsibleEntityOrganizationUnit: contract.responsible.organizationUnit,
            responsibleEntitySignedBy: contract.responsible.signedBy,
            responsibleEntitySignedAt: optionalNewDate(contract.responsible.signedAt),
            responsibleEntitySigned: contract.responsible.signed,
            supplierOrganization: contract.supplier.organization,
            supplierSignedBy: contract.supplier.signedBy,
            supplierSignedAt: optionalNewDate(contract.supplier.signedAt),
            supplierSigned: contract.supplier.signed,
            procurementStrategy: contract.procurement.procurementStrategy,
            procurementPlan: contract.procurement.procurementPlan,
            procurementInitiated: contract.procurement.procurementInitiated,
            createdBy: contract.createdBy.name,
            lastModifiedBy: contract.lastModifiedBy.name,
            lastModified: new Date(contract.lastModified),
          });

          this.frontpageFormGroup.enable();

          this.frontpageFormGroup.controls.status.disable();
        })
    );
  }
}
