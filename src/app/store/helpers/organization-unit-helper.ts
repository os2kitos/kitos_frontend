import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { organizationUnitAdapter } from '../organization/organization-unit/reducer';
import { OrganizationUnitState } from '../organization/organization-unit/state';

export function removeUnitAndUpdateChildren(
  unit: APIOrganizationUnitResponseDTO,
  children: APIOrganizationUnitResponseDTO[],
  parent: APIOrganizationUnitResponseDTO,
  state: OrganizationUnitState
): OrganizationUnitState {
  const stateAfterRemovingChildren = organizationUnitAdapter.removeMany(
    children.map((unit) => unit.uuid),
    state
  );
  const stateAfterRemovingNode = organizationUnitAdapter.removeOne(unit.uuid, stateAfterRemovingChildren);
  const setChildrensNewParent = children.map((unit) => ({ ...unit, parentOrganizationUnit: parent }));
  const stateAfterAddingUpdatedChildren = organizationUnitAdapter.addMany(
    setChildrensNewParent,
    stateAfterRemovingNode
  );
  return stateAfterAddingUpdatedChildren;
}
