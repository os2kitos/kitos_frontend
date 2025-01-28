import { EntityState } from '@ngrx/entity';
import { APIBusinessRoleDTO } from 'src/app/api/v1';
import {
  APIAppliedProcurementPlanResponseDTO,
  APIItContractPermissionsResponseDTO,
  APIItContractResponseDTO,
  APIOrganizationGridConfigurationResponseDTO,
  APIResourceCollectionPermissionsResponseDTO,
} from 'src/app/api/v2';
import { Cached } from 'src/app/shared/models/cache-item.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITContract } from 'src/app/shared/models/it-contract/it-contract.model';

export interface ITContractState extends EntityState<ITContract> {
  total: number;
  isLoadingContractsQuery: boolean;
  gridState: GridState;
  previousGridState: GridState;
  gridColumns: GridColumn[];
  gridRoleColumns: GridColumn[];
  contractRoles: Cached<APIBusinessRoleDTO[]>;

  loading: boolean | undefined;
  itContract: APIItContractResponseDTO | undefined;

  permissions: APIItContractPermissionsResponseDTO | undefined;
  collectionPermissions: APIResourceCollectionPermissionsResponseDTO | undefined;
  isRemoving: boolean;

  organizationGridConfig: APIOrganizationGridConfigurationResponseDTO | undefined;
  appliedProcurementPlans: Cached<APIAppliedProcurementPlanResponseDTO[]>;
}
