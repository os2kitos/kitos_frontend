import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  APIDataProcessingRegistrationPermissionsResponseDTO,
  APIDataProcessingRegistrationResponseDTO,
  APIIdentityNamePairResponseDTO,
  APIResourceCollectionPermissionsResponseDTO,
  APIUpdateDataProcessingRegistrationRequestDTO,
} from 'src/app/api/v2';
import { DataProcessingRegistration } from 'src/app/shared/models/data-processing/data-processing.model';
import { GridState } from 'src/app/shared/models/grid-state.model';

export const DataProcessingActions = createActionGroup({
  source: 'DataProcessing',
  events: {
    'Get Data Processing': (dataProcessingUuid: string) => ({ dataProcessingUuid }),
    'Get Data Processing Success': (dataProcessing: APIDataProcessingRegistrationResponseDTO) => ({ dataProcessing }),
    'Get Data Processing Error': emptyProps(),
    'Get Data Processings': (odataString: string) => ({ odataString }),
    'Get Data Processings Success': (dataProcessings: DataProcessingRegistration[], total: number) => ({
      dataProcessings,
      total,
    }),
    'Get Data Processings Error': emptyProps(),
    'Update Grid State': (gridState: GridState) => ({ gridState }),
    'Delete Data Processing': emptyProps(),
    'Delete Data Processing Success': emptyProps(),
    'Delete Data Processing Error': emptyProps(),

    'Patch Data Processing': (dataProcessing: APIUpdateDataProcessingRegistrationRequestDTO) => ({ dataProcessing }),
    'Patch Data Processing Success': (dataProcessing: APIDataProcessingRegistrationResponseDTO) => ({ dataProcessing }),
    'Patch Data Processing Error': emptyProps(),

    'Create Data Processing': (name: string, openAfterCreate: boolean) => ({ name, openAfterCreate }),
    'Create Data Processing Success': (uuid: string, openAfterCreate: boolean) => ({ uuid, openAfterCreate }),
    'Create Data Processing Error': emptyProps(),
    'Get Data Processing Permissions': (dataProcessingUuid: string) => ({ dataProcessingUuid }),
    'Get Data Processing Permissions Success': (permissions: APIDataProcessingRegistrationPermissionsResponseDTO) => ({
      permissions,
    }),
    'Get Data Processing Permissions Error': emptyProps(),
    'Get Data Processing Collection Permissions': () => emptyProps(),
    'Get Data Processing Collection Permissions Success': (
      collectionPermissions: APIResourceCollectionPermissionsResponseDTO
    ) => ({
      collectionPermissions,
    }),
    'Get Data Processing Collection Permissions Error': emptyProps(),

    'Add Data Processing Third Country': (country: APIIdentityNamePairResponseDTO) => ({ country }),
    'Add Data Processing Third Country Success': (dataProcessing: APIDataProcessingRegistrationResponseDTO) => ({
      dataProcessing,
    }),
    'Add Data Processing Third Country Error': emptyProps(),

    'Delete Data Processing Third Country': (countryUuid: string) => ({ countryUuid }),
    'Delete Data Processing Third Country Success': (dataProcessing: APIDataProcessingRegistrationResponseDTO) => ({
      dataProcessing,
    }),
    'Delete Data Processing Third Country Error': emptyProps(),
  },
});
