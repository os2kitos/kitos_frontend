import { createSelector } from '@ngrx/store';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { UIConfigNodeViewModel } from 'src/app/shared/models/ui-config/ui-config-node-view-model.model';
import { uiModuleConfigFeature } from './reducer';
import { UIModuleConfigState } from './state';

export const { selectUIModuleCustomizationState } = uiModuleConfigFeature;

export const selectUIModuleConfig = createSelector(selectUIModuleCustomizationState, (state: UIModuleConfigState) => {
  return state.uiModuleConfigs;
});

// eslint-disable-next-line @ngrx/prefix-selectors-with-select
const createTabEnabledSelector = (module: UIModuleConfigKey, tabKey: string) =>
  createSelector(selectModuleConfig(module), (itSystemUsageModuleConfig) => {
    const moduleConfigViewModels = itSystemUsageModuleConfig?.moduleConfigViewModel;
    if (!moduleConfigViewModels) return true;
    const fullKey = [module, tabKey].join('.');
    return tabIsEnabled(moduleConfigViewModels, fullKey);
  });

// eslint-disable-next-line @ngrx/prefix-selectors-with-select
const createFieldOrGroupEnabledSelector = (module: UIModuleConfigKey, tabKey: string, fieldKey: string) =>
  createSelector(selectModuleConfig(module), (itSystemUsageModuleConfig) => {
    const moduleConfigViewModels = itSystemUsageModuleConfig?.moduleConfigViewModel;
    if (!moduleConfigViewModels) return true;

    const fullKey = [module, tabKey].join('.');
    return fieldOrGroupIsEnabled(moduleConfigViewModels, fullKey, fieldKey);
  });

const selectModuleConfig = (module: UIModuleConfigKey) =>
  createSelector(selectUIModuleCustomizationState, (state: UIModuleConfigState) => {
    return state.uiModuleConfigs.find((c) => c.module == module);
  });

export const selectITSystemUsageUIModuleConfig = selectModuleConfig(UIModuleConfigKey.ItSystemUsage);

export const selectDataProcessingUIModuleConfig = selectModuleConfig(UIModuleConfigKey.DataProcessingRegistrations);

export const selectItContractUIModuleConfig = selectModuleConfig(UIModuleConfigKey.ItContract);

//IT system usage
//Tab selectors
export const selectITSystemUsageUIModuleConfigEnabledTabGdpr = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'gdpr'
);
export const selectITSystemUsageUIModuleConfigEnabledTabSystemRoles = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'systemRoles'
);
export const selectITSystemUsageUIModuleConfigEnabledTabOrganization = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'organization'
);
export const selectITSystemUsageUIModuleConfigEnabledTabSystemRelations = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'systemRelations'
);
export const selectITSystemUsageUIModuleConfigEnabledTabInterfaces = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'interfaces'
);
export const selectITSystemUsageUIModuleConfigEnabledTabArchiving = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'archiving'
);
export const selectITSystemUsageUIModuleConfigEnabledTabHierarchy = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'hierarchy'
);
export const selectITSystemUsageUIModuleConfigEnabledTabLocalKle = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'localKle'
);
export const selectITSystemUsageUIModuleConfigEnabledTabNotifications = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'advice'
);
export const selectITSystemUsageUIModuleConfigEnabledTabLocalReferences = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'localReferences'
);

//Field selectors
export const selectITSystemUsageUIModuleConfigEnabledFieldFrontPageUsagePeriod = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'frontPage',
  'usagePeriod'
);
export const selectITSystemUsageUIModuleConfigEnabledFieldFrontPageLifeCycleStatus = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'frontPage',
  'lifeCycleStatus'
);
export const selectITSystemUsageUIModuleConfigEnabledFieldContractsSelectContractToDetermineIfItSystemIsActive =
  createFieldOrGroupEnabledSelector(
    UIModuleConfigKey.ItSystemUsage,
    'contracts',
    'selectContractToDetermineIfItSystemIsActive'
  );
export const selectITSystemUsageUIModuleConfigEnabledFieldGdprPlannedRiskAssessmentDate =
  createFieldOrGroupEnabledSelector(UIModuleConfigKey.ItSystemUsage, 'gdpr', 'plannedRiskAssessmentDate');

//Data processing
//Tab selectors
export const selectDataProcessingUIModuleConfigEnabledTabFrontpage = createTabEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'frontPage'
);
export const selectDataProcessingUIModuleConfigEnabledTabItSystems = createTabEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'itSystems'
);
export const selectDataProcessingUIModuleConfigEnabledTabItContracts = createTabEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'itContracts'
);
export const selectDataProcessingUIModuleConfigEnabledTabOversight = createTabEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'oversight'
);
export const selectDataProcessingUIModuleConfigEnabledTabRoles = createTabEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'roles'
);
export const selectDataProcessingUIModuleConfigEnabledTabNotifications = createTabEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'notifications'
);
export const selectDataProcessingUIModuleConfigEnabledTabReferences = createTabEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'references'
);

//Field selectors
export const selectDataProcessingUIModuleConfigEnabledFieldMainContract = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'itContracts',
  'mainContract'
);
export const selectDataProcessingUIModuleConfigEnabledFieldScheduledInspectionDate = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'oversight',
  'scheduledInspectionDate'
);

//IT contracts
//Tab selectors
export const selectItContractUIModuleConfigEnabledTabFrontpage = createTabEnabledSelector(
  UIModuleConfigKey.ItContract,
  'frontPage'
);

export const selectItContractUIModuleConfigEnabledTabItSystems = createTabEnabledSelector(
  UIModuleConfigKey.ItContract,
  'itSystems'
);

export const selectItContractUIModuleConfigEnabledTabDataProcessing = createTabEnabledSelector(
  UIModuleConfigKey.ItContract,
  'dataProcessing'
);

export const selectItContractUIModuleConfigEnabledTabDeadlines = createTabEnabledSelector(
  UIModuleConfigKey.ItContract,
  'deadlines'
);

export const selectItContractUIModuleConfigEnabledTabEconomy = createTabEnabledSelector(
  UIModuleConfigKey.ItContract,
  'economy'
);

export const selectItContractUIModuleConfigEnabledTabContractRoles = createTabEnabledSelector(
  UIModuleConfigKey.ItContract,
  'contractRoles'
);

export const selectItContractUIModuleConfigEnabledTabHierarchy = createTabEnabledSelector(
  UIModuleConfigKey.ItContract,
  'hierarchy'
);

export const selectItContractUIModuleConfigEnabledTabAdvis = createTabEnabledSelector(
  UIModuleConfigKey.ItContract,
  'advice'
);

export const selectItContractUIModuleConfigEnabledTabReferences = createTabEnabledSelector(
  UIModuleConfigKey.ItContract,
  'references'
);

//Field selectors
export const selectDataProcessingUIModuleConfigEnabledFieldContractId = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'frontPage',
  'contractId'
);

export const selectDataProcessingUIModuleConfigEnabledFieldContractType = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'frontPage',
  'contractType'
);

export const selectDataProcessingUIModuleConfigEnabledFieldTemplate = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'frontPage',
  'template'
);

export const selectDataProcessingUIModuleConfigEnabledFieldCriticality = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'frontPage',
  'criticality'
);

export const selectDataProcessingUIModuleConfigEnabledFieldPurchaseForm = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'frontPage',
  'purchaseForm'
);

export const selectDataProcessingUIModuleConfigEnabledFieldProcurementStrategy = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'frontPage',
  'procurementStrategy'
);

export const selectDataProcessingUIModuleConfigEnabledFieldProcurementPlan = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'frontPage',
  'procurementPlan'
);

export const selectDataProcessingUIModuleConfigEnabledFieldProcurementInitiated = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'frontPage',
  'procurementInitiated'
);

export const selectDataProcessingUIModuleConfigEnabledFieldExternalSigner = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'frontPage',
  'externalSigner'
);

export const selectDataProcessingUIModuleConfigEnabledFieldInternalSigner = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'frontPage',
  'internalSigner'
);

export const selectDataProcessingUIModuleConfigEnabledFieldAgreementPeriod = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'frontPage',
  'agreementPeriod'
);

export const selectDataProcessingUIModuleConfigEnabledFieldIsActive = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'frontPage',
  'isActive'
);

export const selectDataProcessingUIModuleConfigEnabledFieldAgreementDeadlines = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'deadlines',
  'agreementDeadlines'
);

export const selectDataProcessingUIModuleConfigEnabledFieldTermination = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'deadlines',
  'termination'
);

export const selectDataProcessingUIModuleConfigEnabledFieldPaymentModel = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'economy',
  'paymentModel'
);

export const selectDataProcessingUIModuleConfigEnabledFieldExtPayment = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItContract,
  'economy',
  'extPayment'
);

export const selectDataProcessingUIModuleConfigEnabledFieldIntPayment = createFieldOrGroupEnabledSelector(
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
