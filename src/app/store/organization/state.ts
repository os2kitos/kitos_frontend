import { EntityState } from '@ngrx/entity';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';

export type OrganizationState = EntityState<APIOrganizationResponseDTO>;
