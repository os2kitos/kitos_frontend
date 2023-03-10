import { EntityState } from '@ngrx/entity';
import { APIItSystemResponseDTO } from 'src/app/api/v2';
import { itSystemAdapter } from './selectors';

export interface ITSystemState extends EntityState<APIItSystemResponseDTO> {
  itSystem: APIItSystemResponseDTO | undefined;
}

export const itSystemInitialState: ITSystemState = itSystemAdapter.getInitialState({
  itSystem: undefined,
});
