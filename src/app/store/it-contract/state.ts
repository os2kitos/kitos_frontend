import { EntityState } from '@ngrx/entity';
import { APIItContractResponseDTO } from 'src/app/api/v2';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITContact } from 'src/app/shared/models/it-contract/it-contract.model';

export interface ITContactState extends EntityState<ITContact> {
  total: number;
  isLoadingContractsQuery: boolean;
  gridState: GridState;

  loading: boolean | undefined;
  itContract: APIItContractResponseDTO | undefined;

  isRemoving: boolean;
}
