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
      (state, { uiModuleConfig }): UIModuleConfigState => updateUIModuleConfigState(state, uiModuleConfig)
    ),
    on(
      UIModuleConfigActions.putUIModuleCustomizationSuccess,
      (state, { uiModuleConfig }): UIModuleConfigState => updateUIModuleConfigState(state, uiModuleConfig)
    )
  ),
});

function updateUIModuleConfigState(state: UIModuleConfigState, newUIModuleConfig: UIModuleConfig): UIModuleConfigState {
  const uiModuleConfigs = state.uiModuleConfigs;
  const existingConfigIndex = uiModuleConfigs.findIndex((c) => c.module === newUIModuleConfig.module);
  const updatedUIModuleConfigs = [...uiModuleConfigs];
  if (existingConfigIndex === -1) {
    updatedUIModuleConfigs.push(newUIModuleConfig);
  } else {
    updatedUIModuleConfigs[existingConfigIndex].configViewModels = newUIModuleConfig.configViewModels;
  }
  return { ...state, uiModuleConfigs: updatedUIModuleConfigs };
}
