import { EntityState } from '@ngrx/entity';
import { APIOrganizationRegistrationUnitResponseDTO, APIOrganizationUnitResponseDTO } from 'src/app/api/v2';

export interface OrganizationUnitState extends EntityState<APIOrganizationUnitResponseDTO> {
  cacheTime: number | undefined;
  expandedNodeUuids: string[];

  registrations: APIOrganizationRegistrationUnitResponseDTO | undefined;
  isLoadingRegistrations: boolean;
}
