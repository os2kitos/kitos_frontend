/* eslint-disable @ngrx/avoid-combining-selectors */
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, combineLatestWith, map, Observable } from 'rxjs';
import * as DprFields from 'src/app/shared/constants/data-processing-grid-column-constants';
import * as GdprFields from 'src/app/shared/constants/gdpr-overview-grid-column-constants';
import * as ContractFields from 'src/app/shared/constants/it-contracts-grid-column-constants';
import * as UsageFields from 'src/app/shared/constants/it-system-usage-grid-column-constants';
import {
  selectShowDataProcessingRegistrations,
  selectShowItContractModule,
  selectShowItSystemModule,
} from 'src/app/store/organization/selectors';
import {
  selectDprEnableAgreementConcluded,
  selectDprEnableAssociatedContracts,
  selectDprEnableDataResponsible,
  selectDprEnabledOversightInterval,
  selectDprEnableItSystems,
  selectDprEnableLastChangedAt,
  selectDprEnableLastChangedBy,
  selectDprEnableMainContract,
  selectDprEnableOversightOptions,
  selectDprEnableOversights,
  selectDprEnableProcessors,
  selectDprEnableReferences,
  selectDprEnableRoles,
  selectDprEnableScheduledInspectionDate,
  selectDprEnableStatus,
  selectDprEnableSubProcessors,
  selectDprEnableTransferBasis,
  selectIContractsEnableSupplier,
  selectItContractEnableContractId,
  selectItContractEnableContractRoles,
  selectItContractEnableDataProcessing,
  selectItContractEnableReferences,
  selectItContractEnableRelations,
  selectItContractEnableSystemUsages,
  selectItContractsEnableAgreementDeadlines,
  selectItContractsEnableAgreementPeriod,
  selectItContractsEnableContractType,
  selectItContractsEnableCriticality,
  selectItContractsEnabledCreatedBy,
  selectItContractsEnabledlastModifedBy,
  selectItContractsEnabledlastModifedDate,
  selectItContractsEnableExternalPayment,
  selectItContractsEnableExternalSigner,
  selectItContractsEnableInternalSigner,
  selectItContractsEnableIsActive,
  selectItContractsEnableNotes,
  selectItContractsEnableParentContract,
  selectItContractsEnablePaymentModel,
  selectItContractsEnableProcurementInitiated,
  selectItContractsEnableProcurementPlan,
  selectItContractsEnableProcurementStrategy,
  selectItContractsEnablePurchaseForm,
  selectItContractsEnableResponsibleUnit,
  selectItContractsEnableTemplate,
  selectItContractsEnableTermination,
  selectITSystemUsageEnableAmountOfUsers,
  selectITSystemUsageEnableAssociatedContracts,
  selectITSystemUsageEnableDataClassification,
  selectITSystemUsageEnableDataProcessing,
  selectITSystemUsageEnableDescription,
  selectITSystemUsageEnableDocumentBearing,
  selectITSystemUsageEnabledSystemId,
  selectITSystemUsageEnableFrontPageUsagePeriod,
  selectITSystemUsageEnableGdprBusinessCritical,
  selectITSystemUsageEnableGdprConductedRiskAssessment,
  selectITSystemUsageEnableGdprDataTypes,
  selectITSystemUsageEnableGdprDocumentation,
  selectITSystemUsageEnableGdprDpiaConducted,
  selectITSystemUsageEnableGdprHostedAt,
  selectITSystemUsageEnableGdprPlannedRiskAssessmentDate,
  selectITSystemUsageEnableGdprPurpose,
  selectITSystemUsageEnableIncomingRelations,
  selectITSystemUsageEnableInheritedKle,
  selectITSystemUsageEnableJournalPeriods,
  selectITSystemUsageEnableLastEditedAt,
  selectITSystemUsageEnableLastEditedBy,
  selectITSystemUsageEnableLifeCycleStatus,
  selectITSystemUsageEnableLocalReferences,
  selectITSystemUsageEnableOutgoingRelations,
  selectITSystemUsageEnableRelevantUnits,
  selectITSystemUsageEnableResponsibleUnit,
  selectITSystemUsageEnableSelectContractToDetermineIfItSystemIsActive,
  selectITSystemUsageEnableStatus,
  selectITSystemUsageEnableTabArchiving,
  selectITSystemUsageEnableTabSystemRoles,
  selectITSystemUsageEnableTakenIntoUsageBy,
  selectITSystemUsageEnableVersion,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { UIModuleConfigKey } from '../../enums/ui-module-config-key';
import { filterGridColumnsByUIConfig } from '../../helpers/grid-config-helper';
import { combineAND } from '../../helpers/observable-helpers';
import { GridColumn } from '../../models/grid-column.model';
import { UIConfigGridApplication } from '../../models/ui-config/ui-config-grid-application';

@Injectable({
  providedIn: 'root',
})
export class GridUIConfigService {
  constructor(private store: Store) {}

  public filterGridColumnsByUIConfig(
    moduleKey: UIModuleConfigKey
  ): (source: Observable<GridColumn[]>) => Observable<GridColumn[]> {
    return (source) =>
      source.pipe(
        combineLatestWith(this.getUIConfigApplications(moduleKey)),
        map(([gridColumns, uiConfig]) => {
          return this.applyAllUIConfigToGridColumns(uiConfig, gridColumns);
        }),
        filterGridColumnsByUIConfig()
      );
  }

  public isColumnEnabled(column: GridColumn, applications: UIConfigGridApplication[]) {
    let enabled = true;

    for (const app of applications) {
      const result = this.verifyColumn(app, column);
      if (result !== null) {
        if (result === false) {
          enabled = false;
        }
        break;
      }
    }
    return enabled;
  }

  public getUIConfigApplications(moduleKey: UIModuleConfigKey): Observable<UIConfigGridApplication[]> {
    switch (moduleKey) {
      case UIModuleConfigKey.ItContract:
        return this.getItContractGridConfig();
      case UIModuleConfigKey.ItSystemUsage:
        return this.getItSystemUsageGridConfig();
      case UIModuleConfigKey.DataProcessingRegistrations:
        return this.getDataProcessingGridConfig();
      case UIModuleConfigKey.Gdpr:
        return this.getGdprGridConfig();
      default:
        throw new Error(`Module key ${moduleKey} is not supported`);
    }
  }

  private getItContractGridConfig(): Observable<UIConfigGridApplication[]> {
    const configObservables: Observable<UIConfigGridApplication>[] = [
      //Frontpage
      this.store.select(selectItContractEnableContractId).pipe(shouldEnable([ContractFields.ContractId])),
      this.store.select(selectItContractsEnableContractType).pipe(shouldEnable([ContractFields.ContractTypeUuid])),
      this.store.select(selectItContractsEnableTemplate).pipe(shouldEnable([ContractFields.ContractTemplateUuid])),
      this.store.select(selectItContractsEnableCriticality).pipe(shouldEnable([ContractFields.CriticalityUuid])),
      this.store.select(selectItContractsEnablePurchaseForm).pipe(shouldEnable([ContractFields.PurchaseFormUuid])),
      this.store.select(selectItContractsEnableIsActive).pipe(shouldEnable([ContractFields.IsActive])),
      this.store
        .select(selectItContractsEnableAgreementPeriod)
        .pipe(shouldEnable([ContractFields.Concluded, ContractFields.ExpirationDate])),
      this.store.select(selectItContractsEnableNotes).pipe(shouldEnable([])),

      this.store.select(selectItContractsEnableParentContract).pipe(shouldEnable([ContractFields.ParentContractName])),

      this.store
        .select(selectItContractsEnableResponsibleUnit)
        .pipe(shouldEnable([ContractFields.ResponsibleOrgUnitName])),
      this.store.select(selectItContractsEnableInternalSigner).pipe(shouldEnable([ContractFields.ContractSigner])),

      this.store.select(selectIContractsEnableSupplier).pipe(shouldEnable([ContractFields.SupplierName])),
      this.store.select(selectItContractsEnableExternalSigner).pipe(shouldEnable([])),

      this.store
        .select(selectItContractsEnableProcurementStrategy)
        .pipe(shouldEnable([ContractFields.ProcurementStrategyUuid])),
      this.store
        .select(selectItContractsEnableProcurementPlan)
        .pipe(shouldEnable([ContractFields.ProcurementPlanYear])),
      this.store
        .select(selectItContractsEnableProcurementInitiated)
        .pipe(shouldEnable([ContractFields.ProcurementInitiated])),

      this.store.select(selectItContractsEnabledCreatedBy).pipe(shouldEnable([])),
      this.store
        .select(selectItContractsEnabledlastModifedBy)
        .pipe(shouldEnable([ContractFields.LastEditedByUserName])),
      this.store.select(selectItContractsEnabledlastModifedDate).pipe(shouldEnable([ContractFields.LastEditedAtDate])),

      // IT Systems
      combineAND([
        this.store.select(selectItContractEnableSystemUsages),
        this.store.select(selectShowItSystemModule),
      ]).pipe(shouldEnable([ContractFields.ItSystemUsages, ContractFields.ItSystemUsageUuidsAsCsv])),

      combineAND([
        this.store.select(selectItContractEnableRelations),
        this.store.select(selectShowItSystemModule),
      ]).pipe(shouldEnable([ContractFields.NumberOfAssociatedSystemRelations])),

      //Data processing
      combineAND([
        this.store.select(selectShowDataProcessingRegistrations),
        this.store.select(selectItContractEnableDataProcessing),
      ]).pipe(shouldEnable([ContractFields.DataProcessingAgreements])),

      //Agreement periods
      this.store
        .select(selectItContractsEnableAgreementDeadlines)
        .pipe(shouldEnable([ContractFields.Duration, ContractFields.OptionExtendUuid, ContractFields.IrrevocableTo])),

      this.store
        .select(selectItContractsEnableTermination)
        .pipe(shouldEnable([ContractFields.TerminationDeadlineUuid, ContractFields.TerminatedAt])),

      //Economy
      this.store
        .select(selectItContractsEnableExternalPayment)
        .pipe(
          shouldEnable([
            ContractFields.AccumulatedAcquisitionCost,
            ContractFields.AccumulatedOperationCost,
            ContractFields.AccumulatedOtherCost,
            ContractFields.LatestAuditDate,
            ContractFields.AuditStatusWhite,
            ContractFields.AuditStatusYellow,
            ContractFields.AuditStatusRed,
            ContractFields.AuditStatusGreen,
          ])
        ),

      this.store
        .select(selectItContractsEnablePaymentModel)
        .pipe(
          shouldEnable([
            ContractFields.OperationRemunerationBegunDate,
            ContractFields.PaymentModelUuid,
            ContractFields.PaymentFrequencyUuid,
          ])
        ),

      //Contract Roles
      this.store.select(selectItContractEnableContractRoles).pipe(shouldEnable([], ['Roles.Role'])),

      //References
      this.store
        .select(selectItContractEnableReferences)
        .pipe(shouldEnable([ContractFields.ActiveReferenceTitle, ContractFields.ActiveReferenceExternalReferenceId])),
    ];

    return combineLatest(configObservables);
  }

  private getItSystemUsageGridConfig(): Observable<UIConfigGridApplication[]> {
    const configObservables: Observable<UIConfigGridApplication>[] = [
      //Frontpage
      this.store.select(selectITSystemUsageEnabledSystemId).pipe(shouldEnable([UsageFields.LocalSystemId])),
      this.store.select(selectITSystemUsageEnableVersion).pipe(shouldEnable([UsageFields.Version])),
      this.store.select(selectITSystemUsageEnableAmountOfUsers).pipe(shouldEnable([])),
      this.store.select(selectITSystemUsageEnableDataClassification).pipe(shouldEnable([])),
      this.store.select(selectITSystemUsageEnableDescription).pipe(shouldEnable([UsageFields.Note])),
      this.store.select(selectITSystemUsageEnableTakenIntoUsageBy).pipe(shouldEnable([UsageFields.ObjectOwnerName])),
      this.store.select(selectITSystemUsageEnableLastEditedBy).pipe(shouldEnable([UsageFields.LastChangedByName])),
      this.store.select(selectITSystemUsageEnableLastEditedAt).pipe(shouldEnable([UsageFields.LastChangedAt])),
      this.store
        .select(selectITSystemUsageEnableLifeCycleStatus)
        .pipe(shouldEnable([UsageFields.LifeCycleStatus, UsageFields.ActiveAccordingToLifeCycle])),
      this.store
        .select(selectITSystemUsageEnableFrontPageUsagePeriod)
        .pipe(
          shouldEnable([UsageFields.ExpirationDate, UsageFields.Concluded, UsageFields.ActiveAccordingToValidityPeriod])
        ),
      this.store.select(selectITSystemUsageEnableStatus).pipe(shouldEnable([])),

      //Contracts
      combineAND([
        this.store.select(selectShowItContractModule),
        this.store.select(selectITSystemUsageEnableSelectContractToDetermineIfItSystemIsActive),
      ]).pipe(shouldEnable([UsageFields.MainContractIsActive, UsageFields.MainContractSupplierName])),

      combineAND([
        this.store.select(selectShowItContractModule),
        this.store.select(selectITSystemUsageEnableAssociatedContracts),
      ]).pipe(shouldEnable([UsageFields.AssociatedContractsNamesCsv])),

      //Data processing
      combineAND([
        this.store.select(selectShowDataProcessingRegistrations),
        this.store.select(selectITSystemUsageEnableDataProcessing),
      ]).pipe(
        shouldEnable([
          UsageFields.DataProcessingRegistrationsConcludedAsCsv,
          UsageFields.DataProcessingRegistrationNamesAsCsv,
        ])
      ),

      //GDPR
      this.store
        .select(selectITSystemUsageEnableGdprDataTypes)
        .pipe(shouldEnable([UsageFields.SensitiveDataLevelsAsCsv])),
      this.store
        .select(selectITSystemUsageEnableGdprConductedRiskAssessment)
        .pipe(shouldEnable([UsageFields.RiskAssessmentDate, UsageFields.RiskSupervisionDocumentationName])),
      this.store
        .select(selectITSystemUsageEnableGdprPlannedRiskAssessmentDate)
        .pipe(shouldEnable([UsageFields.PlannedRiskAssessmentDate])),
      this.store.select(selectITSystemUsageEnableGdprPurpose).pipe(shouldEnable([UsageFields.GeneralPurpose])),
      this.store.select(selectITSystemUsageEnableGdprHostedAt).pipe(shouldEnable([UsageFields.HostedAt])),
      this.store
        .select(selectITSystemUsageEnableGdprDocumentation)
        .pipe(shouldEnable([UsageFields.LinkToDirectoryName])),

      //Organization
      this.store
        .select(selectITSystemUsageEnableResponsibleUnit)
        .pipe(shouldEnable([UsageFields.ResponsibleOrganizationUnitName])),
      this.store
        .select(selectITSystemUsageEnableRelevantUnits)
        .pipe(shouldEnable([UsageFields.RelevantOrganizationUnitNamesAsCsv])),

      //Relations
      this.store
        .select(selectITSystemUsageEnableOutgoingRelations)
        .pipe(
          shouldEnable([UsageFields.OutgoingRelatedItSystemUsagesNamesAsCsv, UsageFields.DependsOnInterfacesNamesAsCsv])
        ),
      this.store
        .select(selectITSystemUsageEnableIncomingRelations)
        .pipe(shouldEnable([UsageFields.IncomingRelatedItSystemUsagesNamesAsCsv])),

      //Archiving
      this.store.select(selectITSystemUsageEnableTabArchiving).pipe(shouldEnable([UsageFields.ArchiveDuty])),
      this.store.select(selectITSystemUsageEnableDocumentBearing).pipe(shouldEnable([UsageFields.IsHoldingDocument])),
      this.store
        .select(selectITSystemUsageEnableJournalPeriods)
        .pipe(shouldEnable([UsageFields.ActiveArchivePeriodEndDate])),

      //Roles
      this.store.select(selectITSystemUsageEnableTabSystemRoles).pipe(shouldEnable([], ['Roles.Role'])),

      //KLE
      this.store
        .select(selectITSystemUsageEnableInheritedKle)
        .pipe(shouldEnable([UsageFields.ItSystemKLEIdsAsCsv, UsageFields.ItSystemKLENamesAsCsv])),

      //References
      this.store
        .select(selectITSystemUsageEnableLocalReferences)
        .pipe(shouldEnable([UsageFields.LocalReferenceTitle, UsageFields.LocalReferenceDocumentId])),
    ];

    return combineLatest(configObservables);
  }

  private getDataProcessingGridConfig(): Observable<UIConfigGridApplication[]> {
    const configObservables: Observable<UIConfigGridApplication>[] = [
      // Frontpage
      this.store.select(selectDprEnableDataResponsible).pipe(shouldEnable([DprFields.DataResponsibleUuid])),
      this.store.select(selectDprEnableStatus).pipe(shouldEnable([DprFields.IsActive])),
      this.store
        .select(selectDprEnableLastChangedBy)
        .pipe(shouldEnable([DprFields.LastChangedById, DprFields.LastChangedByName])),
      this.store.select(selectDprEnableLastChangedAt).pipe(shouldEnable([DprFields.LastChangedAt])),
      this.store
        .select(selectDprEnableAgreementConcluded)
        .pipe(shouldEnable([DprFields.IsAgreementConcluded, DprFields.AgreementConcludedAt])),
      this.store
        .select(selectDprEnableTransferBasis)
        .pipe(shouldEnable([DprFields.BasisForTransferUuid, DprFields.TransferToInsecureThirdCountries])),
      this.store.select(selectDprEnableProcessors).pipe(shouldEnable([DprFields.DataProcessorNamesAsCsv])),
      this.store.select(selectDprEnableSubProcessors).pipe(shouldEnable([DprFields.SubDataProcessorNamesAsCsv])),
      // IT Systems
      combineAND([this.store.select(selectShowItSystemModule), this.store.select(selectDprEnableItSystems)]).pipe(
        shouldEnable([DprFields.SystemNamesAsCsv, DprFields.SystemUuidsAsCsv])
      ),

      // Contracts
      this.store.select(selectDprEnableMainContract).pipe(shouldEnable([DprFields.ActiveAccordingToMainContract])),
      combineAND([
        this.store.select(selectShowItContractModule),
        this.store.select(selectDprEnableAssociatedContracts),
      ]).pipe(shouldEnable([DprFields.ContractNamesAsCsv])),

      // Oversight
      this.store.select(selectDprEnabledOversightInterval).pipe(shouldEnable([DprFields.OversightInterval])),
      this.store
        .select(selectDprEnableScheduledInspectionDate)
        .pipe(shouldEnable([DprFields.OversightScheduledInspectionDate])),
      this.store.select(selectDprEnableOversightOptions).pipe(shouldEnable([DprFields.OversightOptionNamesAsCsv])),
      this.store
        .select(selectDprEnableOversights)
        .pipe(shouldEnable([DprFields.IsOversightCompleted, DprFields.LatestOversightDate])),

      // Roles
      this.store.select(selectDprEnableRoles).pipe(shouldEnable([], ['Roles.Role'])),

      // References
      this.store
        .select(selectDprEnableReferences)
        .pipe(shouldEnable([DprFields.MainReferenceTitle, DprFields.MainReferenceUserAssignedId])),
    ];

    return combineLatest(configObservables);
  }

  private getGdprGridConfig(): Observable<UIConfigGridApplication[]> {
    return combineLatest([
      this.store
        .select(selectITSystemUsageEnableGdprDataTypes)
        .pipe(
          shouldEnable([
            GdprFields.NO_DATA,
            GdprFields.PERSONAL_DATA,
            GdprFields.PERSONAL_DATA_CPR,
            GdprFields.PERSONAL_DATA_SOCIAL_PROBLEMS,
            GdprFields.PERSONAL_DATA_SOCIAL_OTHER_PRIVATE_MATTERS,
            GdprFields.SENSITIVE_DATA,
            GdprFields.LEGAL_DATA,
            GdprFields.SENSITIVE_DATA_TYPES,
          ])
        ),

      this.store
        .select(selectITSystemUsageEnableGdprBusinessCritical)
        .pipe(shouldEnable([GdprFields.BUSINESS_CRITICAL_NAME])),

      this.store
        .select(selectITSystemUsageEnableGdprConductedRiskAssessment)
        .pipe(
          shouldEnable([
            GdprFields.RISK_ASSESSMENT_NAME,
            GdprFields.RISK_ASSESSMENT_DATE,
            GdprFields.PRE_RISK_ASSESSMENT_NAME,
          ])
        ),

      this.store
        .select(selectITSystemUsageEnableGdprPlannedRiskAssessmentDate)
        .pipe(shouldEnable([GdprFields.PLANNED_RISK_ASSESSMENT_DATE])),

      this.store.select(selectITSystemUsageEnableGdprDpiaConducted).pipe(shouldEnable([GdprFields.DPIA_NAME])),

      this.store.select(selectITSystemUsageEnableGdprHostedAt).pipe(shouldEnable([GdprFields.HOSTED_AT_NAME])),

      combineAND([
        this.store.select(selectITSystemUsageEnableDataProcessing),
        this.store.select(selectShowDataProcessingRegistrations),
      ]).pipe(shouldEnable([GdprFields.DATA_PROCESSING_AGREEMENT_CONCLUDED])),

      this.store.select(selectITSystemUsageEnableGdprDocumentation).pipe(shouldEnable([GdprFields.LINK_TO_DIRECTORY])),
    ]);
  }

  private applyAllUIConfigToGridColumns(applications: UIConfigGridApplication[], columns: GridColumn[]) {
    let updatedColumns: GridColumn[] = [...columns];
    applications.forEach(
      (application) => (updatedColumns = this.applyUIConfigToGridColumns(application, updatedColumns))
    );
    return updatedColumns;
  }

  private applyUIConfigToGridColumns(application: UIConfigGridApplication, columns: GridColumn[]) {
    const updatedColumns = columns.map((column) => {
      if (
        application.columnNamesToConfigure.has(column.field) ||
        Array.from(application.columnNameSubstringsToConfigure || []).some((substring) =>
          column.field.includes(substring)
        )
      ) {
        return {
          ...column,
          hidden: column.hidden || !application.shouldEnable,
          disabledByUIConfig: !application.shouldEnable,
        };
      }
      return column;
    });

    return updatedColumns;
  }

  private verifyColumn(application: UIConfigGridApplication, column: GridColumn) {
    if (
      application.columnNamesToConfigure.has(column.field) ||
      Array.from(application.columnNameSubstringsToConfigure || []).some((substring) =>
        column.field.includes(substring)
      )
    ) {
      return application.shouldEnable;
    }
    return null;
  }
}

function shouldEnable(
  columnNamesToConfigure: string[],
  columnNameSubstringsToConfigure: string[] = []
): (source: Observable<boolean>) => Observable<UIConfigGridApplication> {
  return (source: Observable<boolean>) =>
    source.pipe(
      map((shouldEnable) => ({
        shouldEnable,
        columnNamesToConfigure: new Set(columnNamesToConfigure),
        columnNameSubstringsToConfigure: new Set(columnNameSubstringsToConfigure),
      }))
    );
}
