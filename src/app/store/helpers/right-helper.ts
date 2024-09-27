import { OrganizationUser, Right } from 'src/app/shared/models/organization-user/organization-user.model';
import { organizationUserAdapter } from '../organization-user/reducer';
import { OrganizationUserState } from '../organization-user/state';

export function filterRightFromRights(rights: Right[], roleUuid: string, entityUuid: string): Right[] {
  return rights.filter((right) => right.role.uuid !== roleUuid || right.entity.uuid !== entityUuid);
}

export function updateStateOfUserRights(
  state: OrganizationUserState,
  userUuid: string,
  updateFunction: (previousState: OrganizationUser) => Partial<OrganizationUser>
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
