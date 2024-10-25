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
const createTabEnabledSelector = (tabFullKey: string) =>
  createSelector(selectITSystemUsageUIModuleConfig, (itSystemUsageModuleConfig) => {
    const moduleConfigViewModels = itSystemUsageModuleConfig?.moduleConfigViewModel;
    if (!moduleConfigViewModels) return true;

    return tabIsEnabled(moduleConfigViewModels, tabFullKey);
  });

// eslint-disable-next-line @ngrx/prefix-selectors-with-select
const createFieldOrGroupEnabledSelector = (tabFullKey: string, fieldKey: string) =>
  createSelector(selectITSystemUsageUIModuleConfig, (itSystemUsageModuleConfig) => {
    const moduleConfigViewModels = itSystemUsageModuleConfig?.moduleConfigViewModel;
    if (!moduleConfigViewModels) return true;

    return fieldOrGroupIsEnabled(moduleConfigViewModels, tabFullKey, fieldKey);
  });

export const selectITSystemUsageUIModuleConfig = createSelector(
  selectUIModuleCustomizationState,
  (state: UIModuleConfigState) => {
    return state.uiModuleConfigs.find((c) => c.module == UIModuleConfigKey.ItSystemUsage);
  }
);

//IT system usage
//Tab selectors
export const selectITSystemUsageEnableGdpr = createTabEnabledSelector('ItSystemUsages.gdpr');
export const selectITSystemUsageEnableTabSystemRoles = createTabEnabledSelector('ItSystemUsages.systemRoles');
export const selectITSystemUsageEnableTabOrganization = createTabEnabledSelector('ItSystemUsages.organization');
export const selectITSystemUsageEnableSystemRelations = createTabEnabledSelector('ItSystemUsages.systemRelations');
export const selectITSystemUsageEnableTabInterfaces = createTabEnabledSelector('ItSystemUsages.interfaces');
export const selectITSystemUsageEnableTabArchiving = createTabEnabledSelector('ItSystemUsages.archiving');
export const selectITSystemUsageEnableTabHierarchy = createTabEnabledSelector('ItSystemUsages.hierarchy');
export const selectITSystemUsageEnableTabLocalKle = createTabEnabledSelector('ItSystemUsages.localKle');
export const selectITSystemUsageEnableTabNotifications = createTabEnabledSelector('ItSystemUsages.advice');
export const selectITSystemUsageEnableLocalReferences = createTabEnabledSelector('ItSystemUsages.localReferences');

//Field selectors
export const selectITSystemUsageEnableFrontPageUsagePeriod = createFieldOrGroupEnabledSelector(
  'ItSystemUsages.frontPage',
  'usagePeriod'
);
export const selectITSystemUsageEnableLifeCycleStatus = createFieldOrGroupEnabledSelector(
  'ItSystemUsages.frontPage',
  'lifeCycleStatus'
);
export const selectITSystemUsageEnableSelectContractToDetermineIfItSystemIsActive = createFieldOrGroupEnabledSelector(
  'ItSystemUsages.contracts',
  'selectContractToDetermineIfItSystemIsActive'
);
export const selectITSystemUsageEnableGdprPlannedRiskAssessmentDate = createFieldOrGroupEnabledSelector(
  'ItSystemUsages.gdpr',
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
