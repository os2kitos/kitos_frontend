import { EntityState } from '@ngrx/entity';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { businessTypeAdapter } from './selectors';

export interface BusinessTypeState extends EntityState<APIRegularOptionResponseDTO> {
  cacheTime: number | undefined;
}

export const initialState: BusinessTypeState = businessTypeAdapter.getInitialState({
  cacheTime: undefined,
});
