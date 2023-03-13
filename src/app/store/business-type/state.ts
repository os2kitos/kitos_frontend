import { EntityState } from '@ngrx/entity';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';

export interface BusinessTypeState extends EntityState<APIRegularOptionResponseDTO> {
  cacheTime: number | undefined;
}
