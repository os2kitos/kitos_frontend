import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
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
        uiModuleConfigs: [...state.uiModuleConfigs, uiModuleConfig],
      })
    ),
    on(
      UIModuleConfigActions.putUIModuleCustomizationSuccess,
      (state, { uiModuleConfig }): UIModuleConfigState => ({
        uiModuleConfigs: [...state.uiModuleConfigs, uiModuleConfig],
      })
    )
  ),
});
