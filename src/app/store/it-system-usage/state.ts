import { EntityState } from '@ngrx/entity';
import { APIBusinessRoleDTO } from 'src/app/api/v1';
import {
  APIItSystemUsageResponseDTO,
  APIOrganizationGridConfigurationResponseDTO,
  APIResourceCollectionPermissionsResponseDTO,
  APIResourcePermissionsResponseDTO,
} from 'src/app/api/v2';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITSystemUsage } from 'src/app/shared/models/it-system-usage/it-system-usage.model';

export interface ITSystemUsageState extends EntityState<ITSystemUsage> {
  total: number;
  isLoadingSystemUsagesQuery: boolean;
  gridState: GridState;
  gridColumns: GridColumn[];
  gridRoleColumns: GridColumn[];
  systemRoles: APIBusinessRoleDTO[] | undefined;

  itSystemUsage: APIItSystemUsageResponseDTO | undefined;
  itSystemUsageLoading: boolean;
  permissions: APIResourcePermissionsResponseDTO | undefined;
  collectionPermissions: APIResourceCollectionPermissionsResponseDTO | undefined;

  isRemoving: boolean;
  lastSeenGridConfig: APIOrganizationGridConfigurationResponseDTO | undefined;
}
