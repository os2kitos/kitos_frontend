import { createSelector } from '@ngrx/store';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { UIConfigNodeViewModel } from 'src/app/shared/models/ui-config/ui-config-node-view-model.model';
import { uiModuleConfigFeature } from './reducer';
import { UIModuleConfigState } from './state';

export const { selectUIModuleCustomizationState } = uiModuleConfigFeature;

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
    console.log('fieldKey', fieldKey);
    return fieldOrGroupIsEnabled(moduleConfigViewModels, fullKey, fieldKey);
  });

const selectModuleConfig = (module: UIModuleConfigKey) =>
  createSelector(selectUIModuleCustomizationState, (state: UIModuleConfigState) => {
    return state.uiModuleConfigs.find((c) => c.module == module);
  });

export const selectITSystemUsageUIModuleConfig = selectModuleConfig(UIModuleConfigKey.ItSystemUsage);

export const selectDataProcessingUIModuleConfig = selectModuleConfig(UIModuleConfigKey.DataProcessingRegistrations);

export const selectItContractsUIModuleConfig = selectModuleConfig(UIModuleConfigKey.ItContract);

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
//Field selectors
export const selectDprEnableMainContract = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'itContracts',
  'mainContract'
);
export const selectDprEnableScheduledInspectionDate = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'oversight',
  'scheduledInspectionDate'
);

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
//Field selectors
const createItContractFrontpageFieldSelector = (fieldKey: string) =>
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.ItContract, 'frontPage', fieldKey);
//Frontpage fields
export const selectItContractEnableContractId = createItContractFrontpageFieldSelector('contractId');
export const selectItContractsEnableContractType = createItContractFrontpageFieldSelector('contractType');
export const selectItContractsEnableTemplate = createItContractFrontpageFieldSelector('template');
export const selectItContractsEnableCriticality = createItContractFrontpageFieldSelector('criticality');
export const selectItContractsEnablePurchaseForm = createItContractFrontpageFieldSelector('purchaseForm');
export const selectItContractsEnableProcurementStrategy = createItContractFrontpageFieldSelector('procurementStrategy');
export const selectItContractsEnableProcurementPlan = createItContractFrontpageFieldSelector('procurementPlan');
export const selectItContractsEnableProcurementInitiated =
  createItContractFrontpageFieldSelector('procurementInitiated');
export const selectItContractsEnableExternalSigner = createItContractFrontpageFieldSelector('externalSigner');
export const selectItContractsEnableInternalSigner = createItContractFrontpageFieldSelector('internalSigner');
export const selectItContractsEnableAgreementPeriod = createItContractFrontpageFieldSelector('agreementPeriod');
export const selectItContractsEnableIsActive = createItContractFrontpageFieldSelector('isActive');
//Other fields
export const selectItContractsEnableAgreementDeadlines = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'deadlines',
  'agreementDeadlines'
);

export const selectItContractsEnableTermination = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'deadlines',
  'termination'
);

export const selectItContractsEnablePaymentModel = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'economy',
  'paymentModel'
);

export const selectItContractsEnableExternalPayment = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'economy',
  'extPayment'
);

export const selectItContractsEnableInternalPayment = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'economy',
  'intPayment'
);

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
