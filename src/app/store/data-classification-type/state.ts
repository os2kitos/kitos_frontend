import { EntityState } from '@ngrx/entity';
import { APIRegularOptionExtendedResponseDTO } from 'src/app/api/v2';
import { dataClassificationTypeAdapter } from './selectors';

export interface DataClassificationTypeState extends EntityState<APIRegularOptionExtendedResponseDTO> {
  cacheTime: number | undefined;
}

export const dataClassificationTypeInitialState: DataClassificationTypeState =
  dataClassificationTypeAdapter.getInitialState({
    cacheTime: undefined,
  });
