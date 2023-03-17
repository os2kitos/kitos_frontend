import { EntityState } from '@ngrx/entity';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';

export interface ContractTypeState extends EntityState<APIRegularOptionResponseDTO> {
  cacheTime: number | undefined;
}
