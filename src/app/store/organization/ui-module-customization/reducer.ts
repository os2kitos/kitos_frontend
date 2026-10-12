import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { UIModuleConfig } from 'src/app/shared/models/ui-config/ui-module-config.model';
import { UIModuleCustomization } from 'src/app/shared/models/ui-config/ui-module-customization.model';
import { UIModuleConfigActions } from './actions';
import { UIModuleConfigState } from './state';

export const uiModuleConfigAdapter = createEntityAdapter<UIModuleCustomization>();

export const UIModuleConfigInitialState: UIModuleConfigState = {
  ...uiModuleConfigAdapter.getInitialState(),
  uiModuleConfigs: [],
  loading: false,
};

export const uiModuleConfigFeature = createFeature({
  name: 'UIModuleCustomization',
  reducer: createReducer(
    UIModuleConfigInitialState,
    on(
      UIModuleConfigActions.getUIModuleConfigSuccess,
      UIModuleConfigActions.putUIModuleCustomizationSuccess,
      (state, { uiModuleConfig: uiModuleConfigBase }): UIModuleConfigState => {
        const cacheTime = new Date().getTime();
        const uiModuleConfig: UIModuleConfig = {
          ...uiModuleConfigBase,
          cacheTime,
        };
        return {
          ...state,
          uiModuleConfigs: updateUIModuleConfigs(state, uiModuleConfig),
        };
      }
    ),
    on(
      UIModuleConfigActions.putUIModuleCustomizationError,
      UIModuleConfigActions.getUIModuleConfigError,
      (state): UIModuleConfigState => ({
        ...state,
        // Rebind customization controls to persisted values after a failed save.
        // The controls keep their clicked value internally, and the template tracks nodes by identity.
        uiModuleConfigs: cloneDeep(state.uiModuleConfigs),
      }),
    ),
    on(
      UIModuleConfigActions.getUIModuleConfig,
      UIModuleConfigActions.putUIModuleCustomization,
      UIModuleConfigActions.putUIModuleCustomizations,
      (state): UIModuleConfigState => {
        return {
          ...state,
          loading: true,
        };
      }
    ),
    on(
      UIModuleConfigActions.resetLoading,
      UIModuleConfigActions.getUIModuleConfigSuccess,
      UIModuleConfigActions.getUIModuleConfigError,
      UIModuleConfigActions.putUIModuleCustomizationSuccess,
      UIModuleConfigActions.putUIModuleCustomizationError,
      (state): UIModuleConfigState => {
        return {
          ...state,
          loading: false,
        };
      }
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
      cacheTime: newUIModuleConfig.cacheTime,
    };
  }

  return updatedUIModuleConfigs;
}
