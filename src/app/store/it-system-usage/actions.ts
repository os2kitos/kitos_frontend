import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIItSystemUsageResponseDTO, APIResourcePermissionsResponseDTO } from 'src/app/api/v2';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITSystemUsage } from 'src/app/shared/models/it-system-usage.model';

export const ITSystemUsageActions = createActionGroup({
  source: 'ITSystemUsage',
  events: {
    'Get IT System Usages': (odataString: string) => ({ odataString }),
    'Get IT System Usages Success ': (itSystemUsages: ITSystemUsage[], total: number) => ({ itSystemUsages, total }),
    'Get IT System Usages Error': emptyProps(),

    'Update Grid State': (gridState: GridState) => ({ gridState }),

    'Get IT System Usage': (systemUsageUuid: string) => ({ systemUsageUuid }),
    'Get IT System Usage Success ': (itSystemUsage: APIItSystemUsageResponseDTO) => ({ itSystemUsage }),
    'Get IT System Usage Error': emptyProps(),

    'Remove IT System Usage': emptyProps(),
    'Remove IT System Usage Success ': emptyProps(),
    'Remove IT System Usage Error': emptyProps(),

    'Get IT System Usage Permissions': (systemUsageUuid: string) => ({ systemUsageUuid }),
    'Get IT System Usage Permissions Success ': (permissions: APIResourcePermissionsResponseDTO) => ({
      permissions,
    }),
    'Get IT System Usage Permissions Error': emptyProps(),
  },
});
