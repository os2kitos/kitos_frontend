import { EntityState } from '@ngrx/entity';
import { APIRegularOptionExtendedResponseDTO } from 'src/app/api/v2';

export interface DataClassificationTypeState extends EntityState<APIRegularOptionExtendedResponseDTO> {
  cacheTime: number | undefined;
}
