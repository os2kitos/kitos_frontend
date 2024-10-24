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
const createTabEnabledSelector = (module: UIModuleConfigKey, tabFullKey: string) =>
  createSelector(createModuleConfigSelector(module), (itSystemUsageModuleConfig) => {
    const moduleConfigViewModels = itSystemUsageModuleConfig?.moduleConfigViewModel;
    if (!moduleConfigViewModels) return true;

    return tabIsEnabled(moduleConfigViewModels, tabFullKey);
  });

// eslint-disable-next-line @ngrx/prefix-selectors-with-select
const createFieldOrGroupEnabledSelector = (module: UIModuleConfigKey, tabFullKey: string, fieldKey: string) =>
  createSelector(createModuleConfigSelector(module), (itSystemUsageModuleConfig) => {
    const moduleConfigViewModels = itSystemUsageModuleConfig?.moduleConfigViewModel;
    if (!moduleConfigViewModels) return true;

    return fieldOrGroupIsEnabled(moduleConfigViewModels, tabFullKey, fieldKey);
  });

// eslint-disable-next-line @ngrx/prefix-selectors-with-select
const createModuleConfigSelector = (module: UIModuleConfigKey) =>
  createSelector(selectUIModuleCustomizationState, (state: UIModuleConfigState) => {
    return state.uiModuleConfigs.find((c) => c.module == module);
  });

export const selectITSystemUsageUIModuleConfig = createModuleConfigSelector(UIModuleConfigKey.ItSystemUsage);

export const selectDataProcessingUIModuleConfig = createModuleConfigSelector(
  UIModuleConfigKey.DataProcessingRegistrations
);

//IT system usage
//Tab selectors
export const selectITSystemUsageUIModuleConfigEnabledTabGdpr = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.gdpr'
);
export const selectITSystemUsageUIModuleConfigEnabledTabSystemRoles = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.systemRoles'
);
export const selectITSystemUsageUIModuleConfigEnabledTabOrganization = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.organization'
);
export const selectITSystemUsageUIModuleConfigEnabledTabSystemRelations = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.systemRelations'
);
export const selectITSystemUsageUIModuleConfigEnabledTabInterfaces = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.interfaces'
);
export const selectITSystemUsageUIModuleConfigEnabledTabArchiving = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.archiving'
);
export const selectITSystemUsageUIModuleConfigEnabledTabHierarchy = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.hierarchy'
);
export const selectITSystemUsageUIModuleConfigEnabledTabLocalKle = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.localKle'
);
export const selectITSystemUsageUIModuleConfigEnabledTabNotifications = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.advice'
);
export const selectITSystemUsageUIModuleConfigEnabledTabLocalReferences = createTabEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.localReferences'
);

//Field selectors
export const selectITSystemUsageUIModuleConfigEnabledFieldFrontPageUsagePeriod = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.frontPage',
  'usagePeriod'
);
export const selectITSystemUsageUIModuleConfigEnabledFieldFrontPageLifeCycleStatus = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.ItSystemUsage,
  'ItSystemUsages.frontPage',
  'lifeCycleStatus'
);
export const selectITSystemUsageUIModuleConfigEnabledFieldContractsSelectContractToDetermineIfItSystemIsActive =
  createFieldOrGroupEnabledSelector(
    UIModuleConfigKey.ItSystemUsage,
    'ItSystemUsages.contracts',
    'selectContractToDetermineIfItSystemIsActive'
  );
export const selectITSystemUsageUIModuleConfigEnabledFieldGdprPlannedRiskAssessmentDate =
  createFieldOrGroupEnabledSelector(
    UIModuleConfigKey.ItSystemUsage,
    'ItSystemUsages.gdpr',
    'plannedRiskAssessmentDate'
  );

//Data processing
//Tab selectors
export const selectDataProcessingUIModuleConfigEnabledTabFrontpage = createTabEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'DataProcessingRegistrations.frontPage'
);
export const selectDataProcessingUIModuleConfigEnabledTabItSystems = createTabEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'DataProcessingRegistrations.itSystems'
);
export const selectDataProcessingUIModuleConfigEnabledTabItContracts = createTabEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'DataProcessingRegistrations.itContracts'
);
export const selectDataProcessingUIModuleConfigEnabledTabOversight = createTabEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'DataProcessingRegistrations.oversight'
);
export const selectDataProcessingUIModuleConfigEnabledTabRoles = createTabEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'DataProcessingRegistrations.roles'
);
export const selectDataProcessingUIModuleConfigEnabledTabNotifications = createTabEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'DataProcessingRegistrations.notifications'
);
export const selectDataProcessingUIModuleConfigEnabledTabReferences = createTabEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'DataProcessingRegistrations.references'
);

//Field selectors
export const selectDataProcessingUIModuleConfigEnabledFieldMainContract = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'DataProcessingRegistrations.itContracts',
  'mainContract'
);
export const selectDataProcessingUIModuleConfigEnabledFieldScheduledInspectionDate = createFieldOrGroupEnabledSelector(
  UIModuleConfigKey.DataProcessingRegistrations,
  'DataProcessingRegistrations.oversight',
  'scheduledInspectionDate'
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
