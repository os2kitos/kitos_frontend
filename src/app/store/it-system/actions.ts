import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIItSystemResponseDTO, APIResourcePermissionsResponseDTO } from 'src/app/api/v2';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITSystem } from 'src/app/shared/models/it-system/it-system.model';

export const ITSystemActions = createActionGroup({
  source: 'ITSystem',
  events: {
    'Get IT System': (systemUuid: string) => ({ systemUuid }),
    'Get IT System Success ': (itSystem: APIItSystemResponseDTO) => ({ itSystem }),
    'Get IT System Error': emptyProps(),
    'Get IT Systems': (odataString: string) => ({ odataString }),
    'Get IT Systems Success ': (itSystems: ITSystem[], total: number) => ({ itSystems, total }),
    'Get IT Systems Error': emptyProps(),

    'Update Grid State': (gridState: GridState) => ({ gridState }),

    'Get IT System Permissions': (systemUuid: string) => ({ systemUuid }),
    'Get IT System Permissions Success ': (permissions?: APIResourcePermissionsResponseDTO) => ({
      permissions,
    }),
    'Get IT System Permissions Error': emptyProps(),
  },
});
