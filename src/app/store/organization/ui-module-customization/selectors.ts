import { createSelector } from '@ngrx/store';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { fieldOrGroupIsEnabled, tabIsEnabled } from 'src/app/shared/models/helpers/ui-config-helpers';
import { uiModuleConfigFeature } from './reducer';
import { UIModuleConfigState } from './state';

export const { selectUIModuleCustomizationState } = uiModuleConfigFeature;

export const selectUIModuleConfig = createSelector(selectUIModuleCustomizationState, (state: UIModuleConfigState) => {
  return state.uiModuleConfigs;
});

// eslint-disable-next-line @ngrx/prefix-selectors-with-select
const createTabEnabledSelector = (tabFullKey: string) =>
  createSelector(selectITSystemUsageUIModuleConfig, (itSystemUsageModuleConfig) => {
    const moduleConfigViewModels = itSystemUsageModuleConfig?.configViewModels;
    if (!moduleConfigViewModels) return true;

    return tabIsEnabled(moduleConfigViewModels, tabFullKey);
  });

// eslint-disable-next-line @ngrx/prefix-selectors-with-select
const createFieldOrGroupEnabledSelector = (tabFullKey: string, fieldKey: string) =>
  createSelector(selectITSystemUsageUIModuleConfig, (itSystemUsageModuleConfig) => {
    const moduleConfigViewModels = itSystemUsageModuleConfig?.configViewModels;
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
export const selectITSystemUsageUIModuleConfigEnabledTabGdpr = createTabEnabledSelector('ItSystemUsages.gdpr');
export const selectITSystemUsageUIModuleConfigEnabledTabSystemRoles =
  createTabEnabledSelector('ItSystemUsages.systemRoles');
export const selectITSystemUsageUIModuleConfigEnabledTabOrganization =
  createTabEnabledSelector('ItSystemUsages.organization');
export const selectITSystemUsageUIModuleConfigEnabledTabSystemRelations = createTabEnabledSelector(
  'ItSystemUsages.systemRelations'
);
export const selectITSystemUsageUIModuleConfigEnabledTabInterfaces =
  createTabEnabledSelector('ItSystemUsages.interfaces');
export const selectITSystemUsageUIModuleConfigEnabledTabArchiving =
  createTabEnabledSelector('ItSystemUsages.archiving');
export const selectITSystemUsageUIModuleConfigEnabledTabHierarchy =
  createTabEnabledSelector('ItSystemUsages.hierarchy');
export const selectITSystemUsageUIModuleConfigEnabledTabLocalKle = createTabEnabledSelector('ItSystemUsages.localKle');
export const selectITSystemUsageUIModuleConfigEnabledTabNotifications =
  createTabEnabledSelector('ItSystemUsages.advice');
export const selectITSystemUsageUIModuleConfigEnabledTabLocalReferences = createTabEnabledSelector(
  'ItSystemUsages.localReferences'
);

//Field selectors
export const selectITSystemUsageUIModuleConfigEnabledFieldFrontPageUsagePeriod = createFieldOrGroupEnabledSelector(
  'ItSystemUsages.frontPage',
  'usagePeriod'
);
export const selectITSystemUsageUIModuleConfigEnabledFieldFrontPageLifeCycleStatus = createFieldOrGroupEnabledSelector(
  'ItSystemUsages.frontPage',
  'lifeCycleStatus'
);
export const selectITSystemUsageUIModuleConfigEnabledFieldContractsSelectContractToDetermineIfItSystemIsActive =
  createFieldOrGroupEnabledSelector('ItSystemUsages.contracts', 'selectContractToDetermineIfItSystemIsActive');
export const selectITSystemUsageUIModuleConfigEnabledFieldGdprPlannedRiskAssessmentDate =
  createFieldOrGroupEnabledSelector('ItSystemUsages.gdpr', 'plannedRiskAssessmentDate');
