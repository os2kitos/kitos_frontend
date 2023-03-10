import { EntityState } from '@ngrx/entity';
import { APIItSystemResponseDTO } from 'src/app/api/v2';

export interface ITSystemState extends EntityState<APIItSystemResponseDTO> {
  itSystem: APIItSystemResponseDTO | undefined;
}
