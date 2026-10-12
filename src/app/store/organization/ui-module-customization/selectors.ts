/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { memoize } from 'lodash';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { UIConfigNodeViewModel } from 'src/app/shared/models/ui-config/ui-config-node-view-model.model';
import { uiModuleConfigFeature } from './reducer';
import { UIModuleConfigState } from './state';

export const { selectUIModuleCustomizationState } = uiModuleConfigFeature;

export const selectHasValidUIModuleConfigCache: (module: UIModuleConfigKey) => MemoizedSelector<any, boolean> = memoize(
  (module: UIModuleConfigKey) =>
    createSelector(
      selectUIModuleCustomizationState,
      () => new Date(),
      (state, now) => hasValidCache(state.uiModuleConfigs.find((config) => config.module === module)?.cacheTime, now),
    ),
);

export const selectModuleConfig = (module: UIModuleConfigKey) =>
  createSelector(selectUIModuleCustomizationState, (state: UIModuleConfigState) => {
    return state.uiModuleConfigs.find((c) => c.module == module);
  });

export const selectUIConfigLoading = createSelector(
  selectUIModuleCustomizationState,
  (state: UIModuleConfigState) => state.loading,
);

// eslint-disable-next-line @ngrx/prefix-selectors-with-select
const createTabEnabledSelector = (module: UIModuleConfigKey, tabKey: string) =>
  createSelector(selectModuleConfig(module), (moduleConfig) => {
    const moduleConfigViewModels = moduleConfig?.moduleConfigViewModel;
    if (!moduleConfigViewModels) return true;
    const fullKey = [module, tabKey].join('.');
    return tabIsEnabled(moduleConfigViewModels, fullKey);
  });

// eslint-disable-next-line @ngrx/prefix-selectors-with-select
const createTabEnableAndRecommendedSelector = (module: UIModuleConfigKey, tabKey: string) =>
  createSelector(selectModuleConfig(module), (moduleConfig) => {
    const moduleConfigViewModels = moduleConfig?.moduleConfigViewModel;
    if (!moduleConfigViewModels) return { enabled: true, recommended: false };
    const fullKey = [module, tabKey].join('.');
    return tabIsEnabledAndRecommended(moduleConfigViewModels, fullKey);
  });

// eslint-disable-next-line @ngrx/prefix-selectors-with-select
const createFieldOrGroupEnabledSelector = (module: UIModuleConfigKey, tabKey: string, fieldKey: string) =>
  createSelector(selectModuleConfig(module), (moduleConfig) => {
    const moduleConfigViewModels = moduleConfig?.moduleConfigViewModel;
    if (!moduleConfigViewModels) return true;

    const fullKey = [module, tabKey].join('.');
    return fieldOrGroupIsEnabled(moduleConfigViewModels, fullKey, fieldKey);
  });

// eslint-disable-next-line @ngrx/prefix-selectors-with-select
const createFieldOrGroupEnabledAndRecommendedSelector = (module: UIModuleConfigKey, tabKey: string, fieldKey: string) =>
  createSelector(selectModuleConfig(module), (moduleConfig) => {
    const moduleConfigViewModels = moduleConfig?.moduleConfigViewModel;
    if (!moduleConfigViewModels) return { enabled: true, recommended: false };

    const fullKey = [module, tabKey].join('.');
    return fieldOrGroupIsEnabledAndRecommended(moduleConfigViewModels, fullKey, fieldKey);
  });

//Data processing
const createDprTabEnabledSelector = (tabKey: string) =>
  createTabEnabledSelector(UIModuleConfigKey.DataProcessingRegistrations, tabKey);
const createDprTabEnableAndRecommendedSelector = (tabKey: string) =>
  createTabEnableAndRecommendedSelector(UIModuleConfigKey.DataProcessingRegistrations, tabKey);
//DPR tabs
export const selectDprEnableFrontPage = createDprTabEnabledSelector('frontPage');
export const selectDprEnableAndRecommendedFrontPage = createDprTabEnableAndRecommendedSelector('frontPage');
export const selectDprEnableItSystems = createDprTabEnabledSelector('itSystems');
export const selectDprEnableAndRecommendedItSystems = createDprTabEnableAndRecommendedSelector('itSystems');
export const selectDprEnableItContracts = createDprTabEnabledSelector('itContracts');
export const selectDprEnableAndRecommendedItContracts = createDprTabEnableAndRecommendedSelector('itContracts');
export const selectDprEnableOversight = createDprTabEnabledSelector('oversight');
export const selectDprEnableAndRecommendedOversight = createDprTabEnableAndRecommendedSelector('oversight');
export const selectDprEnableRoles = createDprTabEnabledSelector('roles');
export const selectDprEnableAndRecommendedRoles = createDprTabEnableAndRecommendedSelector('roles');
export const selectDprEnableNotifications = createDprTabEnabledSelector('notifications');
export const selectDprEnableAndRecommendedNotifications = createDprTabEnableAndRecommendedSelector('notifications');
export const selectDprEnableReferences = createDprTabEnabledSelector('references');
export const selectDprEnableAndRecommendedReferences = createDprTabEnableAndRecommendedSelector('references');

//DPR > frontpage
const createDprFrontPageFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.DataProcessingRegistrations, 'frontPage', fieldKey);
const createDprFrontPageFieldEnableAndRecommendedSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.DataProcessingRegistrations, 'frontPage', fieldKey);
export const selectDprEnableName = createDprFrontPageFieldSelector('name');
export const selectDprEnableAndRecommendedName = createDprFrontPageFieldEnableAndRecommendedSelector('name');
export const selectDprEnableDataResponsible = createDprFrontPageFieldSelector('dataResponsible');
export const selectDprEnableAndRecommendedDataResponsible =
  createDprFrontPageFieldEnableAndRecommendedSelector('dataResponsible');
export const selectDprEnableStatus = createDprFrontPageFieldSelector('status');
export const selectDprEnableAndRecommendedStatus = createDprFrontPageFieldEnableAndRecommendedSelector('status');
export const selectDprEnableLastChangedBy = createDprFrontPageFieldSelector('lastChangedBy');
export const selectDprEnableAndRecommendedLastChangedBy =
  createDprFrontPageFieldEnableAndRecommendedSelector('lastChangedBy');
export const selectDprEnableLastChangedAt = createDprFrontPageFieldSelector('lastChangedAt');
export const selectDprEnableAndRecommendedLastChangedAt =
  createDprFrontPageFieldEnableAndRecommendedSelector('lastChangedAt');
export const selectDprEnableAgreementConcluded = createDprFrontPageFieldSelector('agreementConcluded');
export const selectDprEnableAndRecommendedAgreementConcluded =
  createDprFrontPageFieldEnableAndRecommendedSelector('agreementConcluded');
export const selectDprEnableTransferBasis = createDprFrontPageFieldSelector('transferBasis');
export const selectDprEnableAndRecommendedTransferBasis =
  createDprFrontPageFieldEnableAndRecommendedSelector('transferBasis');
export const selectDprEnableProcessors = createDprFrontPageFieldSelector('processors');
export const selectDprEnableAndRecommendedProcessors =
  createDprFrontPageFieldEnableAndRecommendedSelector('processors');
export const selectDprEnableSubProcessors = createDprFrontPageFieldSelector('subProcessors');
export const selectDprEnableAndRecommendedSubProcessors =
  createDprFrontPageFieldEnableAndRecommendedSelector('subProcessors');
export const selectDprEnableResponsibleOrgUnit = createDprFrontPageFieldSelector('responsibleOrgUnit');
export const selectDprEnableAndRecommendedResponsibleOrgUnit =
  createDprFrontPageFieldEnableAndRecommendedSelector('responsibleOrgUnit');
export const selectDprEnableEnforceInvalidity = createDprFrontPageFieldSelector('enforceInvalidity');
export const selectDprEnableAndRecommendedEnforceInvalidity =
  createDprFrontPageFieldEnableAndRecommendedSelector('enforceInvalidity');

//DPR -> IT Systems
const createDprItSystemsFieldEnableAndRecommendedSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.DataProcessingRegistrations, 'itSystems', fieldKey);
export const selectDprEnableAndRecommendedSystemUsages =
  createDprItSystemsFieldEnableAndRecommendedSelector('systemUsages');

//DPR -> IT Contract
const createDprItContractsFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.DataProcessingRegistrations, 'itContracts', fieldKey);
const createDprItContractsFieldEnableAndRecommendedSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledAndRecommendedSelector(
    UIModuleConfigKey.DataProcessingRegistrations,
    'itContracts',
    fieldKey,
  );
export const selectDprEnableMainContract = createDprItContractsFieldSelector('mainContract');
export const selectDprEnableAndRecommendedMainContract =
  createDprItContractsFieldEnableAndRecommendedSelector('mainContract');
export const selectDprEnableAssociatedContracts = createDprItContractsFieldSelector('associatedContracts');
export const selectDprEnableAndRecommendedAssociatedContracts =
  createDprItContractsFieldEnableAndRecommendedSelector('associatedContracts');

//DPR -> Oversight
const createDprOversightFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.DataProcessingRegistrations, 'oversight', fieldKey);
const createDprOversightFieldEnableAndRecommendedSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.DataProcessingRegistrations, 'oversight', fieldKey);
export const selectDprEnabledOversightInterval = createDprOversightFieldSelector('oversightInterval');
export const selectDprEnableAndRecommendedOversightInterval =
  createDprOversightFieldEnableAndRecommendedSelector('oversightInterval');
export const selectDprEnableScheduledInspectionDate = createDprOversightFieldSelector('scheduledInspectionDate');
export const selectDprEnableAndRecommendedScheduledInspectionDate =
  createDprOversightFieldEnableAndRecommendedSelector('scheduledInspectionDate');
export const selectDprEnableOversightOptions = createDprOversightFieldSelector('oversightOptions');
export const selectDprEnableAndRecommendedOversightOptions =
  createDprOversightFieldEnableAndRecommendedSelector('oversightOptions');
export const selectDprEnableOversights = createDprOversightFieldSelector('oversights');
export const selectDprEnableAndRecommendedOversights =
  createDprOversightFieldEnableAndRecommendedSelector('oversights');

//IT system usage
const createItSystemUsageTabEnabledSelector = (tabKey: string) =>
  createTabEnabledSelector(UIModuleConfigKey.ItSystemUsage, tabKey);
const createItSystemUsageTabEnableAndRecommendedSelector = (tabKey: string) =>
  createTabEnableAndRecommendedSelector(UIModuleConfigKey.ItSystemUsage, tabKey);
//IT system tabs
export const selectITSystemUsageEnableFrontpage = createItSystemUsageTabEnabledSelector('frontPage');
export const selectITSystemUsageEnableAndRecommendedFrontpage =
  createItSystemUsageTabEnableAndRecommendedSelector('frontPage');
export const selectITSystemUsageEnableContracts = createItSystemUsageTabEnabledSelector('contracts');
export const selectITSystemUsageEnableAndRecommendedContracts =
  createItSystemUsageTabEnableAndRecommendedSelector('contracts');
export const selectITSystemUsageEnableDataProcessing = createItSystemUsageTabEnabledSelector('dataProcessing');
export const selectITSystemUsageEnableAndRecommendedDataProcessing =
  createItSystemUsageTabEnableAndRecommendedSelector('dataProcessing');
export const selectITSystemUsageEnableGdpr = createItSystemUsageTabEnabledSelector('gdpr');
export const selectITSystemUsageEnableAndRecommendedGdpr = createItSystemUsageTabEnableAndRecommendedSelector('gdpr');
export const selectITSystemUsageEnableTabSystemRoles = createItSystemUsageTabEnabledSelector('systemRoles');
export const selectITSystemUsageEnableAndRecommendedTabSystemRoles =
  createItSystemUsageTabEnableAndRecommendedSelector('systemRoles');
export const selectITSystemUsageEnableTabOrganization = createItSystemUsageTabEnabledSelector('organization');
export const selectITSystemUsageEnableAndRecommendedTabOrganization =
  createItSystemUsageTabEnableAndRecommendedSelector('organization');
export const selectITSystemUsageEnableSystemRelations = createItSystemUsageTabEnabledSelector('systemRelations');
export const selectITSystemUsageEnableAndRecommendedSystemRelations =
  createItSystemUsageTabEnableAndRecommendedSelector('systemRelations');
export const selectITSystemUsageEnableTabInterfaces = createItSystemUsageTabEnabledSelector('interfaces');
export const selectITSystemUsageEnableAndRecommendedTabInterfaces =
  createItSystemUsageTabEnableAndRecommendedSelector('interfaces');
export const selectITSystemUsageEnableTabArchiving = createItSystemUsageTabEnabledSelector('archiving');
export const selectITSystemUsageEnableAndRecommendedTabArchiving =
  createItSystemUsageTabEnableAndRecommendedSelector('archiving');
export const selectITSystemUsageEnableTabHierarchy = createItSystemUsageTabEnabledSelector('hierarchy');
export const selectITSystemUsageEnableAndRecommendedTabHierarchy =
  createItSystemUsageTabEnableAndRecommendedSelector('hierarchy');
export const selectITSystemUsageEnableTabLocalKle = createItSystemUsageTabEnabledSelector('localKle');
export const selectITSystemUsageEnableAndRecommendedTabLocalKle =
  createItSystemUsageTabEnableAndRecommendedSelector('localKle');
export const selectITSystemUsageEnableTabNotifications = createItSystemUsageTabEnabledSelector('advice');
export const selectITSystemUsageEnableAndRecommendedTabNotifications =
  createItSystemUsageTabEnableAndRecommendedSelector('advice');
export const selectITSystemUsageEnableLocalReferences = createItSystemUsageTabEnabledSelector('localReferences');
export const selectITSystemUsageEnableAndRecommendedLocalReferences =
  createItSystemUsageTabEnableAndRecommendedSelector('localReferences');
export const selectITSystemUsageEnableUsageArchive = createItSystemUsageTabEnabledSelector('usageArchive');
export const selectITSystemUsageEnableAndRecommendedUsageArchive =
  createItSystemUsageTabEnableAndRecommendedSelector('usageArchive');

//IT System Usage > frontpage
const createItSystemUsageFrontPageFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.ItSystemUsage, 'frontPage', fieldKey);
const createItSystemUsageFrontPageFieldEnableAndRecommendedSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItSystemUsage, 'frontPage', fieldKey);

export const selectITSystemUsageEnableName = createItSystemUsageFrontPageFieldSelector('name');
export const selectITSystemUsageEnableAndRecommendedName =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('name');
export const selectITSystemUsageEnabledSystemId = createItSystemUsageFrontPageFieldSelector('systemId');
export const selectITSystemUsageEnableAndRecommendedSystemId =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('systemId');
export const selectITSystemUsageEnableVersion = createItSystemUsageFrontPageFieldSelector('version');
export const selectITSystemUsageEnableAndRecommendedVersion =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('version');
export const selectITSystemUsageEnableGeneralPurpose = createItSystemUsageFrontPageFieldSelector('purpose');
export const selectITSystemUsageEnableAndRecommendedGeneralPurpose =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('purpose');
export const selectITSystemUsageEnableAmountOfUsers = createItSystemUsageFrontPageFieldSelector('amountOfUsers');
export const selectITSystemUsageEnableAndRecommendedAmountOfUsers =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('amountOfUsers');
export const selectITSystemUsageEnableDataClassification =
  createItSystemUsageFrontPageFieldSelector('dataClassification');
export const selectITSystemUsageEnableAndRecommendedDataClassification =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('dataClassification');
export const selectITSystemUsageEnableGeneralHostedAt = createItSystemUsageFrontPageFieldSelector('hostedAt');
export const selectITSystemUsageEnableAndRecommendedGeneralHostedAt =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('hostedAt');
export const selectITSystemUsageEnableDescription = createItSystemUsageFrontPageFieldSelector('description');
export const selectITSystemUsageEnableAndRecommendedDescription =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('description');
export const selectITSystemUsageEnableTakenIntoUsageBy = createItSystemUsageFrontPageFieldSelector('takenIntoUsageBy');
export const selectITSystemUsageEnableAndRecommendedTakenIntoUsageBy =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('takenIntoUsageBy');
export const selectITSystemUsageEnableLastEditedBy = createItSystemUsageFrontPageFieldSelector('lastEditedBy');
export const selectITSystemUsageEnableAndRecommendedLastEditedBy =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('lastEditedBy');
export const selectITSystemUsageEnableLastEditedAt = createItSystemUsageFrontPageFieldSelector('lastEditedAt');
export const selectITSystemUsageEnableAndRecommendedLastEditedAt =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('lastEditedAt');
export const selectITSystemUsageEnableLifeCycleStatus = createItSystemUsageFrontPageFieldSelector('lifeCycleStatus');
export const selectITSystemUsageEnableAndRecommendedLifeCycleStatus =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('lifeCycleStatus');
export const selectITSystemUsageEnableFrontPageUsagePeriod = createItSystemUsageFrontPageFieldSelector('usagePeriod');
export const selectITSystemUsageEnableAndRecommendedFrontPageUsagePeriod =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('usagePeriod');
export const selectITSystemUsageEnableStatus = createItSystemUsageFrontPageFieldSelector('status');
export const selectITSystemUsageEnableAndRecommendedStatus =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('status');
export const selectITSystemUsageEnableContainsAITechnology =
  createItSystemUsageFrontPageFieldSelector('containsAITechnology');
export const selectITSystemUsageEnableAndRecommendedContainsAITechnology =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('containsAITechnology');
export const selectITSystemUsageEnableWebAccessibility = createItSystemUsageFrontPageFieldSelector('webAccessibility');
export const selectITSystemUsageEnableAndRecommendedWebAccessibility =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('webAccessibility');
export const selectITSystemUsageEnableIsSociallyCritical =
  createItSystemUsageFrontPageFieldSelector('isSociallyCritical');
export const selectITSystemUsageEnableAndRecommendedIsSociallyCritical =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('isSociallyCritical');
export const selectITSystemUsageEnableIsBusinessCritical =
  createItSystemUsageFrontPageFieldSelector('isBusinessCritical');
export const selectITSystemUsageEnableAndRecommendedIsBusinessCritical =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('isBusinessCritical');
export const selectITSystemUsageEnableCriticalityFieldsLastChanged =
  createItSystemUsageFrontPageFieldSelector('criticalityFieldsLastChanged');
export const selectITSystemUsageEnableAndRecommendedCriticalityFieldsLastChanged =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('criticalityFieldsLastChanged');
export const selectITSystemUsageEnableCriticalityLevelDocumentation = createItSystemUsageFrontPageFieldSelector(
  'criticalityLevelDocumentation',
);
export const selectITSystemUsageEnableAndRecommendedCriticalityLevelDocumentation =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('criticalityLevelDocumentation');
export const selectITSystemUsageEnableSystemUsageCriticalityLevel =
  createItSystemUsageFrontPageFieldSelector('systemUsageCriticalityLevel');
export const selectITSystemUsageEnableAndRecommendedSystemUsageCriticalityLevel =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('systemUsageCriticalityLevel');
export const selectITSystemUsageEnableTechnicalSystemType =
  createItSystemUsageFrontPageFieldSelector('technicalSystemType');
export const selectITSystemUsageEnableAndRecommendedTechnicalSystemType =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('technicalSystemType');
export const selectITSystemUsageEnableLicensingAndCodeModels =
  createItSystemUsageFrontPageFieldSelector('licensingAndCodeModels');
export const selectITSystemUsageEnableAndRecommendedLicensingAndCodeModels =
  createItSystemUsageFrontPageFieldEnableAndRecommendedSelector('licensingAndCodeModels');

//IT System Usage > Contracts
const createItSystemUsageContractsFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.ItSystemUsage, 'contracts', fieldKey);
const createItSystemUsageContractsFieldEnableAndRecommendedSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItSystemUsage, 'contracts', fieldKey);
export const selectITSystemUsageEnableAssociatedContracts =
  createItSystemUsageContractsFieldSelector('associatedContracts');
export const selectITSystemUsageEnableAndRecommendedAssociatedContracts =
  createItSystemUsageContractsFieldEnableAndRecommendedSelector('associatedContracts');
export const selectITSystemUsageEnableSelectContractToDetermineIfItSystemIsActive =
  createItSystemUsageContractsFieldSelector('selectContractToDetermineIfItSystemIsActive');
export const selectITSystemUsageEnableAndRecommendedSelectContractToDetermineIfItSystemIsActive =
  createItSystemUsageContractsFieldEnableAndRecommendedSelector('selectContractToDetermineIfItSystemIsActive');

//IT System Usage > GDPR
const createItSystemUsageGdprFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.ItSystemUsage, 'gdpr', fieldKey);
const createItSystemUsageGdprFieldEnableAndRecommendedSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItSystemUsage, 'gdpr', fieldKey);

export const selectITSystemUsageEnableGdprPurpose = createItSystemUsageGdprFieldSelector('processingPurpose');
export const selectITSystemUsageEnableAndRecommendedGdprPurpose =
  createItSystemUsageGdprFieldEnableAndRecommendedSelector('processingPurpose');
export const selectITSystemUsageEnableGdprDocumentation = createItSystemUsageGdprFieldSelector('documentation');
export const selectITSystemUsageEnableAndRecommendedGdprDocumentation =
  createItSystemUsageGdprFieldEnableAndRecommendedSelector('documentation');
export const selectITSystemUsageEnableGdprIsDataProcessingAgreementRequired = createItSystemUsageGdprFieldSelector(
  'isDataProcessingAgreementRequired',
);
export const selectITSystemUsageEnableAndRecommendedGdprIsDataProcessingAgreementRequired =
  createItSystemUsageGdprFieldEnableAndRecommendedSelector('isDataProcessingAgreementRequired');
export const selectITSystemUsageEnableGdprDataTypes = createItSystemUsageGdprFieldSelector('dataTypes');
export const selectITSystemUsageEnableAndRecommendedGdprDataTypes =
  createItSystemUsageGdprFieldEnableAndRecommendedSelector('dataTypes');
export const selectITSystemUsageEnabledRegisteredCategories =
  createItSystemUsageGdprFieldSelector('registeredCategories');
export const selectITSystemUsageEnableAndRecommendedRegisteredCategories =
  createItSystemUsageGdprFieldEnableAndRecommendedSelector('registeredCategories');
export const selectITSystemUsageEnableGdprTechnicalPrecautions =
  createItSystemUsageGdprFieldSelector('technicalPrecautions');
export const selectITSystemUsageEnableAndRecommendedGdprTechnicalPrecautions =
  createItSystemUsageGdprFieldEnableAndRecommendedSelector('technicalPrecautions');
export const selectITSystemUsageEnableGdprUserSupervision = createItSystemUsageGdprFieldSelector('userSupervision');
export const selectITSystemUsageEnableAndRecommendedGdprUserSupervision =
  createItSystemUsageGdprFieldEnableAndRecommendedSelector('userSupervision');
export const selectITSystemUsageEnableGdprPlannedRiskAssessmentDate =
  createItSystemUsageGdprFieldSelector('plannedRiskAssessmentDate');
export const selectITSystemUsageEnableAndRecommendedGdprPlannedRiskAssessmentDate =
  createItSystemUsageGdprFieldEnableAndRecommendedSelector('plannedRiskAssessmentDate');
export const selectITSystemUsageEnableGdprConductedRiskAssessment =
  createItSystemUsageGdprFieldSelector('conductedRiskAssessment');
export const selectITSystemUsageEnableAndRecommendedGdprConductedRiskAssessment =
  createItSystemUsageGdprFieldEnableAndRecommendedSelector('conductedRiskAssessment');
export const selectITSystemUsageEnableGdprRiskAssessmentResult =
  createItSystemUsageGdprFieldSelector('riskAssessmentResult');
export const selectITSystemUsageEnableAndRecommendedGdprRiskAssessmentResult =
  createItSystemUsageGdprFieldEnableAndRecommendedSelector('riskAssessmentResult');
export const selectITSystemUsageEnableGdprDpiaConducted = createItSystemUsageGdprFieldSelector('dpiaConducted');
export const selectITSystemUsageEnableAndRecommendedGdprDpiaConducted =
  createItSystemUsageGdprFieldEnableAndRecommendedSelector('dpiaConducted');
export const selectITSystemUsageEnableGdprRetentionPeriod = createItSystemUsageGdprFieldSelector('retentionPeriod');
export const selectITSystemUsageEnableAndRecommendedGdprRetentionPeriod =
  createItSystemUsageGdprFieldEnableAndRecommendedSelector('retentionPeriod');

//IT System Usage > Relations
const createItSystemUsageRelationsFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.ItSystemUsage, 'systemRelations', fieldKey);
const createItSystemUsageRelationsFieldEnableAndRecommendedSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItSystemUsage, 'systemRelations', fieldKey);
export const selectITSystemUsageEnableOutgoingRelations = createItSystemUsageRelationsFieldSelector('outgoing');
export const selectITSystemUsageEnableAndRecommendedOutgoingRelations =
  createItSystemUsageRelationsFieldEnableAndRecommendedSelector('outgoing');
export const selectITSystemUsageEnableIncomingRelations = createItSystemUsageRelationsFieldSelector('incoming');
export const selectITSystemUsageEnableAndRecommendedIncomingRelations =
  createItSystemUsageRelationsFieldEnableAndRecommendedSelector('incoming');

//IT system usage > Archiving
const createItSystemUsageArchivingFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.ItSystemUsage, 'archiving', fieldKey);
const createItSystemUsageArchivingFieldEnableAndRecommendedSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItSystemUsage, 'archiving', fieldKey);

export const selectITSystemUsageEnableArchiveDuty = createItSystemUsageArchivingFieldSelector('archiveDuty');
export const selectITSystemUsageEnableAndRecommendedArchiveDuty =
  createItSystemUsageArchivingFieldEnableAndRecommendedSelector('archiveDuty');
export const selectITSystemUsageEnableArchiveType = createItSystemUsageArchivingFieldSelector('archiveType');
export const selectITSystemUsageEnableAndRecommendedArchiveType =
  createItSystemUsageArchivingFieldEnableAndRecommendedSelector('archiveType');
export const selectITSystemUsageEnableArchiveLocation = createItSystemUsageArchivingFieldSelector('archiveLocation');
export const selectITSystemUsageEnableAndRecommendedArchiveLocation =
  createItSystemUsageArchivingFieldEnableAndRecommendedSelector('archiveLocation');
export const selectITSystemUsageEnableArchiveSupplier = createItSystemUsageArchivingFieldSelector('archiveSupplier');
export const selectITSystemUsageEnableAndRecommendedArchiveSupplier =
  createItSystemUsageArchivingFieldEnableAndRecommendedSelector('archiveSupplier');
export const selectITSystemUsageEnableArchiveTestLocation =
  createItSystemUsageArchivingFieldSelector('archiveTestLocation');
export const selectITSystemUsageEnableAndRecommendedArchiveTestLocation =
  createItSystemUsageArchivingFieldEnableAndRecommendedSelector('archiveTestLocation');
export const selectITSystemUsageEnableArchiveFrequency = createItSystemUsageArchivingFieldSelector('archiveFrequency');
export const selectITSystemUsageEnableAndRecommendedArchiveFrequency =
  createItSystemUsageArchivingFieldEnableAndRecommendedSelector('archiveFrequency');
export const selectITSystemUsageEnableDocumentBearing = createItSystemUsageArchivingFieldSelector('documentBearing');
export const selectITSystemUsageEnableAndRecommendedDocumentBearing =
  createItSystemUsageArchivingFieldEnableAndRecommendedSelector('documentBearing');
export const selectITSystemUsageEnableActive = createItSystemUsageArchivingFieldSelector('active');
export const selectITSystemUsageEnableAndRecommendedActive =
  createItSystemUsageArchivingFieldEnableAndRecommendedSelector('active');
export const selectITSystemUsageEnableNotes = createItSystemUsageArchivingFieldSelector('notes');
export const selectITSystemUsageEnableAndRecommendedNotes =
  createItSystemUsageArchivingFieldEnableAndRecommendedSelector('notes');
export const selectITSystemUsageEnableJournalPeriods = createItSystemUsageArchivingFieldSelector('journalPeriods');
export const selectITSystemUsageEnableAndRecommendedJournalPeriods =
  createItSystemUsageArchivingFieldEnableAndRecommendedSelector('journalPeriods');
export const selectITSystemUsageEnableCatalogArchiveDuty =
  createItSystemUsageArchivingFieldSelector('catalogArchiveDuty');
export const selectITSystemUsageEnableAndRecommendedCatalogArchiveDuty =
  createItSystemUsageArchivingFieldEnableAndRecommendedSelector('catalogArchiveDuty');
export const selectITSystemUsageEnableCatalogArchiveDutyComment =
  createItSystemUsageArchivingFieldSelector('catalogArchiveDutyComment');
export const selectITSystemUsageEnableAndRecommendedCatalogArchiveDutyComment =
  createItSystemUsageArchivingFieldEnableAndRecommendedSelector('catalogArchiveDutyComment');

//IT system usage > KLE
const createItSystemUsageKleFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.ItSystemUsage, 'localKle', fieldKey);
const createItSystemUsageKleFieldEnableAndRecommendedSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItSystemUsage, 'localKle', fieldKey);
export const selectITSystemUsageEnableInheritedKle = createItSystemUsageKleFieldSelector('inheritedKle');
export const selectITSystemUsageEnableAndRecommendedInheritedKle =
  createItSystemUsageKleFieldEnableAndRecommendedSelector('inheritedKle');
export const selectITSystemUsageEnableLocalKle = createItSystemUsageKleFieldSelector('localKle');
export const selectITSystemUsageEnableAndRecommendedLocalKle =
  createItSystemUsageKleFieldEnableAndRecommendedSelector('localKle');

//IT system usage > Interfaces
const createItSystemUsageInterfacesFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.ItSystemUsage, 'interfaces', fieldKey);
const createItSystemUsageInterfacesFieldEnableAndRecommendedSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItSystemUsage, 'interfaces', fieldKey);
export const selectITSystemUsageEnableItInterfaceIds = createItSystemUsageInterfacesFieldSelector('itInterfaceIds');
export const selectITSystemUsageEnableAndRecommendedItInterfaceIds =
  createItSystemUsageInterfacesFieldEnableAndRecommendedSelector('itInterfaceIds');
export const selectITSystemUsageEnableItInterfaceVersions =
  createItSystemUsageInterfacesFieldSelector('itInterfaceVersions');
export const selectITSystemUsageEnableAndRecommendedItInterfaceVersions =
  createItSystemUsageInterfacesFieldEnableAndRecommendedSelector('itInterfaceVersions');

//IT contracts
const createItContractsTabEnabledSelector = (tabKey: string) =>
  createTabEnabledSelector(UIModuleConfigKey.ItContract, tabKey);
const createItContractsTabEnableAndRecommendedSelector = (tabKey: string) =>
  createTabEnableAndRecommendedSelector(UIModuleConfigKey.ItContract, tabKey);
//Tab selectors
export const selectItContractEnableFrontpage = createItContractsTabEnabledSelector('frontPage');
export const selectItContractEnableAndRecommendedFrontpage =
  createItContractsTabEnableAndRecommendedSelector('frontPage');
export const selectItContractEnableItSystems = createItContractsTabEnabledSelector('itSystems');
export const selectItContractEnableAndRecommendedItSystems =
  createItContractsTabEnableAndRecommendedSelector('itSystems');
export const selectItContractEnableDataProcessing = createItContractsTabEnabledSelector('dataProcessing');
export const selectItContractEnableAndRecommendedDataProcessing =
  createItContractsTabEnableAndRecommendedSelector('dataProcessing');
export const selectItContractEnableDeadlines = createItContractsTabEnabledSelector('deadlines');
export const selectItContractEnableAndRecommendedDeadlines =
  createItContractsTabEnableAndRecommendedSelector('deadlines');
export const selectItContractEnableEconomy = createItContractsTabEnabledSelector('economy');
export const selectItContractEnableAndRecommendedEconomy = createItContractsTabEnableAndRecommendedSelector('economy');
export const selectItContractEnableContractRoles = createItContractsTabEnabledSelector('contractRoles');
export const selectItContractEnableAndRecommendedContractRoles =
  createItContractsTabEnableAndRecommendedSelector('contractRoles');
export const selectItContractEnableHierarchy = createItContractsTabEnabledSelector('hierarchy');
export const selectItContractEnableAndRecommendedHierarchy =
  createItContractsTabEnableAndRecommendedSelector('hierarchy');
export const selectItContractEnableAdvis = createItContractsTabEnabledSelector('advice');
export const selectItContractEnableAndRecommendedAdvis = createItContractsTabEnableAndRecommendedSelector('advice');
export const selectItContractEnableReferences = createItContractsTabEnabledSelector('references');
export const selectItContractEnableAndRecommendedReferences =
  createItContractsTabEnableAndRecommendedSelector('references');
//Contracts > Frontpage
const createItContractFrontpageFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.ItContract, 'frontPage', fieldKey);
const createItContractFrontpageFieldEnableAndRecommendedSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItContract, 'frontPage', fieldKey);
export const selectItContractEnableAndRecommendContractName =
  createItContractFrontpageFieldEnableAndRecommendedSelector('contractName');
export const selectItContractEnableAndRecommendExternalContactPerson =
  createItContractFrontpageFieldEnableAndRecommendedSelector('externalContactPerson');
export const selectItContractEnableAndRecommendExternalContactPersonPhone =
  createItContractFrontpageFieldEnableAndRecommendedSelector('externalContactPersonPhone');
export const selectItContractEnableAndRecommendExternalContactPersonEmail =
  createItContractFrontpageFieldEnableAndRecommendedSelector('externalContactPersonEmail');
export const selectItContractEnableContractId = createItContractFrontpageFieldSelector('contractId');
export const selectItContractEnableAndRecommendedContractId =
  createItContractFrontpageFieldEnableAndRecommendedSelector('contractId');
export const selectItContractsEnableContractType = createItContractFrontpageFieldSelector('contractType');
export const selectItContractsEnableAndRecommendedContractType =
  createItContractFrontpageFieldEnableAndRecommendedSelector('contractType');
export const selectItContractsEnableTemplate = createItContractFrontpageFieldSelector('template');
export const selectItContractsEnableAndRecommendedTemplate =
  createItContractFrontpageFieldEnableAndRecommendedSelector('template');
export const selectItContractsEnableCriticality = createItContractFrontpageFieldSelector('criticality');
export const selectItContractsEnableAndRecommendedCriticality =
  createItContractFrontpageFieldEnableAndRecommendedSelector('criticality');
export const selectItContractsEnablePurchaseForm = createItContractFrontpageFieldSelector('purchaseForm');
export const selectItContractsEnableAndRecommendedPurchaseForm =
  createItContractFrontpageFieldEnableAndRecommendedSelector('purchaseForm');
export const selectItContractsEnableIsActive = createItContractFrontpageFieldSelector('isActive');
export const selectItContractsEnableAndRecommendedIsActive =
  createItContractFrontpageFieldEnableAndRecommendedSelector('isActive');
export const selectItContractsEnableAgreementPeriod = createItContractFrontpageFieldSelector('agreementPeriod');
export const selectItContractsEnableAndRecommendedAgreementPeriod =
  createItContractFrontpageFieldEnableAndRecommendedSelector('agreementPeriod');
export const selectItContractsEnableNotes = createItContractFrontpageFieldSelector('notes');
export const selectItContractsEnableAndRecommendedNotes =
  createItContractFrontpageFieldEnableAndRecommendedSelector('notes');
export const selectItContractsEnableParentContract = createItContractFrontpageFieldSelector('parentContract');
export const selectItContractsEnableAndRecommendedParentContract =
  createItContractFrontpageFieldEnableAndRecommendedSelector('parentContract');
export const selectItContractsEnableUseParentValidity = createItContractFrontpageFieldSelector('useParentValidity');
export const selectItContractsEnableAndRecommendedUseParentValidity =
  createItContractFrontpageFieldEnableAndRecommendedSelector('useParentValidity');

export const selectItContractsEnableResponsibleUnit = createItContractFrontpageFieldSelector('responsibleUnit');
export const selectItContractsEnableAndRecommendedResponsibleUnit =
  createItContractFrontpageFieldEnableAndRecommendedSelector('responsibleUnit');
export const selectItContractsEnableInternalSigner = createItContractFrontpageFieldSelector('internalSigner');
export const selectItContractsEnableAndRecommendedInternalSigner =
  createItContractFrontpageFieldEnableAndRecommendedSelector('internalSigner');

export const selectIContractsEnableSupplier = createItContractFrontpageFieldSelector('supplier');
export const selectItContractsEnableAndRecommendedSupplier =
  createItContractFrontpageFieldEnableAndRecommendedSelector('supplier');
export const selectItContractsEnableExternalSigner = createItContractFrontpageFieldSelector('externalSigner');
export const selectItContractsEnableAndRecommendedExternalSigner =
  createItContractFrontpageFieldEnableAndRecommendedSelector('externalSigner');

export const selectItContractsEnableProcurementStrategy = createItContractFrontpageFieldSelector('procurementStrategy');
export const selectItContractsEnableAndRecommendedProcurementStrategy =
  createItContractFrontpageFieldEnableAndRecommendedSelector('procurementStrategy');
export const selectItContractsEnableProcurementPlan = createItContractFrontpageFieldSelector('procurementPlan');
export const selectItContractsEnableAndRecommendedProcurementPlan =
  createItContractFrontpageFieldEnableAndRecommendedSelector('procurementPlan');
export const selectItContractsEnableProcurementInitiated =
  createItContractFrontpageFieldSelector('procurementInitiated');
export const selectItContractsEnableAndRecommendedProcurementInitiated =
  createItContractFrontpageFieldEnableAndRecommendedSelector('procurementInitiated');

export const selectItContractsEnabledCreatedBy = createItContractFrontpageFieldSelector('createdBy');
export const selectItContractsEnableAndRecommendedCreatedBy =
  createItContractFrontpageFieldEnableAndRecommendedSelector('createdBy');
export const selectItContractsEnabledlastModifedBy = createItContractFrontpageFieldSelector('lastModifiedBy');
export const selectItContractsEnableAndRecommendedlastModifedBy =
  createItContractFrontpageFieldEnableAndRecommendedSelector('lastModifiedBy');
export const selectItContractsEnabledlastModifedDate = createItContractFrontpageFieldSelector('lastModifiedDate');
export const selectItContractsEnableAndRecommendedlastModifedDate =
  createItContractFrontpageFieldEnableAndRecommendedSelector('lastModifiedDate');

// Contracts > IT Systems
const createItContractsItSystemsFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.ItContract, 'itSystems', fieldKey);
const createItContractsItSystemsFieldEnableAndRecommendedSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItContract, 'itSystems', fieldKey);
export const selectItContractEnableAgreementElements = createItContractsItSystemsFieldSelector('agreementElements');
export const selectItContractEnableAndRecommendedAgreementElements =
  createItContractsItSystemsFieldEnableAndRecommendedSelector('agreementElements');
export const selectItContractEnableSystemUsages = createItContractsItSystemsFieldSelector('systemUsages');
export const selectItContractEnableAndRecommendedSystemUsages =
  createItContractsItSystemsFieldEnableAndRecommendedSelector('systemUsages');
export const selectItContractEnableRelations = createItContractsItSystemsFieldSelector('relations');
export const selectItContractEnableAndRecommendedRelations =
  createItContractsItSystemsFieldEnableAndRecommendedSelector('relations');

// Contracts > Data processing
const createItContractsDataProcessingFieldEnableAndRecommendedSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItContract, 'dataProcessing', fieldKey);
export const selectItContractEnableAndRecommendedDataProcessingRegistrations =
  createItContractsDataProcessingFieldEnableAndRecommendedSelector('dataProcessingRegistrations');

//Contracts > Deadlines
const createItContractsDeadlinesFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.ItContract, 'deadlines', fieldKey);
const createItContractsDeadlinesFieldEnableAndRecommendedSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItContract, 'deadlines', fieldKey);
export const selectItContractsEnableAgreementDeadlines = createItContractsDeadlinesFieldSelector('agreementDeadlines');
export const selectItContractsEnableAndRecommendedAgreementDeadlines =
  createItContractsDeadlinesFieldEnableAndRecommendedSelector('agreementDeadlines');
export const selectItContractsEnableTermination = createItContractsDeadlinesFieldSelector('termination');
export const selectItContractsEnableAndRecommendedTermination =
  createItContractsDeadlinesFieldEnableAndRecommendedSelector('termination');

//Contracts > Economy
const createItContractsEconomyFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.ItContract, 'economy', fieldKey);
const createItContractsEconomyFieldEnableAndRecommendedSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItContract, 'economy', fieldKey);
export const selectItContractsEnablePaymentModel = createItContractsEconomyFieldSelector('paymentModel');
export const selectItContractsEnableAndRecommendedPaymentModel =
  createItContractsEconomyFieldEnableAndRecommendedSelector('paymentModel');
export const selectItContractsEnableExternalPayment = createItContractsEconomyFieldSelector('extPayment');
export const selectItContractsEnableAndRecommendedExternalPayment =
  createItContractsEconomyFieldEnableAndRecommendedSelector('extPayment');
export const selectItContractsEnableInternalPayment = createItContractsEconomyFieldSelector('intPayment');
export const selectItContractsEnableAndRecommendedInternalPayment =
  createItContractsEconomyFieldEnableAndRecommendedSelector('intPayment');

// Shared registration collections (required fields within their tabs)
export const selectItContractEnableAndRecommendedRoleAssignments =
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItContract, 'contractRoles', 'roles');
export const selectItContractEnableAndRecommendedNotificationCollection =
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItContract, 'advice', 'notifications');
export const selectItContractEnableAndRecommendedReferenceCollection =
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItContract, 'references', 'references');
export const selectDprEnableAndRecommendedRoleAssignments =
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.DataProcessingRegistrations, 'roles', 'roles');
export const selectDprEnableAndRecommendedNotificationCollection =
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.DataProcessingRegistrations, 'notifications', 'notifications');
export const selectDprEnableAndRecommendedReferenceCollection =
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.DataProcessingRegistrations, 'references', 'references');
export const selectITSystemUsageEnableAndRecommendedRoleAssignments =
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItSystemUsage, 'systemRoles', 'roles');
export const selectITSystemUsageEnableAndRecommendedNotificationCollection =
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItSystemUsage, 'advice', 'notifications');
export const selectITSystemUsageEnableAndRecommendedReferenceCollection =
  createFieldOrGroupEnabledAndRecommendedSelector(UIModuleConfigKey.ItSystemUsage, 'localReferences', 'references');

function tabIsEnabled(uiConfigViewModels: UIConfigNodeViewModel, tabFullKey: string): boolean {
  const tabViewModel = getTabViewModelFromModule(uiConfigViewModels, tabFullKey);
  return tabViewModel?.isEnabled ?? true;
}

function tabIsEnabledAndRecommended(
  uiConfigViewModels: UIConfigNodeViewModel,
  tabFullKey: string,
): { enabled: boolean; recommended: boolean } {
  const tabViewModel = getTabViewModelFromModule(uiConfigViewModels, tabFullKey);
  return { enabled: tabViewModel?.isEnabled ?? true, recommended: tabViewModel?.isRecommended ?? false };
}

function fieldOrGroupIsEnabled(
  uiConfigViewModels: UIConfigNodeViewModel,
  tabFullKey: string,
  fieldKey: string,
): boolean {
  const tabViewModel = getTabViewModelFromModule(uiConfigViewModels, tabFullKey);
  const tabViewModelChildren = tabViewModel?.children;
  if (!tabViewModelChildren) return true;

  const fieldFullKey = [tabFullKey, fieldKey].join('.');
  const fieldViewModel = tabViewModelChildren.find((vm) => vm.fullKey === fieldFullKey);
  return fieldViewModel?.isEnabled ?? true;
}

function fieldOrGroupIsEnabledAndRecommended(
  uiConfigViewModels: UIConfigNodeViewModel,
  tabFullKey: string,
  fieldKey: string,
): { enabled: boolean; recommended: boolean } {
  const tabViewModel = getTabViewModelFromModule(uiConfigViewModels, tabFullKey);
  const tabViewModelChildren = tabViewModel?.children;
  if (!tabViewModelChildren) return { enabled: true, recommended: false };

  const fieldFullKey = [tabFullKey, fieldKey].join('.');
  const fieldViewModel = tabViewModelChildren.find((vm) => vm.fullKey === fieldFullKey);
  return {
    enabled: fieldViewModel?.isEnabled ?? true,
    recommended: uiConfigViewModels.isEnabled !== false && tabViewModel?.isEnabled !== false &&
      !fieldViewModel?.cannotBeRecommended && fieldViewModel?.isRecommended === true,
  };
}

function getTabViewModelFromModule(
  uiConfigViewModels: UIConfigNodeViewModel,
  tabFullKey: string,
): UIConfigNodeViewModel | undefined {
  const moduleConfigChildren = uiConfigViewModels.children;
  if (!moduleConfigChildren) return undefined;
  return moduleConfigChildren.find((vm) => vm.fullKey === tabFullKey);
}
