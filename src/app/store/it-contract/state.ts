import { EntityState } from '@ngrx/entity';
import {
  APIItContractPermissionsResponseDTO,
  APIItContractResponseDTO,
  APIResourceCollectionPermissionsResponseDTO,
} from 'src/app/api/v2';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITContract } from 'src/app/shared/models/it-contract/it-contract.model';

export interface ITContractState extends EntityState<ITContract> {
  total: number;
  isLoadingContractsQuery: boolean;
  gridState: GridState;

  loading: boolean | undefined;
  itContract: APIItContractResponseDTO | undefined;

  permissions: APIItContractPermissionsResponseDTO | undefined;
  collectionPermissions: APIResourceCollectionPermissionsResponseDTO | undefined;
  isRemoving: boolean;
}
