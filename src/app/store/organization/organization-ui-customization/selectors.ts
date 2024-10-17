import { createSelector } from '@ngrx/store';
import { UIModuleCustomizationKey } from 'src/app/shared/enums/ui-module-customization-key';
import { organizationUIModuleCustomizationFeature } from './reducer';
import { UIModuleCustomizationState } from './state';

export const { selectUIModuleCustomizationState } = organizationUIModuleCustomizationFeature;

export const selectUIModuleCustomizations = createSelector(
  selectUIModuleCustomizationState,
  (state: UIModuleCustomizationState) => {
    return state.uiModuleCustomizations;
  }
);

export const selectITSystemUsagesUIModuleCustomization = createSelector(
  selectUIModuleCustomizationState,
  (state: UIModuleCustomizationState) => {
    return state.uiModuleCustomizations.find((c) => c.module == UIModuleCustomizationKey.ItSystemUsage);
  }
);
