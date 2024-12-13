import { createActionGroup, emptyProps } from '@ngrx/store';
import { Alert, RelatedEntityType } from './state';

export const AlertActions = createActionGroup({
  source: 'Alert',
  events: {
    'Get alerts': (entityType: RelatedEntityType) => ({ entityType }),
    'Get alerts success': (entityType: RelatedEntityType, alerts: Alert[]) => ({ entityType, alerts }),
    'Get alerts error': emptyProps(),

    'Delete alert': (entitType: RelatedEntityType, alertUuid: string) => ({ entitType, alertUuid }),
    'Delete alert success': (entityType: RelatedEntityType, alertUuid: string) => ({ entityType, alertUuid }),
    'Delete alert error': emptyProps(),
  },
});
