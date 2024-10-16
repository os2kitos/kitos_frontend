import { createSelector } from '@ngrx/store';
import { ItSystemUsages as ItSystemUsagesModuleKey } from 'src/app/shared/ui-module-customization-keys.constants';
import { uiModuleCustomizationFeature } from './reducer';
import { UIModuleCustomizationState } from './state';

export const { selectUIModuleCustomizationState } = uiModuleCustomizationFeature;

export const selectUIModuleCustomizations = createSelector(
  selectUIModuleCustomizationState,
  (state: UIModuleCustomizationState) => {
    return state.uiModuleCustomizations;
  }
);

export const selectITSystemUsagesUIModuleCustomization = createSelector(
  selectUIModuleCustomizationState,
  (state: UIModuleCustomizationState) => {
    return state.uiModuleCustomizations.find((c) => c.module == ItSystemUsagesModuleKey);
  }
);
