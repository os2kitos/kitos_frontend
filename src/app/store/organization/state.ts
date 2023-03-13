import { EntityState } from '@ngrx/entity';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { EntityLoadingState } from 'src/app/shared/models/entity-loading-state.model';

export interface OrganizationState extends EntityState<APIOrganizationResponseDTO> {
  loadingState: EntityLoadingState;
}
