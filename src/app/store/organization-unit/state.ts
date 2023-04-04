import { EntityState } from '@ngrx/entity';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';

export interface OrganizationUnitState extends EntityState<APIOrganizationUnitResponseDTO> {
  isLoaded: boolean;
}
