import { createSelector } from '@ngrx/store';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { uiModuleConfigFeature } from './reducer';
import { UIModuleConfigState } from './state';

export const { selectUIModuleCustomizationState } = uiModuleConfigFeature;

export const selectUIModuleConfig = createSelector(selectUIModuleCustomizationState, (state: UIModuleConfigState) => {
  return state.uiModuleConfigs;
});

export const selectITSystemUsageUIModuleConfig = createSelector(
  selectUIModuleCustomizationState,
  (state: UIModuleConfigState) => {
    return state.uiModuleConfigs.find((c) => c.module == UIModuleConfigKey.ItSystemUsage);
  }
);

export const selectUINodeConfig = (module: UIModuleConfigKey, fullKey: string) =>
  createSelector(selectUIModuleCustomizationState, (state: UIModuleConfigState) => {
    const module = state.uiModuleConfigs.find((c) => c.module == UIModuleConfigKey.ItSystemUsage);
    if (module) {
      return module.configViewModels.find((vm) => vm.fullKey === fullKey);
    }
    return undefined;
  });
