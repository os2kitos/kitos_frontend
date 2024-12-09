import { createSelector, MemoizedSelector } from '@ngrx/store';
import { memoize } from 'lodash';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { UIConfigNodeViewModel } from 'src/app/shared/models/ui-config/ui-config-node-view-model.model';
import { uiModuleConfigFeature } from './reducer';
import { UIModuleConfigState } from './state';

export const { selectUIModuleCustomizationState } = uiModuleConfigFeature;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectHasValidUIModuleConfigCache: (module: UIModuleConfigKey) => MemoizedSelector<any, boolean> = memoize(
  (module: UIModuleConfigKey) =>
    createSelector(
      selectUIModuleCustomizationState,
      () => new Date(),
      (state, now) => hasValidCache(state.uiModuleConfigs.find((config) => config.module === module)?.cacheTime, now)
    )
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
const createFieldOrGroupEnabledSelector = (module: UIModuleConfigKey, tabKey: string, fieldKey: string) =>
  createSelector(selectModuleConfig(module), (moduleConfig) => {
    const moduleConfigViewModels = moduleConfig?.moduleConfigViewModel;
    if (!moduleConfigViewModels) return true;

    const fullKey = [module, tabKey].join('.');
    return fieldOrGroupIsEnabled(moduleConfigViewModels, fullKey, fieldKey);
  });

export const selectModuleConfig = (module: UIModuleConfigKey) =>
  createSelector(selectUIModuleCustomizationState, (state: UIModuleConfigState) => {
    return state.uiModuleConfigs.find((c) => c.module == module);
  });

export const selectUIConfigLoading = createSelector(
  selectUIModuleCustomizationState,
  (state: UIModuleConfigState) => state.loading
);

//Data processing
const createDprTabEnabledSelector = (tabKey: string) =>
  createTabEnabledSelector(UIModuleConfigKey.DataProcessingRegistrations, tabKey);
//Tab selectors
export const selectDprEnableFrontPage = createDprTabEnabledSelector('frontPage');
export const selectDprEnableItSystems = createDprTabEnabledSelector('itSystems');
export const selectDprEnableItContracts = createDprTabEnabledSelector('itContracts');
export const selectDprEnableOversight = createDprTabEnabledSelector('oversight');
export const selectDprEnableRoles = createDprTabEnabledSelector('roles');
export const selectDprEnableNotifications = createDprTabEnabledSelector('notifications');
export const selectDprEnableReferences = createDprTabEnabledSelector('references');

//DPR > frontpage field selectors
const createDprFrontPageFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.DataProcessingRegistrations, 'frontPage', fieldKey);
export const selectDprEnableName = createDprFrontPageFieldSelector('name');
export const selectDprEnableDataResponsible = createDprFrontPageFieldSelector('dataResponsible');
export const selectDprEnableStatus = createDprFrontPageFieldSelector('status');
export const selectDprEnableLastChangedBy = createDprFrontPageFieldSelector('lastChangedBy');
export const selectDprEnableLastChangedAt = createDprFrontPageFieldSelector('lastChangedAt');
export const selectDprEnableAgreementConcluded = createDprFrontPageFieldSelector('agreementConcluded');
export const selectDprEnableTransferBasis = createDprFrontPageFieldSelector('transferBasis');
export const selectDprEnableProcessors = createDprFrontPageFieldSelector('processors');
export const selectDprEnableSubProcessors = createDprFrontPageFieldSelector('subProcessors');

//DPR -> IT Contract field selectors
const createDprItContractsFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.DataProcessingRegistrations, 'itContracts', fieldKey);
export const selectDprEnableMainContract = createDprItContractsFieldSelector('mainContract');
export const selectDprEnableAssociatedContracts = createDprItContractsFieldSelector('associatedContracts');

//DPR -> Oversight field selectors
const createDprOversightFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.DataProcessingRegistrations, 'oversight', fieldKey);
export const selectDprEnabledOversightInterval = createDprOversightFieldSelector('oversightInterval');
export const selectDprEnableScheduledInspectionDate = createDprOversightFieldSelector('scheduledInspectionDate');
export const selectDprEnableOversightOptions = createDprOversightFieldSelector('oversightOptions');
export const selectDprEnableOversights = createDprOversightFieldSelector('oversights');

//IT system usage
const createItSystemUsageTabEnabledSelector = (tabKey: string) =>
  createTabEnabledSelector(UIModuleConfigKey.ItSystemUsage, tabKey);
//Tab selectors
export const selectITSystemUsageEnableGdpr = createItSystemUsageTabEnabledSelector('gdpr');
export const selectITSystemUsageEnableTabSystemRoles = createItSystemUsageTabEnabledSelector('systemRoles');
export const selectITSystemUsageEnableTabOrganization = createItSystemUsageTabEnabledSelector('organization');
export const selectITSystemUsageEnableSystemRelations = createItSystemUsageTabEnabledSelector('systemRelations');
export const selectITSystemUsageEnableTabInterfaces = createItSystemUsageTabEnabledSelector('interfaces');
export const selectITSystemUsageEnableTabArchiving = createItSystemUsageTabEnabledSelector('archiving');
export const selectITSystemUsageEnableTabHierarchy = createItSystemUsageTabEnabledSelector('hierarchy');
export const selectITSystemUsageEnableTabLocalKle = createItSystemUsageTabEnabledSelector('localKle');
export const selectITSystemUsageEnableTabNotifications = createItSystemUsageTabEnabledSelector('advice');
export const selectITSystemUsageEnableLocalReferences = createItSystemUsageTabEnabledSelector('localReferences');
//Field selectors
export const selectITSystemUsageEnableFrontPageUsagePeriod = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'frontPage',
  'usagePeriod'
);
export const selectITSystemUsageEnableLifeCycleStatus = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'frontPage',
  'lifeCycleStatus'
);
export const selectITSystemUsageEnableSelectContractToDetermineIfItSystemIsActive = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'contracts',
  'selectContractToDetermineIfItSystemIsActive'
);
export const selectITSystemUsageEnableGdprPlannedRiskAssessmentDate = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'gdpr',
  'plannedRiskAssessmentDate'
);

//IT contracts
const createItContractsTabEnabledSelector = (tabKey: string) =>
  createTabEnabledSelector(UIModuleConfigKey.ItContract, tabKey);
//Tab selectors
export const selectItContractEnableFrontpage = createItContractsTabEnabledSelector('frontPage');
export const selectItContractEnableItSystems = createItContractsTabEnabledSelector('itSystems');
export const selectItContractEnableDataProcessing = createItContractsTabEnabledSelector('dataProcessing');
export const selectItContractEnableDeadlines = createItContractsTabEnabledSelector('deadlines');
export const selectItContractEnableEconomy = createItContractsTabEnabledSelector('economy');
export const selectItContractEnableContractRoles = createItContractsTabEnabledSelector('contractRoles');
export const selectItContractEnableHierarchy = createItContractsTabEnabledSelector('hierarchy');
export const selectItContractEnableAdvis = createItContractsTabEnabledSelector('advice');
export const selectItContractEnableReferences = createItContractsTabEnabledSelector('references');
//Contracts > Frontpage
const createItContractFrontpageFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.ItContract, 'frontPage', fieldKey);
export const selectItContractEnableContractId = createItContractFrontpageFieldSelector('contractId');
export const selectItContractsEnableContractType = createItContractFrontpageFieldSelector('contractType');
export const selectItContractsEnableTemplate = createItContractFrontpageFieldSelector('template');
export const selectItContractsEnableCriticality = createItContractFrontpageFieldSelector('criticality');
export const selectItContractsEnablePurchaseForm = createItContractFrontpageFieldSelector('purchaseForm');
export const selectItContractsEnableIsActive = createItContractFrontpageFieldSelector('isActive');
export const selectItContractsEnableAgreementPeriod = createItContractFrontpageFieldSelector('agreementPeriod');
export const selectItContractsEnableNotes = createItContractFrontpageFieldSelector('notes');
export const selectItContractsEnableParentContract = createItContractFrontpageFieldSelector('parentContract');

export const selectItContractsEnableResponsibleUnit = createItContractFrontpageFieldSelector('responsibleUnit');
export const selectItContractsEnableInternalSigner = createItContractFrontpageFieldSelector('internalSigner');

export const selectIContractsEnableSupplier = createItContractFrontpageFieldSelector('supplier');
export const selectItContractsEnableExternalSigner = createItContractFrontpageFieldSelector('externalSigner');

export const selectItContractsEnableProcurementStrategy = createItContractFrontpageFieldSelector('procurementStrategy');
export const selectItContractsEnableProcurementPlan = createItContractFrontpageFieldSelector('procurementPlan');
export const selectItContractsEnableProcurementInitiated =
  createItContractFrontpageFieldSelector('procurementInitiated');

export const selectItContractsEnabledCreatedBy = createItContractFrontpageFieldSelector('createdBy');
export const selectItContractsEnabledlastModifedBy = createItContractFrontpageFieldSelector('lastModifiedBy');
export const selectItContractsEnabledlastModifedDate = createItContractFrontpageFieldSelector('lastModifiedDate');

// Contracts > IT Systems
const createItContractsItSystemsFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.ItContract, 'itSystems', fieldKey);
export const selectItContractEnableAgreementElements = createItContractsItSystemsFieldSelector('agreementElements');
export const selectItContractEnableSystemUsages = createItContractsItSystemsFieldSelector('systemUsages');
export const selectItContractEnableRelations = createItContractsItSystemsFieldSelector('relations');

//Contracts > Deadlines
const createItContractsDeadlinesFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.ItContract, 'deadlines', fieldKey);
export const selectItContractsEnableAgreementDeadlines = createItContractsDeadlinesFieldSelector('agreementDeadlines');
export const selectItContractsEnableTermination = createItContractsDeadlinesFieldSelector('termination');

//Contracts > Economy
const createItContractsEconomyFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.ItContract, 'economy', fieldKey);
export const selectItContractsEnablePaymentModel = createItContractsEconomyFieldSelector('paymentModel');
export const selectItContractsEnableExternalPayment = createItContractsEconomyFieldSelector('extPayment');
export const selectItContractsEnableInternalPayment = createItContractsEconomyFieldSelector('intPayment');

function tabIsEnabled(uiConfigViewModels: UIConfigNodeViewModel, tabFullKey: string): boolean {
  const tabViewModel = getTabViewModelFromModule(uiConfigViewModels, tabFullKey);
  return tabViewModel?.isEnabled ?? true;
}

function fieldOrGroupIsEnabled(
  uiConfigViewModels: UIConfigNodeViewModel,
  tabFullKey: string,
  fieldKey: string
): boolean {
  const tabViewModel = getTabViewModelFromModule(uiConfigViewModels, tabFullKey);
  const tabViewModelChildren = tabViewModel?.children;
  if (!tabViewModelChildren) return true;

  const fieldFullKey = [tabFullKey, fieldKey].join('.');
  const fieldViewModel = tabViewModelChildren.find((vm) => vm.fullKey === fieldFullKey);
  return fieldViewModel?.isEnabled ?? true;
}

function getTabViewModelFromModule(
  uiConfigViewModels: UIConfigNodeViewModel,
  tabFullKey: string
): UIConfigNodeViewModel | undefined {
  const moduleConfigChildren = uiConfigViewModels.children;
  if (!moduleConfigChildren) return undefined;
  return moduleConfigChildren.find((vm) => vm.fullKey === tabFullKey);
}
