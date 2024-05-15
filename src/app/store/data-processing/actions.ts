import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  APIDataProcessingRegistrationResponseDTO,
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
  },
});
