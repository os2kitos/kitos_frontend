import { EntityState } from '@ngrx/entity';
import { APIExtendedRoleAssignmentResponseDTO } from 'src/app/api/v2';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';

export interface RoleOptionTypeStateItem extends EntityState<APIExtendedRoleAssignmentResponseDTO> {
  cacheTime: number | undefined;
}

export type RoleOptionTypeState = Record<RoleOptionTypes, RoleOptionTypeStateItem | null>;
