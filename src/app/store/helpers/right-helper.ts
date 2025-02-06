import {
  ODataOrganizationUser,
  Right,
} from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { organizationUserAdapter } from '../organization/organization-user/reducer';
import { OrganizationUserState } from '../organization/organization-user/state';

export function filterRightFromRights(rights: Right[], roleUuid: string, entityUuid: string): Right[] {
  return rights.filter((right) => right.role.uuid !== roleUuid || right.entity.uuid !== entityUuid);
}

export function updateStateOfUserRights(
  state: OrganizationUserState,
  userUuid: string,
  updateFunction: (previousState: ODataOrganizationUser) => Partial<ODataOrganizationUser>
): OrganizationUserState {
  const previousValue = state.entities[userUuid];
  if (!previousValue) return state;
  return organizationUserAdapter.updateOne(
    {
      id: userUuid,
      changes: updateFunction(previousValue),
    },
    state
  );
}
