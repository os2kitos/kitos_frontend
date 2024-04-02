import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  APIItInterfaceDataRequestDTO,
  APIItInterfaceDataResponseDTO,
  APIItInterfaceResponseDTO,
  APIResourcePermissionsResponseDTO,
  APIUpdateItInterfaceRequestDTO,
} from 'src/app/api/v2';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITInterface } from 'src/app/shared/models/it-interface/it-interface.model';

export const ITInterfaceActions = createActionGroup({
  source: 'ITInterface',
  events: {
    'Get IT Interfaces': (odataString: string) => ({ odataString }),
    'Get IT Interfaces Success ': (itInterfaces: ITInterface[], total: number) => ({ itInterfaces, total }),
    'Get IT Interfaces Error': emptyProps(),
    'Update Grid State': (gridState: GridState) => ({ gridState }),

    'Get IT Interface': (uuid: string) => ({ uuid }),
    'Get IT Interface Success': (itInterface: APIItInterfaceResponseDTO) => ({ itInterface }),
    'Get IT Interface Error': emptyProps(),

    'Get IT Interface permissions': (uuid: string) => ({ uuid }),
    'Get IT Interface permissions Success': (permissions?: APIResourcePermissionsResponseDTO) => ({
      permissions,
    }),
    'Get IT Interface permissions Error': emptyProps(),

    'Delete IT Interface': () => emptyProps(),
    'Delete IT Interface Success': emptyProps(),
    'Delete IT Interface Error': emptyProps(),

    'Update IT Interface': (itInterface: APIUpdateItInterfaceRequestDTO) => ({ itInterface }),
    'Update IT Interface Success': (itInterface: APIItInterfaceResponseDTO) => ({ itInterface }),
    'Update IT Interface Error': emptyProps(),

    'Remove IT Interface Data': (uuid: string) => ({ uuid }),
    'Remove IT Interface Data Success': (dataUuid: string) => ({ dataUuid }),
    'Remove IT Interface Data Error': emptyProps(),

    'Add IT Interface Data': (data: APIItInterfaceDataRequestDTO) => ({ data }),
    'Add IT Interface Data Success': (itInterfaceData: APIItInterfaceDataResponseDTO) => ({ itInterfaceData }),
    'Add IT Interface Data Error': emptyProps(),

    'Update IT Interface Data': (dataUuid: string, data: APIItInterfaceDataRequestDTO) => ({ dataUuid, data }),
    'Update IT Interface Data Success': (itInterfaceData: APIItInterfaceDataResponseDTO) => ({
      itInterfaceData,
    }),
    'Update IT Interface Data Error': emptyProps(),
  },
});
