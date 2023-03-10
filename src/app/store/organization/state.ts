import { EntityState } from '@ngrx/entity';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { organizationAdapter } from './selectors';

export type OrganizationState = EntityState<APIOrganizationResponseDTO>;

export const organizationInitialState: OrganizationState = organizationAdapter.getInitialState();
