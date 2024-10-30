import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { UIModuleConfig } from 'src/app/shared/models/ui-config/ui-module-config.model';
import { UIModuleCustomization } from 'src/app/shared/models/ui-config/ui-module-customization.model';
import { UIModuleConfigActions } from './actions';
import { UIModuleConfigState } from './state';

export const uiModuleConfigAdapter = createEntityAdapter<UIModuleCustomization>();

export const UIModuleConfigInitialState: UIModuleConfigState = uiModuleConfigAdapter.getInitialState({
  uiModuleConfigs: [],
});

export const uiModuleConfigFeature = createFeature({
  name: 'UIModuleCustomization',
  reducer: createReducer(
    UIModuleConfigInitialState,
    on(
      UIModuleConfigActions.getUIModuleConfigSuccess,
      (state, { uiModuleConfig }): UIModuleConfigState => ({
        ...state,
        uiModuleConfigs: updateUIModuleConfigs(state, uiModuleConfig),
      })
    ),
    on(
      UIModuleConfigActions.putUIModuleCustomizationSuccess,
      (state, { uiModuleConfig }): UIModuleConfigState => ({
        ...state,
        uiModuleConfigs: updateUIModuleConfigs(state, uiModuleConfig),
      })
    )
  ),
});

function updateUIModuleConfigs(state: UIModuleConfigState, newUIModuleConfig: UIModuleConfig): UIModuleConfig[] {
  const existingUIModuleConfigs = state.uiModuleConfigs;
  const existingConfigIndex = existingUIModuleConfigs.findIndex((c) => c.module === newUIModuleConfig.module);
  const updatedUIModuleConfigs = [...existingUIModuleConfigs];

  if (existingConfigIndex === -1) {
    updatedUIModuleConfigs.push(newUIModuleConfig);
  } else {
    const existingConfig = updatedUIModuleConfigs[existingConfigIndex];
    updatedUIModuleConfigs[existingConfigIndex] = {
      ...existingConfig,
      moduleConfigViewModel: newUIModuleConfig.moduleConfigViewModel,
    };
  }

  return updatedUIModuleConfigs;
}
