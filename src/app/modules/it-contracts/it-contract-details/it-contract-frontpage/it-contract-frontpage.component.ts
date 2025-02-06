import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatestWith, map } from 'rxjs';
import {
  APIContractProcurementDataResponseDTO,
  APIIdentityNamePairResponseDTO,
  APIItContractResponseDTO,
  APIShallowOrganizationResponseDTO,
  APIUpdateContractRequestDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { RadioButtonOption } from 'src/app/shared/components/radio-buttons/radio-buttons.component';
import { optionalNewDate } from 'src/app/shared/helpers/date.helpers';
import { combineOR } from 'src/app/shared/helpers/observable-helpers';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import {
  selectContract,
  selectItContractHasModifyPermissions,
  selectItContractIsValid,
  selectItContractValidity,
} from 'src/app/store/it-contract/selectors';
import {
  selectIContractsEnableSupplier,
  selectItContractEnableContractId,
  selectItContractsEnableAgreementPeriod,
  selectItContractsEnableContractType,
  selectItContractsEnableCriticality,
  selectItContractsEnabledCreatedBy,
  selectItContractsEnabledlastModifedBy,
  selectItContractsEnabledlastModifedDate,
  selectItContractsEnableExternalSigner,
  selectItContractsEnableInternalSigner,
  selectItContractsEnableIsActive,
  selectItContractsEnableNotes,
  selectItContractsEnableParentContract,
  selectItContractsEnableProcurementInitiated,
  selectItContractsEnableProcurementPlan,
  selectItContractsEnableProcurementStrategy,
  selectItContractsEnablePurchaseForm,
  selectItContractsEnableResponsibleUnit,
  selectItContractsEnableTemplate,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { ItContractFrontpageComponentStore } from './it-contract-frontpage.component-store';
import { toBulletPoints } from 'src/app/shared/helpers/string.helpers';

@Component({
  selector: 'app-it-contract-frontpage',
  templateUrl: './it-contract-frontpage.component.html',
  styleUrl: './it-contract-frontpage.component.scss',
  providers: [ItContractFrontpageComponentStore],
})
export class ItContractFrontpageComponent extends BaseComponent implements OnInit {
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

  public readonly isValid$ = this.store.select(selectItContractIsValid).pipe(filterNullish());
  public readonly statusText$ = this.store.select(selectItContractValidity).pipe(
    map((validity) => {
      if (
        (validity?.valid && validity?.enforcedValid === false) ||
        (validity?.enforcedValid && validity?.validationErrors?.length === 0)
      ) {
        return '';
      }

      let text = '';
      if (validity?.enforcedValid) {
        text += $localize`Gyldigheden er gennemtvunget og kontrakten er derfor gyldig på trods af at:`;
      } else {
        text += $localize`Følgende gør kontrakten ugyldig:`;
      }

      const validationErrors = validity?.validationErrors ?? [];
      const errorMessages = [
        validationErrors.includes('StartDateNotPassed') ? this.notYetValidText : undefined,
        validationErrors.includes('EndDatePassed') ? this.expiredText : undefined,
        validationErrors.includes('TerminationPeriodExceeded') ? this.terminationPeriodExceededText : undefined,
      ];
      return text + "\n" + toBulletPoints(errorMessages);
    })
  );

  private readonly notYetValidText = $localize`'Gyldig fra' er endnu ikke passeret`;
  private readonly expiredText = $localize`'Gyldig til' er overskredet`;
  private readonly terminationPeriodExceededText = $localize`Kontrakten er opsagt og evt. opsigelsesfrist er overskredet`;

  public readonly users$ = this.componentStore.users$.pipe(
    map((users) => users.map((user) => ({ name: user.firstName + ' ' + user.lastName, uuid: user.uuid })))
  );
  public readonly usersIsLoading$ = this.componentStore.usersIsLoading$;
  public readonly organizations$ = this.componentStore.organizations$;
  public readonly organizationsIsLoading$ = this.componentStore.organizationsIsLoading$;
  public readonly contractsIsLoading$ = this.componentStore.contractsIsLoading$;
  public readonly validParentContracts$ = this.componentStore.validParentContracts$;

  public readonly frontpageFormGroup = new FormGroup({
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
  });

  public readonly parentContractForm = new FormGroup({
    parentContract: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
  });

  public readonly responsibleFormGroup = new FormGroup({
    responsibleEntityOrganizationUnit: new FormControl<APIIdentityNamePairResponseDTO | undefined>({
      value: undefined,
      disabled: true,
    }),
    responsibleEntitySignedBy: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    responsibleEntitySignedAt: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    responsibleEntitySigned: new FormControl<boolean | undefined>({ value: undefined, disabled: true }),
  });

  public readonly supplierFormGroup = new FormGroup({
    supplierOrganization: new FormControl<APIShallowOrganizationResponseDTO | undefined>({
      value: undefined,
      disabled: true,
    }),
    supplierSignedBy: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    supplierSignedAt: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    supplierSigned: new FormControl<boolean | undefined>({ value: undefined, disabled: true }),
  });

  public readonly procurementFormGroup = new FormGroup({
    procurementStrategy: new FormControl<APIIdentityNamePairResponseDTO | undefined>({
      value: undefined,
      disabled: true,
    }),
    procurementPlan: new FormControl<{ name: string } | undefined>({ value: undefined, disabled: true }),
    procurementInitiated: new FormControl<APIContractProcurementDataResponseDTO.ProcurementInitiatedEnum | undefined>({
      value: undefined,
      disabled: true,
    }),
  });

  public readonly historyFormGroup = new FormGroup({
    createdBy: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    lastModifiedBy: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    lastModified: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
  });

  public readonly yearsWithQuarters = this.getYearsWithQuarters();

  public readonly activeOptions: Array<
    RadioButtonOption<APIContractProcurementDataResponseDTO.ProcurementInitiatedEnum>
  > = [
    { id: APIContractProcurementDataResponseDTO.ProcurementInitiatedEnum.Yes, label: 'Ja' },
    { id: APIContractProcurementDataResponseDTO.ProcurementInitiatedEnum.No, label: 'Nej' },
  ];

  public readonly contractIdEnabled$ = this.store.select(selectItContractEnableContractId);
  public readonly contractTypeEnabled$ = this.store.select(selectItContractsEnableContractType);
  public readonly contractTemplateEnabled$ = this.store.select(selectItContractsEnableTemplate);
  public readonly contractCriticalityEnabled$ = this.store.select(selectItContractsEnableCriticality);
  public readonly contractPurchaseFormEnabled$ = this.store.select(selectItContractsEnablePurchaseForm);
  public readonly contractIsActiveEnabled$ = this.store.select(selectItContractsEnableIsActive);
  public readonly contractAgreementPeriodEnabled$ = this.store.select(selectItContractsEnableAgreementPeriod);
  public readonly contractNotesEnabled$ = this.store.select(selectItContractsEnableNotes);
  public readonly contractParentContractEnabled$ = this.store.select(selectItContractsEnableParentContract);

  public readonly contractResponsibleUnitEnabled$ = this.store.select(selectItContractsEnableResponsibleUnit);
  public readonly contractInternalSignerEnabled$ = this.store.select(selectItContractsEnableInternalSigner);
  public readonly showResponsibleCard$ = combineOR([
    this.contractResponsibleUnitEnabled$,
    this.contractInternalSignerEnabled$,
  ]);

  public readonly contractSupplierEnabled$ = this.store.select(selectIContractsEnableSupplier);
  public readonly contractExternalSignerEnabled$ = this.store.select(selectItContractsEnableExternalSigner);
  public readonly showSupplierCard$ = combineOR([this.contractSupplierEnabled$, this.contractExternalSignerEnabled$]);

  public readonly contractProcurementStrategyEnabled$ = this.store.select(selectItContractsEnableProcurementStrategy);
  public readonly contractProcurementPlanEnabled$ = this.store.select(selectItContractsEnableProcurementPlan);
  public readonly contractProcurementInitiatedEnabled$ = this.store.select(selectItContractsEnableProcurementInitiated);
  public readonly showProcurementCard$ = combineOR([
    this.contractProcurementStrategyEnabled$,
    this.contractProcurementPlanEnabled$,
    this.contractProcurementInitiatedEnabled$,
  ]);

  public readonly contractsCreatedByEnabled$ = this.store.select(selectItContractsEnabledCreatedBy);
  public readonly contractsLastModifiedByEnabled$ = this.store.select(selectItContractsEnabledlastModifedBy);
  public readonly contractsLastModifiedDateEnabled$ = this.store.select(selectItContractsEnabledlastModifedDate);
  public readonly showHistoryCard$ = combineOR([
    this.contractsCreatedByEnabled$,
    this.contractsLastModifiedByEnabled$,
    this.contractsLastModifiedDateEnabled$,
  ]);

  constructor(
    private readonly store: Store,
    private readonly notificationService: NotificationService,
    private readonly componentStore: ItContractFrontpageComponentStore
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract_contract-type'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract_contract-template-type'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract_criticality-type'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract_procurement-strategy-type'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract_purchase-form-type'));

    this.subscribeToItContract();
  }

  public patchFrontPage(frontpage: APIUpdateContractRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.store.dispatch(ITContractActions.patchITContract(frontpage));
    }
  }

  public ignoreNullReturnType<T>(item: T | null | undefined): T | undefined {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    return item as any as T | undefined;
  }

  public patchName(value: string | undefined, valueChange?: ValidatedValueChange<unknown>) {
    if (!value) {
      return;
    }

    this.patchFrontPage({ name: value }, valueChange);
  }

  public patchProcurementPlan(plan: string | undefined, valueChange?: ValidatedValueChange<unknown>) {
    if (plan) {
      const parts = plan.split(' | ');
      const quarterOfYear = parseInt(parts[0].substring(1));
      const year = parseInt(parts[1]);
      this.patchFrontPage({ procurement: { procurementPlan: { quarterOfYear, year } } }, valueChange);
      return;
    }
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.patchFrontPage({ procurement: { procurementPlan: null as any } }, valueChange);
  }

  public searchUsers(search?: string) {
    this.componentStore.searchUsersInOrganization(search);
  }

  public searchOrganizations(search?: string) {
    this.componentStore.searchOrganizations(search);
  }

  public searchParentContracts(search?: string): void {
    this.componentStore.searchParentContracts(search);
  }

  private getYearsWithQuarters() {
    const currentYear = new Date().getFullYear();
    const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
    const years = Array.from({ length: 11 }, (_, i) => i + currentYear - 1);
    const quarters = years
      .flatMap((year) =>
        Array.from({ length: 4 }, (_, i) => {
          const quarter = i + 1;
          if (year === currentYear && quarter < currentQuarter) return;
          return { name: `Q${quarter} | ${year}` };
        })
      )
      .filter(Boolean);
    return quarters;
  }

  private subscribeToItContract() {
    this.subscriptions.add(
      this.store
        .select(selectContract)
        .pipe(filterNullish(), combineLatestWith(this.store.select(selectItContractHasModifyPermissions)))
        .subscribe(([contract, hasModifyPermission]) => {
          this.updateFormGroups(contract, hasModifyPermission);
        })
    );
  }

  private updateFormGroups(contract: APIItContractResponseDTO, hasModifyPermission?: boolean) {
    this.patchFrontPageFormGroup(contract);
    this.patchParentContractFormGroup(contract);
    this.patchResponsibleFormGroup(contract);
    this.patchSupplierFormGroup(contract);
    this.patchProcurementFormGroup(contract);
    this.patchHistoryFormGroup(contract);

    this.enableFormGroups();
    this.enableFormGroups(hasModifyPermission);
  }
  private patchFrontPageFormGroup(contract: APIItContractResponseDTO) {
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
        : $localize`Ikke gyldig`,
      isValid: contract.general.validity.valid,
      validFrom: optionalNewDate(contract.general.validity.validFrom),
      validTo: optionalNewDate(contract.general.validity.validTo),
      enforcedValid: enforcedValid,
      notes: contract.general.notes,
      contractType: contract.general.contractType,
    });
  }

  private patchParentContractFormGroup(contract: APIItContractResponseDTO) {
    this.parentContractForm.patchValue({ parentContract: contract.parentContract });
  }

  private patchResponsibleFormGroup(contract: APIItContractResponseDTO) {
    this.responsibleFormGroup.patchValue({
      responsibleEntityOrganizationUnit: contract.responsible.organizationUnit,
      responsibleEntitySignedBy: contract.responsible.signedBy,
      responsibleEntitySignedAt: optionalNewDate(contract.responsible.signedAt),
      responsibleEntitySigned: contract.responsible.signed,
    });
  }

  private patchSupplierFormGroup(contract: APIItContractResponseDTO) {
    this.supplierFormGroup.patchValue({
      supplierOrganization: contract.supplier.organization,
      supplierSignedBy: contract.supplier.signedBy,
      supplierSignedAt: optionalNewDate(contract.supplier.signedAt),
      supplierSigned: contract.supplier.signed,
    });
  }

  private patchProcurementFormGroup(contract: APIItContractResponseDTO) {
    const procurementPlan = contract.procurement.procurementPlan;

    this.procurementFormGroup.patchValue({
      procurementStrategy: contract.procurement.procurementStrategy,
      procurementPlan: procurementPlan
        ? { name: `Q${procurementPlan.quarterOfYear} | ${procurementPlan.year}` }
        : undefined,
      procurementInitiated: contract.procurement.procurementInitiated,
    });
  }

  private patchHistoryFormGroup(contract: APIItContractResponseDTO) {
    this.historyFormGroup.patchValue({
      createdBy: contract.createdBy.name,
      lastModifiedBy: contract.lastModifiedBy.name,
      lastModified: new Date(contract.lastModified),
    });
  }

  private enableFormGroups(hasModifyPermission?: boolean) {
    if (hasModifyPermission) {
      this.frontpageFormGroup.enable();
      this.parentContractForm.enable();
      this.responsibleFormGroup.enable();
      this.supplierFormGroup.enable();
      this.procurementFormGroup.enable();
    }
    this.frontpageFormGroup.controls.status.disable();
  }
}
