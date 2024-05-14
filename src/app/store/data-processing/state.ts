import { EntityState } from '@ngrx/entity';
import { APIDataProcessingRegistrationResponseDTO, APIResourcePermissionsResponseDTO } from 'src/app/api/v2';
import { DataProcessingRegistration } from 'src/app/shared/models/data-processing/data-processing.model';
import { GridState } from 'src/app/shared/models/grid-state.model';

export interface DataProcessingState extends EntityState<DataProcessingRegistration> {
  total: number;
  isLoadingDataProcessingsQuery: boolean;
  gridState: GridState;

  loading: boolean | undefined;
  dataProcessing: APIDataProcessingRegistrationResponseDTO | undefined;

  collectionPermissions: APIResourcePermissionsResponseDTO | undefined;
  isRemoving: boolean;
}
