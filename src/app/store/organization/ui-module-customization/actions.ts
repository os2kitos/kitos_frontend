import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { APIUIModuleCustomizationRequestDTO } from 'src/app/api/v2';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-customization-key';
import { UIModuleConfig } from 'src/app/shared/models/ui-config/ui-module-config.model';

export const UIModuleConfigActions = createActionGroup({
  source: 'UI Module Customization',
  events: {
    'Get UI Module Customization': props<{ module: UIModuleConfigKey }>(),
    'Get UI Module Customization success': props<{ uiModuleConfig: UIModuleConfig }>(),
    'Get UI Module Customization error': emptyProps(),

    'Put UI Module Customization': props<{
      module: UIModuleConfigKey;
      request: APIUIModuleCustomizationRequestDTO;
    }>(),
    'Put UI Module Customization success': props<{ uiModuleConfig: UIModuleConfig }>(),
    'Put UI Module Customization error': emptyProps(),
  },
});
