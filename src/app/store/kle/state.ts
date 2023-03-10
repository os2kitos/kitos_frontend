import { EntityState } from '@ngrx/entity';
import { APIKLEDetailsDTO } from 'src/app/api/v2';
import { kleAdapter } from './selectors';

export interface KLEState extends EntityState<APIKLEDetailsDTO> {
  cacheTime: number | undefined;
}

export const kleInitialState: KLEState = kleAdapter.getInitialState({
  cacheTime: undefined,
});
