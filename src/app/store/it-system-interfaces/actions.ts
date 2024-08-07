import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  APIItInterfaceDataRequestDTO,
  APIItInterfaceDataResponseDTO,
  APIItInterfaceResponseDTO,
  APIResourceCollectionPermissionsResponseDTO,
  APIResourcePermissionsResponseDTO,
  APIUpdateItInterfaceRequestDTO,
} from 'src/app/api/v2';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITInterface } from 'src/app/shared/models/it-interface/it-interface.model';

export const ITInterfaceActions = createActionGroup({
  source: 'ITInterface',
  events: {
    'Get IT Interfaces': (odataString: string) => ({ odataString }),
    'Get IT Interfaces Success ': (itInterfaces: ITInterface[], total: number) => ({ itInterfaces, total }),
    'Get IT Interfaces Error': emptyProps(),
    'Update Grid State': (gridState: GridState) => ({ gridState }),
    'Update Grid Columns': (gridColumns: GridColumn[]) => ({ gridColumns }),
    'Update Grid Columns Success': (gridColumns: GridColumn[]) => ({ gridColumns }),

    'Get IT Interface': (uuid: string) => ({ uuid }),
    'Get IT Interface Success': (itInterface: APIItInterfaceResponseDTO) => ({ itInterface }),
    'Get IT Interface Error': emptyProps(),

    'Get IT Interface permissions': (uuid: string) => ({ uuid }),
    'Get IT Interface permissions Success': (permissions?: APIResourcePermissionsResponseDTO) => ({
      permissions,
    }),
    'Get IT Interface permissions Error': emptyProps(),
    'Get IT Interface Collection Permissions': () => emptyProps(),
    'Get IT Interface Collection Permissions Success': (
      collectionPermissions: APIResourceCollectionPermissionsResponseDTO
    ) => ({
      collectionPermissions,
    }),
    'Get IT Interface Collection Permissions Error': emptyProps(),

    'Delete IT Interface': () => emptyProps(),
    'Delete IT Interface Success': emptyProps(),
    'Delete IT Interface Error': emptyProps(),

    'Update IT Interface': (itInterface: APIUpdateItInterfaceRequestDTO) => ({ itInterface }),
    'Update IT Interface Success': (itInterface: APIItInterfaceResponseDTO) => ({ itInterface }),
    'Update IT Interface Error': (customErrorText?: string) => ({ customErrorText }),

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

    'Create IT Interface': (name: string, interfaceId: string, openAfterCreate: boolean) => ({
      name,
      interfaceId,
      openAfterCreate,
    }),
    'Create IT Interface Success': (uuid: string, openAfterCreate: boolean) => ({ uuid, openAfterCreate }),
    'Create IT Interface Error': emptyProps(),
  },
});
