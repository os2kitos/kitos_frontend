import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { UIModuleCustomization } from 'src/app/shared/models/ui-config/ui-module-customization.model';
import { OrganizationUiModuleCustomizationActions } from './actions';
import { UIModuleCustomizationState } from './state';

export const uiModuleCustomizationAdapter = createEntityAdapter<UIModuleCustomization>();

export const organizationUIModuleCustomizationInitialState: UIModuleCustomizationState =
  uiModuleCustomizationAdapter.getInitialState({
    uiModuleCustomizations: [],
  });

export const organizationUIModuleCustomizationFeature = createFeature({
  name: 'UIModuleCustomization',
  reducer: createReducer(
    organizationUIModuleCustomizationInitialState,
    on(
      OrganizationUiModuleCustomizationActions.getUIModuleCustomizationSuccess,
      (state, { uiModuleCustomization }): UIModuleCustomizationState => ({
        uiModuleCustomizations: [...state.uiModuleCustomizations, uiModuleCustomization],
      })
    ),
    on(
      OrganizationUiModuleCustomizationActions.putUIModuleCustomizationSuccess,
      (state, { uiModuleCustomization }): UIModuleCustomizationState => ({
        uiModuleCustomizations: [...state.uiModuleCustomizations, uiModuleCustomization],
      })
    )
  ),
});
