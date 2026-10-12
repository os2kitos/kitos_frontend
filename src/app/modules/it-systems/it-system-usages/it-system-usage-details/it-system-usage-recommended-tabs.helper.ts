import { RegistrationRecommendedBadges, recommendedField, hasText, hasValue } from 'src/app/shared/helpers/registration-recommended-badges.helper';
import { Selector, Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ItContractV2Service,
  APIYesNoDontKnowChoice,
} from 'src/app/api/v2';
import {
  RecommendedBadgeState,
  recommendedCollectionFilled,
  combineRecommendedBadgeState,
  mapUIConfigStatusToRecommended,
} from 'src/app/shared/helpers/observable-helpers';
import { selectItSystemUsage, selectItSystemUsageArchiving, selectItSystemUsageGdpr, selectItSystemUsageGeneral } from 'src/app/store/it-system-usage/selectors';
import { selectItSystem } from 'src/app/store/it-system/selectors';
import {
  selectITSystemUsageEnableAndRecommendedActive,
  selectITSystemUsageEnableAndRecommendedAssociatedContracts,
  selectITSystemUsageEnableAndRecommendedSelectContractToDetermineIfItSystemIsActive,
  selectITSystemUsageEnableAndRecommendedOutgoingRelations,
  selectITSystemUsageEnableAndRecommendedInheritedKle,
  selectITSystemUsageEnableAndRecommendedLocalKle,
  selectITSystemUsageEnableAndRecommendedJournalPeriods,

  selectITSystemUsageEnableAndRecommendedAmountOfUsers,
  selectITSystemUsageEnableAndRecommendedArchiveDuty,
  selectITSystemUsageEnableAndRecommendedArchiveFrequency,
  selectITSystemUsageEnableAndRecommendedArchiveLocation,
  selectITSystemUsageEnableAndRecommendedArchiveSupplier,
  selectITSystemUsageEnableAndRecommendedArchiveTestLocation,
  selectITSystemUsageEnableAndRecommendedArchiveType,
  selectITSystemUsageEnableAndRecommendedContainsAITechnology,
  selectITSystemUsageEnableAndRecommendedDataClassification,
  selectITSystemUsageEnableAndRecommendedDescription,
  selectITSystemUsageEnableAndRecommendedDocumentBearing,
  selectITSystemUsageEnableAndRecommendedGdprConductedRiskAssessment,
  selectITSystemUsageEnableAndRecommendedGdprDataTypes,
  selectITSystemUsageEnableAndRecommendedGdprDocumentation,
  selectITSystemUsageEnableAndRecommendedGdprDpiaConducted,
  selectITSystemUsageEnableAndRecommendedGdprIsDataProcessingAgreementRequired,
  selectITSystemUsageEnableAndRecommendedGdprPlannedRiskAssessmentDate,
  selectITSystemUsageEnableAndRecommendedGdprPurpose,
  selectITSystemUsageEnableAndRecommendedGdprRetentionPeriod,
  selectITSystemUsageEnableAndRecommendedGdprTechnicalPrecautions,
  selectITSystemUsageEnableAndRecommendedGdprUserSupervision,
  selectITSystemUsageEnableAndRecommendedGeneralHostedAt,
  selectITSystemUsageEnableAndRecommendedIsBusinessCritical,
  selectITSystemUsageEnableAndRecommendedIsSociallyCritical,
  selectITSystemUsageEnableAndRecommendedLicensingAndCodeModels,
  selectITSystemUsageEnableAndRecommendedLifeCycleStatus,
  selectITSystemUsageEnableAndRecommendedCriticalityLevelDocumentation,
  selectITSystemUsageEnableAndRecommendedFrontPageUsagePeriod,
  selectITSystemUsageEnableAndRecommendedGeneralPurpose,
  selectITSystemUsageEnableAndRecommendedName,
  selectITSystemUsageEnableAndRecommendedNotes,
  selectITSystemUsageEnableAndRecommendedRegisteredCategories,
  selectITSystemUsageEnableAndRecommendedSystemId,
  selectITSystemUsageEnableAndRecommendedSystemUsageCriticalityLevel,
  selectITSystemUsageEnableAndRecommendedTechnicalSystemType,
  selectITSystemUsageEnableAndRecommendedVersion,
  selectITSystemUsageEnableAndRecommendedWebAccessibility,
} from 'src/app/store/organization/ui-module-customization/selectors';


function hasDependentGdprValue(choice: string | null | undefined, filled: boolean): boolean {
  return choice === APIYesNoDontKnowChoice.Yes ? filled : hasValue(choice);
}

function hasItems<T>(value: Array<T> | null | undefined): boolean {
  return !!value && value.length > 0;
}

export interface ItSystemUsageRecommendedTabBadges extends RegistrationRecommendedBadges {
  frontpage$: Observable<RecommendedBadgeState>;
  gdpr$: Observable<RecommendedBadgeState>;
  archiving$: Observable<RecommendedBadgeState>;
  contracts$: Observable<RecommendedBadgeState>;
  relations$: Observable<RecommendedBadgeState>;
  localKle$: Observable<RecommendedBadgeState>;
}

/**
 * Combines module-specific tab rules with the shared roles, advis and references
 * streams. Badge state is available even before the user visits a tab; collections
 * absent from the loaded registration are fetched only when recommended.
 */
export function getItSystemUsageRecommendedTabBadges(
  store: Store,
  contractsApi: ItContractV2Service,
  registrationBadges: RegistrationRecommendedBadges,
): ItSystemUsageRecommendedTabBadges {
  const usage$ = store.select(selectItSystemUsage);
  const general$ = store.select(selectItSystemUsageGeneral);
  const gdpr$ = store.select(selectItSystemUsageGdpr);
  const archiving$ = store.select(selectItSystemUsageArchiving);

  const generalField = recommendedField(store, general$);

  const gdprField = recommendedField(store, gdpr$);

  const archivingField = recommendedField(store, archiving$);

  const frontpage$ = combineRecommendedBadgeState([
    generalField(selectITSystemUsageEnableAndRecommendedName, (g) => hasText(g?.localCallName)),
    generalField(selectITSystemUsageEnableAndRecommendedSystemId, (g) => hasText(g?.localSystemId)),
    generalField(selectITSystemUsageEnableAndRecommendedVersion, (g) => hasText(g?.systemVersion)),
    generalField(selectITSystemUsageEnableAndRecommendedTechnicalSystemType, (g) => hasItems(g?.technicalSystemTypes)),
    generalField(selectITSystemUsageEnableAndRecommendedGeneralHostedAt, (g) => hasValue(g?.hostedAt)),
    generalField(selectITSystemUsageEnableAndRecommendedAmountOfUsers, (g) => hasValue(g?.numberOfExpectedUsers)),
    generalField(selectITSystemUsageEnableAndRecommendedDataClassification, (g) => hasValue(g?.dataClassification)),
    generalField(selectITSystemUsageEnableAndRecommendedContainsAITechnology, (g) => hasValue(g?.containsAITechnology)),
    generalField(selectITSystemUsageEnableAndRecommendedLicensingAndCodeModels, (g) =>
      hasItems(g?.licensingAndCodeModels),
    ),
    generalField(selectITSystemUsageEnableAndRecommendedGeneralPurpose, (g) => hasText(g?.purpose)),
    generalField(selectITSystemUsageEnableAndRecommendedDescription, (g) => hasText(g?.notes)),
    generalField(selectITSystemUsageEnableAndRecommendedIsBusinessCritical, (g) => hasValue(g?.isBusinessCritical)),
    generalField(selectITSystemUsageEnableAndRecommendedIsSociallyCritical, (g) => hasValue(g?.isSociallyCritical)),
    generalField(selectITSystemUsageEnableAndRecommendedSystemUsageCriticalityLevel, (g) =>
      hasValue(g?.systemUsageCriticalityLevel),
    ),
    generalField(selectITSystemUsageEnableAndRecommendedCriticalityLevelDocumentation, (g) =>
      hasValue(g?.criticalityLevelDocumentation),
    ),
    generalField(selectITSystemUsageEnableAndRecommendedLifeCycleStatus, (g) => hasValue(g?.validity.lifeCycleStatus)),
    generalField(selectITSystemUsageEnableAndRecommendedFrontPageUsagePeriod, (g) => hasValue(g?.validity.validFrom)),
    generalField(selectITSystemUsageEnableAndRecommendedFrontPageUsagePeriod, (g) => hasValue(g?.validity.validTo)),
    generalField(selectITSystemUsageEnableAndRecommendedWebAccessibility, (g) =>
      hasValue(g?.webAccessibilityCompliance),
    ),
    generalField(selectITSystemUsageEnableAndRecommendedWebAccessibility, (g) =>
      hasValue(g?.lastWebAccessibilityCheck),
    ),
    generalField(selectITSystemUsageEnableAndRecommendedWebAccessibility, (g) => hasText(g?.webAccessibilityNotes)),
  ]);

  const gdprTab$ = combineRecommendedBadgeState([
    gdprField(selectITSystemUsageEnableAndRecommendedGdprDataTypes, (g) => hasItems(g?.dataSensitivityLevels)),
    gdprField(selectITSystemUsageEnableAndRecommendedRegisteredCategories, (g) => hasItems(g?.registeredDataCategories)),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprPurpose, (g) => hasText(g?.processingPurpose)),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprDocumentation, (g) =>
      hasText(g?.directoryDocumentation?.url),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprIsDataProcessingAgreementRequired, (g) =>
      hasValue(g?.isDataProcessingAgreementRequired),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprPlannedRiskAssessmentDate, (g) =>
      hasValue(g?.plannedRiskAssessmentDate),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprConductedRiskAssessment, (g) =>
      hasValue(g?.riskAssessmentConducted),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprConductedRiskAssessment, (g) =>
      hasDependentGdprValue(g?.riskAssessmentConducted, hasValue(g?.riskAssessmentConductedDate)),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprConductedRiskAssessment, (g) =>
      hasDependentGdprValue(g?.riskAssessmentConducted, hasValue(g?.riskAssessmentResult)),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprConductedRiskAssessment, (g) =>
      hasDependentGdprValue(g?.riskAssessmentConducted, hasValue(g?.riskAssessmentDocumentation)),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprConductedRiskAssessment, (g) =>
      hasDependentGdprValue(g?.riskAssessmentConducted, hasText(g?.riskAssessmentNotes)),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprTechnicalPrecautions, (g) =>
      hasValue(g?.technicalPrecautionsInPlace),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprTechnicalPrecautions, (g) =>
      hasDependentGdprValue(g?.technicalPrecautionsInPlace, hasValue(g?.technicalPrecautionsDocumentation)),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprUserSupervision, (g) => hasValue(g?.userSupervision)),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprUserSupervision, (g) => hasDependentGdprValue(g?.userSupervision, hasValue(g?.userSupervisionDate))),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprUserSupervision, (g) =>
      hasDependentGdprValue(g?.userSupervision, hasValue(g?.userSupervisionDocumentation)),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprRetentionPeriod, (g) => hasValue(g?.retentionPeriodDefined)),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprRetentionPeriod, (g) =>
      hasDependentGdprValue(g?.retentionPeriodDefined, hasValue(g?.nextDataRetentionEvaluationDate)),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprRetentionPeriod, (g) =>
      hasDependentGdprValue(g?.retentionPeriodDefined, hasValue(g?.dataRetentionEvaluationFrequencyInMonths)),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprDpiaConducted, (g) => hasValue(g?.dpiaConducted)),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprDpiaConducted, (g) => hasDependentGdprValue(g?.dpiaConducted, hasValue(g?.dpiaDate))),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprDpiaConducted, (g) => hasDependentGdprValue(g?.dpiaConducted, hasValue(g?.dpiaDocumentation))),
  ]);

  const archivingTab$ = combineRecommendedBadgeState([
    archivingField(selectITSystemUsageEnableAndRecommendedJournalPeriods, (a) => hasItems(a?.journalPeriods)),
    archivingField(selectITSystemUsageEnableAndRecommendedArchiveDuty, (a) => hasValue(a?.archiveDuty)),
    archivingField(selectITSystemUsageEnableAndRecommendedArchiveType, (a) => hasValue(a?.type)),
    archivingField(selectITSystemUsageEnableAndRecommendedArchiveLocation, (a) => hasValue(a?.location)),
    archivingField(selectITSystemUsageEnableAndRecommendedArchiveSupplier, (a) => hasValue(a?.supplier)),
    archivingField(selectITSystemUsageEnableAndRecommendedArchiveTestLocation, (a) => hasValue(a?.testLocation)),
    archivingField(selectITSystemUsageEnableAndRecommendedArchiveFrequency, (a) => hasValue(a?.frequencyInMonths)),
    archivingField(selectITSystemUsageEnableAndRecommendedDocumentBearing, (a) => hasValue(a?.documentBearing)),
    archivingField(selectITSystemUsageEnableAndRecommendedActive, (a) => hasValue(a?.active)),
    archivingField(selectITSystemUsageEnableAndRecommendedNotes, (a) => hasText(a?.notes)),
  ]);

  const recommended = (selector: Selector<object, { enabled: boolean; recommended: boolean }>) =>
    store.select(selector).pipe(mapUIConfigStatusToRecommended());
  const contractsRecommended$ = recommended(selectITSystemUsageEnableAndRecommendedAssociatedContracts);
  const contracts$ = combineRecommendedBadgeState([
    {
      recommended$: contractsRecommended$,
      filled$: recommendedCollectionFilled(usage$, contractsRecommended$, (usage) =>
        contractsApi.getManyItContractV2GetItContracts({ systemUsageUuid: usage.uuid, pageSize: 1 })),
    },
    generalField(selectITSystemUsageEnableAndRecommendedSelectContractToDetermineIfItSystemIsActive, (g) =>
      hasValue(g?.mainContract),
    ),
  ]);
  const relations$ = combineRecommendedBadgeState([
    {
      recommended$: recommended(selectITSystemUsageEnableAndRecommendedOutgoingRelations),
      filled$: usage$.pipe(map((usage) => hasItems(usage?.outgoingSystemRelations))),
    },
  ]);
  const localKle$ = combineRecommendedBadgeState([
    {
      recommended$: recommended(selectITSystemUsageEnableAndRecommendedLocalKle),
      filled$: usage$.pipe(map((usage) => hasItems(usage?.localKLEDeviations.addedKLE))),
    },
    {
      recommended$: recommended(selectITSystemUsageEnableAndRecommendedInheritedKle),
      filled$: combineLatest([usage$, store.select(selectItSystem)]).pipe(
        map(([usage, system]) => system?.uuid === usage?.systemContext.uuid &&
          (system?.kle.some((kle) => !usage?.localKLEDeviations.removedKLE.some((removed) => removed.uuid === kle.uuid)) ?? false)),
      ),
    },
  ]);

  return { ...registrationBadges, frontpage$, gdpr$: gdprTab$, archiving$: archivingTab$, contracts$, relations$, localKle$ };
}
