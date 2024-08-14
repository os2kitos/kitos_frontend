import { EntityState } from '@ngrx/entity';
import { APIBusinessRoleDTO } from 'src/app/api/v1';
import {
  APIDataProcessingRegistrationPermissionsResponseDTO,
  APIDataProcessingRegistrationResponseDTO,
  APIResourceCollectionPermissionsResponseDTO,
} from 'src/app/api/v2';
import { DataProcessingRegistration } from 'src/app/shared/models/data-processing/data-processing.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';

export interface DataProcessingState extends EntityState<DataProcessingRegistration> {
  total: number;
  isLoadingDataProcessingsQuery: boolean;
  gridState: GridState;
  gridColumns: GridColumn[];
  gridRoleColumns: GridColumn[];
  overviewRoles: APIBusinessRoleDTO[] | undefined;

  loading: boolean | undefined;
  dataProcessing: APIDataProcessingRegistrationResponseDTO | undefined;

  permissions: APIDataProcessingRegistrationPermissionsResponseDTO | undefined;
  collectionPermissions: APIResourceCollectionPermissionsResponseDTO | undefined;
  isRemoving: boolean;
}
