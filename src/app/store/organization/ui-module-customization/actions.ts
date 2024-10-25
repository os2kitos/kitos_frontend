import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { APICustomizedUINodeRequestDTO } from 'src/app/api/v2';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { UIModuleConfig } from 'src/app/shared/models/ui-config/ui-module-config.model';

export const UIModuleConfigActions = createActionGroup({
  source: 'UI Module Config',
  events: {
    'Get UI Module Config': props<{ module: UIModuleConfigKey }>(),
    'Get UI Module Config success': props<{ uiModuleConfig: UIModuleConfig }>(),
    'Get UI Module Config error': emptyProps(),

    'Put UI Module Customization': props<{
      module: UIModuleConfigKey;
      updatedNodeRequest: APICustomizedUINodeRequestDTO;
    }>(),
    'Put UI Module Customization success': props<{ uiModuleConfig: UIModuleConfig }>(),
    'Put UI Module Customization error': emptyProps(),
  },
});
