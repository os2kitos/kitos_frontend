import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import * as DprFields from 'src/app/shared/constants/it-contracts-grid-column-constants';
import * as UsageFields from 'src/app/shared/constants/it-system-usage-grid-column-constants';
import {
  selectItContractEnableContractId,
  selectItContractEnableContractRoles,
  selectItContractsEnableAgreementDeadlines,
  selectItContractsEnableAgreementPeriod,
  selectItContractsEnableContractType,
  selectItContractsEnableCriticality,
  selectItContractsEnableExternalPayment,
  selectItContractsEnableInternalSigner,
  selectItContractsEnablePaymentModel,
  selectItContractsEnableProcurementInitiated,
  selectItContractsEnableProcurementPlan,
  selectItContractsEnableProcurementStrategy,
  selectItContractsEnablePurchaseForm,
  selectItContractsEnableTemplate,
  selectItContractsEnableTermination,
  selectITSystemUsageEnableFrontPageUsagePeriod,
  selectITSystemUsageEnableGdpr,
  selectITSystemUsageEnableLifeCycleStatus,
  selectITSystemUsageEnableLocalReferences,
  selectITSystemUsageEnableSelectContractToDetermineIfItSystemIsActive,
  selectITSystemUsageEnableSystemRelations,
  selectITSystemUsageEnableTabArchiving,
  selectITSystemUsageEnableTabOrganization,
  selectITSystemUsageEnableTabSystemRoles,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { UIConfigGridApplication } from '../../models/ui-config/ui-config-grid-application';
import { UIModuleConfigKey } from '../../enums/ui-module-config-key';

@Injectable({
  providedIn: 'root',
})
export class GridUIConfigService {
  constructor(private store: Store) {}

  public getUIConfigApplications(moduleKey: UIModuleConfigKey): Observable<UIConfigGridApplication[]> {
    switch (moduleKey) {
      case UIModuleConfigKey.ItContract:
        return this.getItContractGridConfig();
      case UIModuleConfigKey.ItSystemUsage:
        return this.getItSystemUsageGridConfig();
      default:
        throw new Error(`Module key ${moduleKey} is not supported`);
    }
  }

  private getItContractGridConfig(): Observable<UIConfigGridApplication[]> {
    const enabledContractId$ = this.store.select(selectItContractEnableContractId);
    const enabledAgreementPeriod$ = this.store.select(selectItContractsEnableAgreementPeriod);
    const enabledCriticality$ = this.store.select(selectItContractsEnableCriticality);
    const enabledInternalSigner$ = this.store.select(selectItContractsEnableInternalSigner);
    const enabledContractType$ = this.store.select(selectItContractsEnableContractType);
    const enabledContractTemplate$ = this.store.select(selectItContractsEnableTemplate);
    const enabledPurchaseForm$ = this.store.select(selectItContractsEnablePurchaseForm);
    const enabledProcurementStrategy$ = this.store.select(selectItContractsEnableProcurementStrategy);
    const enabledProcurementPlan$ = this.store.select(selectItContractsEnableProcurementPlan);
    const enabledProcurementInitiated$ = this.store.select(selectItContractsEnableProcurementInitiated);
    const enabledExternalPayment$ = this.store.select(selectItContractsEnableExternalPayment);
    const enabledPaymentModel$ = this.store.select(selectItContractsEnablePaymentModel);
    const enabledAgreementDeadlines$ = this.store.select(selectItContractsEnableAgreementDeadlines);
    const enabledTermination$ = this.store.select(selectItContractsEnableTermination);
    const enabledContractRoles$ = this.store.select(selectItContractEnableContractRoles);

    return combineLatest([
      enabledContractId$,
      enabledAgreementPeriod$,
      enabledCriticality$,
      enabledInternalSigner$,
      enabledContractType$,
      enabledContractTemplate$,
      enabledPurchaseForm$,
      enabledProcurementStrategy$,
      enabledProcurementPlan$,
      enabledProcurementInitiated$,
      enabledExternalPayment$,
      enabledPaymentModel$,
      enabledAgreementDeadlines$,
      enabledTermination$,
      enabledContractRoles$,
    ]).pipe(
      map(
        ([
          enabledContractId,
          enabledAgreementPeriod,
          enabledCriticality,
          enabledInternalSigner,
          enabledContractType,
          enabledContractTemplate,
          enabledPurchaseForm,
          enabledProcurementStrategy,
          enabledProcurementPlan,
          enabledProcurementInitiated,
          enabledExternalPayment,
          enabledPaymentModel,
          enabledAgreementDeadlines,
          enabledTermination,
          enabledContractRoles,
        ]): UIConfigGridApplication[] => [
          {
            shouldEnable: enabledContractId,
            columnNamesToConfigure: [DprFields.ContractId],
          },
          {
            shouldEnable: enabledAgreementPeriod,
            columnNamesToConfigure: [DprFields.Concluded, DprFields.ExpirationDate],
          },
          {
            shouldEnable: enabledCriticality,
            columnNamesToConfigure: [DprFields.CriticalityUuid],
          },
          {
            shouldEnable: enabledInternalSigner,
            columnNamesToConfigure: [DprFields.ContractSigner],
          },
          {
            shouldEnable: enabledContractType,
            columnNamesToConfigure: [DprFields.ContractTypeUuid],
          },
          {
            shouldEnable: enabledContractTemplate,
            columnNamesToConfigure: [DprFields.ContractTemplateUuid],
          },
          {
            shouldEnable: enabledPurchaseForm,
            columnNamesToConfigure: [DprFields.PurchaseFormUuid],
          },
          {
            shouldEnable: enabledProcurementStrategy,
            columnNamesToConfigure: [DprFields.ProcurementStrategyUuid],
          },
          {
            shouldEnable: enabledProcurementPlan,
            columnNamesToConfigure: [DprFields.ProcurementPlanYear],
          },
          {
            shouldEnable: enabledProcurementInitiated,
            columnNamesToConfigure: [DprFields.ProcurementInitiated],
          },
          {
            shouldEnable: enabledExternalPayment,
            columnNamesToConfigure: [
              DprFields.AccumulatedAcquisitionCost,
              DprFields.AccumulatedOperationCost,
              DprFields.AccumulatedOtherCost,
              DprFields.LatestAuditDate,
              DprFields.AuditStatusWhite,
              DprFields.AuditStatusYellow,
              DprFields.AuditStatusRed,
              DprFields.AuditStatusGreen,
            ],
          },
          {
            shouldEnable: enabledPaymentModel,
            columnNamesToConfigure: [
              DprFields.OperationRemunerationBegunDate,
              DprFields.PaymentModelUuid,
              DprFields.PaymentFrequencyUuid,
            ],
          },
          {
            shouldEnable: enabledAgreementDeadlines,
            columnNamesToConfigure: [DprFields.Duration, DprFields.OptionExtendUuid, DprFields.IrrevocableTo],
          },
          {
            shouldEnable: enabledTermination,
            columnNamesToConfigure: [DprFields.TerminationDeadlineUuid, DprFields.TerminatedAt],
          },
          {
            shouldEnable: enabledContractRoles,
            columnNamesToConfigure: [],
            columnNameSubstringsToConfigure: ['Roles.Role'],
          },
        ]
      )
    );
  }

  private getItSystemUsageGridConfig(): Observable<UIConfigGridApplication[]> {
    const enableLifeCycleStatus$ = this.store.select(selectITSystemUsageEnableLifeCycleStatus);
    const enableUsagePeriod$ = this.store.select(selectITSystemUsageEnableFrontPageUsagePeriod);
    const enableSelectContractToDetermineIfItSystemIsActive$ = this.store.select(
      selectITSystemUsageEnableSelectContractToDetermineIfItSystemIsActive
    );
    const enableOrganization$ = this.store.select(selectITSystemUsageEnableTabOrganization);
    const enableSystemRoles$ = this.store.select(selectITSystemUsageEnableTabSystemRoles);
    const enableReferences$ = this.store.select(selectITSystemUsageEnableLocalReferences);
    const enableGdpr$ = this.store.select(selectITSystemUsageEnableGdpr);
    const enableArchiving$ = this.store.select(selectITSystemUsageEnableTabArchiving);
    const enableSystemRelations$ = this.store.select(selectITSystemUsageEnableSystemRelations);

    return combineLatest([
      enableLifeCycleStatus$,
      enableUsagePeriod$,
      enableSelectContractToDetermineIfItSystemIsActive$,
      enableOrganization$,
      enableSystemRoles$,
      enableReferences$,
      enableGdpr$,
      enableArchiving$,
      enableSystemRelations$,
    ]).pipe(
      map(
        ([
          enableLifeCycleStatus,
          enableUsagePeriod,
          enableSelectContractToDetermineIfItSystemIsActive,
          enableOrganization,
          enableSystemRoles,
          enableReferences,
          enableGdpr,
          enableArchiving,
          enableSystemRelations,
        ]): UIConfigGridApplication[] => [
          {
            shouldEnable: enableLifeCycleStatus,
            columnNamesToConfigure: [UsageFields.LifeCycleStatus, UsageFields.ActiveAccordingToLifeCycle],
          },
          {
            shouldEnable: enableUsagePeriod,
            columnNamesToConfigure: [
              UsageFields.ExpirationDate,
              UsageFields.Concluded,
              UsageFields.ActiveAccordingToValidityPeriod,
            ],
          },
          {
            shouldEnable: enableSelectContractToDetermineIfItSystemIsActive,
            columnNamesToConfigure: [UsageFields.MainContractIsActive, UsageFields.MainContractSupplierName],
          },
          {
            shouldEnable: enableOrganization,
            columnNamesToConfigure: [
              UsageFields.ResponsibleOrganizationUnitName,
              UsageFields.RelevantOrganizationUnitNamesAsCsv,
            ],
          },
          {
            shouldEnable: enableSystemRoles,
            columnNamesToConfigure: [],
            columnNameSubstringsToConfigure: ['Roles.Role'],
          },
          {
            shouldEnable: enableReferences,
            columnNamesToConfigure: [UsageFields.LocalReferenceTitle, UsageFields.LocalReferenceDocumentId],
          },
          {
            shouldEnable: enableGdpr,
              columnNamesToConfigure: [
              UsageFields.SensitiveDataLevelsAsCsv,
              UsageFields.LocalReferenceDocumentId,
              UsageFields.RiskSupervisionDocumentationName,
              UsageFields.LinkToDirectoryName,
              UsageFields.HostedAt,
              UsageFields.GeneralPurpose,
              UsageFields.DataProcessingRegistrationsConcludedAsCsv,
              UsageFields.DataProcessingRegistrationNamesAsCsv,
              UsageFields.RiskAssessmentDate,
              UsageFields.PlannedRiskAssessmentDate,
            ],
          },
          {
            shouldEnable: enableArchiving,
            columnNamesToConfigure: [
              UsageFields.ArchiveDuty,
              UsageFields.IsHoldingDocument,
              UsageFields.ActiveArchivePeriodEndDate,
            ],
          },
          {
            shouldEnable: enableSystemRelations,
            columnNamesToConfigure: [
              UsageFields.OutgoingRelatedItSystemUsagesNamesAsCsv,
              UsageFields.DependsOnInterfacesNamesAsCsv,
              UsageFields.IncomingRelatedItSystemUsagesNamesAsCsv,
            ],
          },
        ]
      )
    );
  }

}
