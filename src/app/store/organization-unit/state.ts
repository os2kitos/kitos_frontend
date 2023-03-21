import { EntityState } from '@ngrx/entity';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { EntityLoadingState } from 'src/app/shared/models/entity-loading-state.model';

export interface OrganizationUnitState extends EntityState<APIOrganizationUnitResponseDTO> {
  loadingState: EntityLoadingState;
}
