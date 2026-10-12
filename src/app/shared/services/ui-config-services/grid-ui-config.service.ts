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
  selectDprEnableAndRecommendedAgreementConcluded,
  selectDprEnableAndRecommendedAssociatedContracts,
  selectDprEnableAndRecommendedDataResponsible,
  selectDprEnableAndRecommendedOversightInterval,
  selectDprEnableAndRecommendedItSystems,
  selectDprEnableAndRecommendedLastChangedAt,
  selectDprEnableAndRecommendedLastChangedBy,
  selectDprEnableAndRecommendedMainContract,
  selectDprEnableAndRecommendedOversightOptions,
  selectDprEnableAndRecommendedOversights,
  selectDprEnableAndRecommendedProcessors,
  selectDprEnableAndRecommendedReferences,
  selectDprEnableAndRecommendedResponsibleOrgUnit,
  selectDprEnableAndRecommendedRoles,
  selectDprEnableAndRecommendedScheduledInspectionDate,
  selectDprEnableAndRecommendedStatus,
  selectDprEnableAndRecommendedSubProcessors,
  selectDprEnableAndRecommendedTransferBasis,
  selectItContractsEnableAndRecommendedSupplier,
  selectItContractEnableAndRecommendedContractId,
  selectItContractEnableAndRecommendedContractRoles,
  selectItContractEnableAndRecommendedDataProcessing,
  selectItContractEnableAndRecommendedReferences,
  selectItContractEnableAndRecommendedRelations,
  selectItContractEnableAndRecommendedSystemUsages,
  selectItContractsEnableAndRecommendedAgreementDeadlines,
  selectItContractsEnableAndRecommendedAgreementPeriod,
  selectItContractsEnableAndRecommendedContractType,
  selectItContractsEnableAndRecommendedCriticality,
  selectItContractsEnableAndRecommendedCreatedBy,
  selectItContractsEnableAndRecommendedlastModifedBy,
  selectItContractsEnableAndRecommendedlastModifedDate,
  selectItContractsEnableAndRecommendedExternalPayment,
  selectItContractsEnableAndRecommendedExternalSigner,
  selectItContractsEnableAndRecommendedInternalPayment,
  selectItContractsEnableAndRecommendedInternalSigner,
  selectItContractsEnableAndRecommendedIsActive,
  selectItContractsEnableAndRecommendedNotes,
  selectItContractsEnableAndRecommendedParentContract,
  selectItContractsEnableAndRecommendedPaymentModel,
  selectItContractsEnableAndRecommendedProcurementInitiated,
  selectItContractsEnableAndRecommendedProcurementPlan,
  selectItContractsEnableAndRecommendedProcurementStrategy,
  selectItContractsEnableAndRecommendedPurchaseForm,
  selectItContractsEnableAndRecommendedResponsibleUnit,
  selectItContractsEnableAndRecommendedTemplate,
  selectItContractsEnableAndRecommendedTermination,
  selectITSystemUsageEnableAndRecommendedAmountOfUsers,
  selectITSystemUsageEnableAndRecommendedAssociatedContracts,
  selectITSystemUsageEnableAndRecommendedCatalogArchiveDuty,
  selectITSystemUsageEnableAndRecommendedCatalogArchiveDutyComment,
  selectITSystemUsageEnableAndRecommendedContainsAITechnology,
  selectITSystemUsageEnableAndRecommendedCriticalityFieldsLastChanged,
  selectITSystemUsageEnableAndRecommendedDataClassification,
  selectITSystemUsageEnableAndRecommendedDataProcessing,
  selectITSystemUsageEnableAndRecommendedDescription,
  selectITSystemUsageEnableAndRecommendedDocumentBearing,
  selectITSystemUsageEnableAndRecommendedSystemId,
  selectITSystemUsageEnableAndRecommendedFrontPageUsagePeriod,
  selectITSystemUsageEnableAndRecommendedGdprConductedRiskAssessment,
  selectITSystemUsageEnableAndRecommendedGdprDataTypes,
  selectITSystemUsageEnableAndRecommendedGdprDocumentation,
  selectITSystemUsageEnableAndRecommendedGdprDpiaConducted,
  selectITSystemUsageEnableAndRecommendedGdprIsDataProcessingAgreementRequired,
  selectITSystemUsageEnableAndRecommendedGdprPlannedRiskAssessmentDate,
  selectITSystemUsageEnableAndRecommendedGdprPurpose,
  selectITSystemUsageEnableAndRecommendedGdprRetentionPeriod,
  selectITSystemUsageEnableAndRecommendedGdprRiskAssessmentResult,
  selectITSystemUsageEnableAndRecommendedGdprTechnicalPrecautions,
  selectITSystemUsageEnableAndRecommendedGdprUserSupervision,
  selectITSystemUsageEnableAndRecommendedGeneralHostedAt,
  selectITSystemUsageEnableAndRecommendedGeneralPurpose,
  selectITSystemUsageEnableAndRecommendedIncomingRelations,
  selectITSystemUsageEnableAndRecommendedInheritedKle,
  selectITSystemUsageEnableAndRecommendedIsBusinessCritical,
  selectITSystemUsageEnableAndRecommendedIsSociallyCritical,
  selectITSystemUsageEnableAndRecommendedItInterfaceIds,
  selectITSystemUsageEnableAndRecommendedItInterfaceVersions,
  selectITSystemUsageEnableAndRecommendedJournalPeriods,
  selectITSystemUsageEnableAndRecommendedLastEditedAt,
  selectITSystemUsageEnableAndRecommendedLastEditedBy,
  selectITSystemUsageEnableAndRecommendedLifeCycleStatus,
  selectITSystemUsageEnableAndRecommendedLocalKle,
  selectITSystemUsageEnableAndRecommendedLocalReferences,
  selectITSystemUsageEnableAndRecommendedLicensingAndCodeModels,
  selectITSystemUsageEnableAndRecommendedOutgoingRelations,
  selectITSystemUsageEnableAndRecommendedSelectContractToDetermineIfItSystemIsActive,
  selectITSystemUsageEnableAndRecommendedStatus,
  selectITSystemUsageEnableAndRecommendedSystemUsageCriticalityLevel,
  selectITSystemUsageEnableAndRecommendedTabArchiving,
  selectITSystemUsageEnableAndRecommendedTabOrganization,
  selectITSystemUsageEnableAndRecommendedTabSystemRoles,
  selectITSystemUsageEnableAndRecommendedTakenIntoUsageBy,
  selectITSystemUsageEnableAndRecommendedTechnicalSystemType,
  selectITSystemUsageEnableAndRecommendedVersion,
  selectITSystemUsageEnableAndRecommendedWebAccessibility,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { UIModuleConfigKey } from '../../enums/ui-module-config-key';
import { filterGridColumnsByUIConfig } from '../../helpers/grid-config-helper';
import { combineAND, mapUIConfigStatusToEnabled } from '../../helpers/observable-helpers';
import { GridColumn } from '../../models/grid-column.model';
import { UIConfigGridApplication } from '../../models/ui-config/ui-config-grid-application';

@Injectable({
  providedIn: 'root',
})
export class GridUIConfigService {
  constructor(private store: Store) {}

  public filterGridColumnsByUIConfig(
    moduleKey: UIModuleConfigKey,
  ): (source: Observable<GridColumn[]>) => Observable<GridColumn[]> {
    return (source) =>
      source.pipe(
        combineLatestWith(this.getUIConfigApplications(moduleKey)),
        map(([gridColumns, uiConfig]) => {
          return this.applyAllUIConfigToGridColumns(uiConfig, gridColumns);
        }),
        filterGridColumnsByUIConfig(),
      );
  }

  public isColumnEnabled(column: GridColumn, applications: UIConfigGridApplication[]) {
    let enabled = true;

    for (const application of applications) {
      const result = this.verifyColumn(application, column);
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
      this.store.select(selectItContractEnableAndRecommendedContractId).pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.ContractId])),
      this.store.select(selectItContractsEnableAndRecommendedContractType).pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.ContractTypeUuid])),
      this.store.select(selectItContractsEnableAndRecommendedTemplate).pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.ContractTemplateUuid])),
      this.store.select(selectItContractsEnableAndRecommendedCriticality).pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.CriticalityUuid])),
      this.store.select(selectItContractsEnableAndRecommendedPurchaseForm).pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.PurchaseFormUuid])),
      this.store.select(selectItContractsEnableAndRecommendedIsActive).pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.IsActive])),
      this.store
        .select(selectItContractsEnableAndRecommendedAgreementPeriod)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.Concluded, ContractFields.ExpirationDate])),
      this.store.select(selectItContractsEnableAndRecommendedNotes).pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.Note])),

      this.store.select(selectItContractsEnableAndRecommendedParentContract).pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.ParentContractName])),

      this.store
        .select(selectItContractsEnableAndRecommendedResponsibleUnit)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.ResponsibleOrgUnitName])),
      this.store.select(selectItContractsEnableAndRecommendedInternalSigner).pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.ContractSigner])),

      this.store.select(selectItContractsEnableAndRecommendedSupplier).pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.SupplierName])),
      this.store.select(selectItContractsEnableAndRecommendedExternalSigner).pipe(mapUIConfigStatusToEnabled(), shouldEnable([])),

      this.store
        .select(selectItContractsEnableAndRecommendedProcurementStrategy)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.ProcurementStrategyUuid])),
      this.store
        .select(selectItContractsEnableAndRecommendedProcurementPlan)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.ProcurementPlanYear])),
      this.store
        .select(selectItContractsEnableAndRecommendedProcurementInitiated)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.ProcurementInitiated])),

      this.store.select(selectItContractsEnableAndRecommendedCreatedBy).pipe(mapUIConfigStatusToEnabled(), shouldEnable([])),
      this.store
        .select(selectItContractsEnableAndRecommendedlastModifedBy)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.LastEditedByUserName])),
      this.store.select(selectItContractsEnableAndRecommendedlastModifedDate).pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.LastEditedAtDate])),

      // IT Systems
      combineAND([
        this.store.select(selectItContractEnableAndRecommendedSystemUsages).pipe(mapUIConfigStatusToEnabled()),
        this.store.select(selectShowItSystemModule),
      ]).pipe(shouldEnable([ContractFields.ItSystemUsages, ContractFields.ItSystemUsageUuidsAsCsv])),

      combineAND([
        this.store.select(selectItContractEnableAndRecommendedRelations).pipe(mapUIConfigStatusToEnabled()),
        this.store.select(selectShowItSystemModule),
      ]).pipe(shouldEnable([ContractFields.NumberOfAssociatedSystemRelations])),

      //Data processing
      combineAND([
        this.store.select(selectShowDataProcessingRegistrations),
        this.store.select(selectItContractEnableAndRecommendedDataProcessing).pipe(mapUIConfigStatusToEnabled()),
      ]).pipe(shouldEnable([ContractFields.DataProcessingAgreements])),

      //Agreement periods
      this.store
        .select(selectItContractsEnableAndRecommendedAgreementDeadlines)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.Duration, ContractFields.OptionExtendUuid, ContractFields.IrrevocableTo])),

      this.store
        .select(selectItContractsEnableAndRecommendedTermination)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.TerminationDeadlineUuid, ContractFields.TerminatedAt, ContractFields.ByEnding])),

      //Economy
      this.store
        .select(selectItContractsEnableAndRecommendedExternalPayment)
        .pipe(
          mapUIConfigStatusToEnabled(),
          shouldEnable([
            ContractFields.AccumulatedAcquisitionCost,
            ContractFields.AccumulatedOperationCost,
            ContractFields.AccumulatedOtherCost,
            ContractFields.LatestAuditDate,
            ContractFields.AuditStatus,
            ContractFields.ExternalPaymentOrganizationUnitsCsv,
          ]),
        ),

      this.store
        .select(selectItContractsEnableAndRecommendedInternalPayment)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.InternalPaymentOrganizationUnitsCsv])),

      this.store
        .select(selectItContractsEnableAndRecommendedPaymentModel)
        .pipe(
          mapUIConfigStatusToEnabled(),
          shouldEnable([
            ContractFields.OperationRemunerationBegunDate,
            ContractFields.PaymentModelUuid,
            ContractFields.PaymentFrequencyUuid,
          ]),
        ),

      //Contract Roles
      this.store.select(selectItContractEnableAndRecommendedContractRoles).pipe(mapUIConfigStatusToEnabled(), shouldEnable([], ['Roles.Role'])),

      //References
      this.store
        .select(selectItContractEnableAndRecommendedReferences)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([ContractFields.ActiveReferenceTitle, ContractFields.ActiveReferenceExternalReferenceId])),
    ];

    return combineLatest(configObservables);
  }

  private getItSystemUsageGridConfig(): Observable<UIConfigGridApplication[]> {
    const configObservables: Observable<UIConfigGridApplication>[] = [
      //Frontpage
      this.store.select(selectITSystemUsageEnableAndRecommendedSystemId).pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.LocalSystemId])),
      this.store.select(selectITSystemUsageEnableAndRecommendedVersion).pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.Version])),
      this.store.select(selectITSystemUsageEnableAndRecommendedAmountOfUsers).pipe(mapUIConfigStatusToEnabled(), shouldEnable([])),
      this.store.select(selectITSystemUsageEnableAndRecommendedDataClassification).pipe(mapUIConfigStatusToEnabled(), shouldEnable([])),
      this.store.select(selectITSystemUsageEnableAndRecommendedDescription).pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.Note])),
      this.store.select(selectITSystemUsageEnableAndRecommendedTakenIntoUsageBy).pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.ObjectOwnerName])),
      this.store.select(selectITSystemUsageEnableAndRecommendedLastEditedBy).pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.LastChangedByName])),
      this.store.select(selectITSystemUsageEnableAndRecommendedLastEditedAt).pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.LastChangedAt])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedLifeCycleStatus)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.LifeCycleStatus, UsageFields.ActiveAccordingToLifeCycle])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedFrontPageUsagePeriod)
        .pipe(
          mapUIConfigStatusToEnabled(),
          shouldEnable([
            UsageFields.ExpirationDate,
            UsageFields.Concluded,
            UsageFields.ActiveAccordingToValidityPeriod,
          ]),
        ),
      this.store.select(selectITSystemUsageEnableAndRecommendedStatus).pipe(mapUIConfigStatusToEnabled(), shouldEnable([])),
      this.store.select(selectITSystemUsageEnableAndRecommendedAmountOfUsers).pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.UserCount])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedDataClassification)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.ItSystemCategoriesUuid])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedContainsAITechnology)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.ContainsAITechnology])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedWebAccessibility)
        .pipe(
          mapUIConfigStatusToEnabled(),
          shouldEnable([
            UsageFields.WebAccessibilityCompliance,
            UsageFields.LastWebAccessibilityCheck,
            UsageFields.WebAccessibilityNotes,
          ]),
        ),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedIsSociallyCritical)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.IsSociallyCritical])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedIsBusinessCritical)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.IsBusinessCritical])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedCriticalityFieldsLastChanged)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.CriticalityFieldsLastChanged])),

      //Contracts
      combineAND([
        this.store.select(selectShowItContractModule),
        this.store.select(selectITSystemUsageEnableAndRecommendedSelectContractToDetermineIfItSystemIsActive).pipe(mapUIConfigStatusToEnabled()),
      ]).pipe(shouldEnable([UsageFields.MainContractIsActive, UsageFields.MainContractSupplierName])),

      combineAND([
        this.store.select(selectShowItContractModule),
        this.store.select(selectITSystemUsageEnableAndRecommendedAssociatedContracts).pipe(mapUIConfigStatusToEnabled()),
      ]).pipe(shouldEnable([UsageFields.AssociatedContractsNamesCsv])),

      //Data processing
      combineAND([
        this.store.select(selectShowDataProcessingRegistrations),
        this.store.select(selectITSystemUsageEnableAndRecommendedDataProcessing).pipe(mapUIConfigStatusToEnabled()),
      ]).pipe(
        shouldEnable([
          UsageFields.DataProcessingRegistrationsConcludedAsCsv,
          UsageFields.DataProcessingRegistrationNamesAsCsv,
        ]),
      ),

      //GDPR
      this.store
        .select(selectITSystemUsageEnableAndRecommendedGdprDataTypes)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.SensitiveDataLevelsAsCsv])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedGdprConductedRiskAssessment)
        .pipe(
          mapUIConfigStatusToEnabled(),
          shouldEnable([
            UsageFields.RiskAssessmentDate,
            UsageFields.RiskSupervisionDocumentationName,
            UsageFields.RiskAssessmentConducted,
          ]),
        ),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedGdprPlannedRiskAssessmentDate)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.PlannedRiskAssessmentDate])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedGdprRiskAssessmentResult)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.RiskAssessmentResult])),
      this.store.select(selectITSystemUsageEnableAndRecommendedGeneralPurpose).pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.GeneralPurpose])),
      this.store.select(selectITSystemUsageEnableAndRecommendedGdprPurpose).pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.ProcessingPurpose])),
      this.store.select(selectITSystemUsageEnableAndRecommendedGeneralHostedAt).pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.HostedAt])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedGdprDocumentation)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.LinkToDirectoryName])),
      this.store.select(selectITSystemUsageEnableAndRecommendedGdprDpiaConducted).pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.DpiaConducted])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedSystemUsageCriticalityLevel)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.SystemUsageCriticalityLevelUuid])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedGdprIsDataProcessingAgreementRequired)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.IsDataProcessingAgreementRequired])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedTechnicalSystemType)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.TechnicalSystemTypeNamesAsCsv])),

      //Organization
      this.store
        .select(selectITSystemUsageEnableAndRecommendedTabOrganization)
        .pipe(
          mapUIConfigStatusToEnabled(),
          shouldEnable([UsageFields.ResponsibleOrganizationUnitName, UsageFields.RelevantOrganizationUnitNamesAsCsv]),
        ),

      //Relations
      this.store
        .select(selectITSystemUsageEnableAndRecommendedOutgoingRelations)
        .pipe(
          mapUIConfigStatusToEnabled(),
          shouldEnable([
            UsageFields.OutgoingRelatedItSystemUsagesNamesAsCsv,
            UsageFields.DependsOnInterfacesNamesAsCsv,
          ]),
        ),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedIncomingRelations)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.IncomingRelatedItSystemUsagesNamesAsCsv])),

      //Archiving
      this.store.select(selectITSystemUsageEnableAndRecommendedTabArchiving).pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.ArchiveDuty])),
      this.store.select(selectITSystemUsageEnableAndRecommendedDocumentBearing).pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.IsHoldingDocument])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedJournalPeriods)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.ActiveArchivePeriodEndDate])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedCatalogArchiveDuty)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.CatalogArchiveDuty])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedCatalogArchiveDutyComment)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.CatalogArchiveDutyComment])),

      //Roles
      this.store.select(selectITSystemUsageEnableAndRecommendedTabSystemRoles).pipe(mapUIConfigStatusToEnabled(), shouldEnable([], ['Roles.Role'])),

      //KLE
      this.store
        .select(selectITSystemUsageEnableAndRecommendedInheritedKle)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.ItSystemKLEIdsAsCsv, UsageFields.ItSystemKLENamesAsCsv])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedLocalKle)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.LocalKleIdsAsCsv, UsageFields.LocalKleNamesAsCsv])),

      //References
      this.store
        .select(selectITSystemUsageEnableAndRecommendedLocalReferences)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.LocalReferenceTitle, UsageFields.LocalReferenceDocumentId])),

      //Interfaces
      this.store.select(selectITSystemUsageEnableAndRecommendedItInterfaceIds).pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.ItInterfaceIdsAsCsv])),
      this.store
        .select(selectITSystemUsageEnableAndRecommendedItInterfaceVersions)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.ItInterfaceVersionsAsCsv])),

      //Licensing and Code Models
      this.store
        .select(selectITSystemUsageEnableAndRecommendedLicensingAndCodeModels)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([UsageFields.LicensingAndCodeModels])),
    ];

    return combineLatest(configObservables);
  }

  private getDataProcessingGridConfig(): Observable<UIConfigGridApplication[]> {
    const configObservables: Observable<UIConfigGridApplication>[] = [
      // Frontpage
      this.store.select(selectDprEnableAndRecommendedDataResponsible).pipe(mapUIConfigStatusToEnabled(), shouldEnable([DprFields.DataResponsibleUuid])),
      this.store.select(selectDprEnableAndRecommendedStatus).pipe(mapUIConfigStatusToEnabled(), shouldEnable([DprFields.IsActive])),
      this.store
        .select(selectDprEnableAndRecommendedLastChangedBy)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([DprFields.LastChangedById, DprFields.LastChangedByName])),
      this.store.select(selectDprEnableAndRecommendedLastChangedAt).pipe(mapUIConfigStatusToEnabled(), shouldEnable([DprFields.LastChangedAt])),
      this.store
        .select(selectDprEnableAndRecommendedAgreementConcluded)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([DprFields.IsAgreementConcluded, DprFields.AgreementConcludedAt])),
      this.store
        .select(selectDprEnableAndRecommendedTransferBasis)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([DprFields.BasisForTransferUuid, DprFields.TransferToInsecureThirdCountries])),
      this.store.select(selectDprEnableAndRecommendedProcessors).pipe(mapUIConfigStatusToEnabled(), shouldEnable([DprFields.DataProcessorNamesAsCsv])),
      this.store.select(selectDprEnableAndRecommendedSubProcessors).pipe(mapUIConfigStatusToEnabled(), shouldEnable([DprFields.SubDataProcessorNamesAsCsv])),
      this.store.select(selectDprEnableAndRecommendedResponsibleOrgUnit).pipe(mapUIConfigStatusToEnabled(), shouldEnable([DprFields.ResponsibleOrgUnitName])),
      // IT Systems
      combineAND([this.store.select(selectShowItSystemModule), this.store.select(selectDprEnableAndRecommendedItSystems).pipe(mapUIConfigStatusToEnabled())]).pipe(
        shouldEnable([DprFields.SystemNamesAsCsv, DprFields.SystemUuidsAsCsv]),
      ),

      // Contracts
      this.store.select(selectDprEnableAndRecommendedMainContract).pipe(mapUIConfigStatusToEnabled(), shouldEnable([DprFields.ActiveAccordingToMainContract])),
      combineAND([
        this.store.select(selectShowItContractModule),
        this.store.select(selectDprEnableAndRecommendedAssociatedContracts).pipe(mapUIConfigStatusToEnabled()),
      ]).pipe(shouldEnable([DprFields.ContractNamesAsCsv])),

      // Oversight
      this.store.select(selectDprEnableAndRecommendedOversightInterval).pipe(mapUIConfigStatusToEnabled(), shouldEnable([DprFields.OversightInterval])),
      this.store
        .select(selectDprEnableAndRecommendedScheduledInspectionDate)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([DprFields.OversightScheduledInspectionDate])),
      this.store.select(selectDprEnableAndRecommendedOversightOptions).pipe(mapUIConfigStatusToEnabled(), shouldEnable([DprFields.OversightOptionNamesAsCsv])),
      this.store
        .select(selectDprEnableAndRecommendedOversights)
        .pipe(
          mapUIConfigStatusToEnabled(),
          shouldEnable([
            DprFields.IsOversightCompleted,
            DprFields.LatestOversightDate,
            DprFields.LatestOversightRemark,
            DprFields.LatestOversightReportLink,
            DprFields.LatestOversightReportLinkName,
          ]),
        ),

      // Roles
      this.store.select(selectDprEnableAndRecommendedRoles).pipe(mapUIConfigStatusToEnabled(), shouldEnable([], ['Roles.Role'])),

      // References
      this.store
        .select(selectDprEnableAndRecommendedReferences)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([DprFields.MainReferenceTitle, DprFields.MainReferenceUserAssignedId])),
    ];

    return combineLatest(configObservables);
  }

  private getGdprGridConfig(): Observable<UIConfigGridApplication[]> {
    return combineLatest([
      this.store
        .select(selectITSystemUsageEnableAndRecommendedGdprDataTypes)
        .pipe(
          mapUIConfigStatusToEnabled(),
          shouldEnable([
            GdprFields.NO_DATA,
            GdprFields.PERSONAL_DATA,
            GdprFields.PERSONAL_DATA_CPR,
            GdprFields.PERSONAL_DATA_SOCIAL_PROBLEMS,
            GdprFields.PERSONAL_DATA_SOCIAL_OTHER_PRIVATE_MATTERS,
            GdprFields.SENSITIVE_DATA,
            GdprFields.LEGAL_DATA,
            GdprFields.SENSITIVE_DATA_TYPES,
          ]),
        ),

      this.store
        .select(selectITSystemUsageEnableAndRecommendedGdprConductedRiskAssessment)
        .pipe(
          mapUIConfigStatusToEnabled(),
          shouldEnable([
            GdprFields.RISK_ASSESSMENT_NAME,
            GdprFields.RISK_ASSESSMENT_DATE,
            GdprFields.PRE_RISK_ASSESSMENT_NAME,
            GdprFields.RISK_ASSESMENT_NOTES,
          ]),
        ),

      this.store
        .select(selectITSystemUsageEnableAndRecommendedGdprPlannedRiskAssessmentDate)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([GdprFields.PLANNED_RISK_ASSESSMENT_DATE])),

      this.store
        .select(selectITSystemUsageEnableAndRecommendedGdprRiskAssessmentResult)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([GdprFields.PRE_RISK_ASSESSMENT_NAME])),

      this.store
        .select(selectITSystemUsageEnableAndRecommendedGdprDpiaConducted)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([GdprFields.DPIA_NAME, GdprFields.DPIA_DATE])),

      combineAND([
        this.store.select(selectITSystemUsageEnableAndRecommendedDataProcessing).pipe(mapUIConfigStatusToEnabled()),
        this.store.select(selectShowDataProcessingRegistrations),
      ]).pipe(shouldEnable([GdprFields.DATA_PROCESSING_AGREEMENT_CONCLUDED])),

      this.store.select(selectITSystemUsageEnableAndRecommendedGdprDocumentation).pipe(mapUIConfigStatusToEnabled(), shouldEnable([GdprFields.LINK_TO_DIRECTORY])),

      this.store
        .select(selectITSystemUsageEnableAndRecommendedGdprTechnicalPrecautions)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([GdprFields.TECHNICAL_SUPERVISION_DOCUMENTATION_NAME])),

      this.store
        .select(selectITSystemUsageEnableAndRecommendedGdprUserSupervision)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([GdprFields.USER_SUPERVISION, GdprFields.USER_SUPERVISION_DOCUMENTATION_NAME])),

      this.store
        .select(selectITSystemUsageEnableAndRecommendedGdprRetentionPeriod)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([GdprFields.NEXT_DATA_RETENTION_EVALUATION_DATE])),

      this.store
        .select(selectDprEnableAndRecommendedTransferBasis)
        .pipe(mapUIConfigStatusToEnabled(), shouldEnable([GdprFields.COUNTRIES_SUBJECT_TO_DATA_TRANSFER])),
    ]);
  }

  private applyAllUIConfigToGridColumns(applications: UIConfigGridApplication[], columns: GridColumn[]) {
    let updatedColumns: GridColumn[] = [...columns];
    applications.forEach(
      (application) => (updatedColumns = this.applyUIConfigToGridColumns(application, updatedColumns)),
    );
    return updatedColumns;
  }

  private applyUIConfigToGridColumns(application: UIConfigGridApplication, columns: GridColumn[]) {
    const updatedColumns = columns.map((column) => {
      if (
        application.columnNamesToConfigure.has(column.field) ||
        Array.from(application.columnNameSubstringsToConfigure || []).some((substring) =>
          column.field.includes(substring),
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
        column.field.includes(substring),
      )
    ) {
      return application.shouldEnable;
    }
    return null;
  }
}

function shouldEnable(
  columnNamesToConfigure: string[],
  columnNameSubstringsToConfigure: string[] = [],
): (source: Observable<boolean>) => Observable<UIConfigGridApplication> {
  return (source: Observable<boolean>) =>
    source.pipe(
      map((shouldEnable) => ({
        shouldEnable,
        columnNamesToConfigure: new Set(columnNamesToConfigure),
        columnNameSubstringsToConfigure: new Set(columnNameSubstringsToConfigure),
      })),
    );
}
