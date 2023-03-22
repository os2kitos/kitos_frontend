import { EntityState } from '@ngrx/entity';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';

export interface RegularOptionTypeState extends EntityState<APIRegularOptionResponseDTO> {
  cacheTime: number | undefined; //TODO: Make dictionary of caches in stead
}
