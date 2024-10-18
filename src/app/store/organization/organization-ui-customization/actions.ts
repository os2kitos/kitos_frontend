import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { APIUIModuleCustomizationRequestDTO } from 'src/app/api/v2';
import { UIModuleCustomization } from 'src/app/shared/models/ui-config/ui-module-customization.model';

export const OrganizationUiModuleCustomizationActions = createActionGroup({
  source: 'Organization UI Customization',
  events: {
    'Get UI Module Customization': props<{ moduleName: string }>(),
    'Get UI Module Customization success': props<{ uiModuleCustomization: UIModuleCustomization }>(),
    'Get UI Module Customization error': emptyProps(),

    'Put UI Module Customization': props<{ moduleName: string; request: APIUIModuleCustomizationRequestDTO }>(),
    'Put UI Module Customization success': props<{ uiModuleCustomization: UIModuleCustomization }>(),
    'Put UI Module Customization error': emptyProps(),
  },
});
