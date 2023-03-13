import { EntityState } from '@ngrx/entity';
import { APIKLEDetailsDTO } from 'src/app/api/v2';

export interface KLEState extends EntityState<APIKLEDetailsDTO> {
  cacheTime: number | undefined;
}
