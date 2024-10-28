import { createActionGroup, props } from '@ngrx/store';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';

export const UIRootConfigActions = createActionGroup({
  source: 'UIRootConfig',
  events: {
    'Set current tab module key': props<{ moduleKey: UIModuleConfigKey | undefined }>(),
    'Set current tab module key Success': props<{ moduleKey: UIModuleConfigKey | undefined }>(),
  },
});
