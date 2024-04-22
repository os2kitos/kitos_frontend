import { arrayToTree } from 'performant-array-to-tree';
import { APIRegistrationHierarchyNodeWithActivationStatusResponseDTO } from 'src/app/api/v2';
import { HierachyNodeWithParentUuid } from '../models/structure/entity-tree-node.model';

export const mapToTree = (hierarchy: APIRegistrationHierarchyNodeWithActivationStatusResponseDTO[]) => {
  const mappedHierarchy = hierarchy.map<HierachyNodeWithParentUuid>((node) => ({
    uuid: node.node.uuid,
    name: node.node.name,
    isRoot: !node.parent,
    status: node.deactivated === false,
    parentUuid: node.parent?.uuid,
    children: [],
  }));
  const systemTree = arrayToTree(mappedHierarchy, { id: 'uuid', parentId: 'parentUuid', dataField: null });

  return <HierachyNodeWithParentUuid[]>systemTree;
};
