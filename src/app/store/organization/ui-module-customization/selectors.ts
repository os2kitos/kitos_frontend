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

//IT system usage
//Tab selectors

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

export const selectITSystemUsageEnableGdpr = createTabEnabledSelector(UIModuleConfigKey.ItSystemUsage, 'gdpr');
export const selectITSystemUsageEnableTabSystemRoles = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'systemRoles'
);
export const selectITSystemUsageEnableTabOrganization = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'organization'
);
export const selectITSystemUsageEnableSystemRelations = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'systemRelations'
);
export const selectITSystemUsageEnableTabInterfaces = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.interfaces'
);
export const selectITSystemUsageEnableTabArchiving = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.archiving'
);
export const selectITSystemUsageEnableTabHierarchy = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.hierarchy'
);
export const selectITSystemUsageEnableTabLocalKle = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.localKle'
);
export const selectITSystemUsageEnableTabNotifications = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.advice'
);
export const selectITSystemUsageEnableLocalReferences = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.localReferences'
);

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
