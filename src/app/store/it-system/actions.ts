import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIItSystemResponseDTO } from 'src/app/api/v2';

export const ITSystemActions = createActionGroup({
  source: 'ITSystem',
  events: {
    'Get IT System': (systemUuid: string) => ({ systemUuid }),
    'Get IT System Success ': (itSystem: APIItSystemResponseDTO) => ({ itSystem }),
    'Get IT System Error': emptyProps(),
  },
});
