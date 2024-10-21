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

export const selectITSystemUsageUIModuleConfig = createSelector(
  selectUIModuleCustomizationState,
  (state: UIModuleConfigState) => {
    return state.uiModuleConfigs.find((c) => c.module == UIModuleConfigKey.ItSystemUsage);
  }
);

export const selectITSystemUsageUIModuleConfigEnabledTabGdpr = createTabEnabledSelector('ItSystemUsages.gdpr');

export const selectITSystemUsageUIModuleConfigEnabledFieldGdprPlannedRiskAssessmentDate = createSelector(
  selectITSystemUsageUIModuleConfig,
  (itSystemUsageModuleConfig) => {
    const moduleConfigViewModels = itSystemUsageModuleConfig?.configViewModels;
    if (!moduleConfigViewModels) return true;

    return fieldOrGroupIsEnabled(moduleConfigViewModels, 'ItSystemUsages.gdpr', 'plannedRiskAssessmentDate');
  }
);
