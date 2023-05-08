import { EntityState } from '@ngrx/entity';
import { APIItSystemResponseDTO } from 'src/app/api/v2';

export interface ITSystemState extends EntityState<APIItSystemResponseDTO> {
  loading: boolean | undefined;
  itSystem: APIItSystemResponseDTO | undefined;
}
