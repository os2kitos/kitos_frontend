import { arrayToTree } from 'performant-array-to-tree';
import {
  APIOrganizationUnitResponseDTO,
  APIRegistrationHierarchyNodeWithActivationStatusResponseDTO,
} from 'src/app/api/v2';
import { HierachyNodeWithParentUuid } from '../models/structure/entity-tree-node.model';

export const mapToTree = (hierarchy: APIRegistrationHierarchyNodeWithActivationStatusResponseDTO[]) => {
  const mappedHierarchy = hierarchy.map<HierachyNodeWithParentUuid>((node) => ({
    uuid: node.node.uuid,
    name: node.node.name,
    isRoot: !node.parent,
    status: node.deactivated === false,
    parentUuid: node.parent?.uuid,
    children: [],
    color: 'blue',
    isExpanded: false,
  }));
  const tree = arrayToTree(mappedHierarchy, { id: 'uuid', parentId: 'parentUuid', dataField: null });

  return <HierachyNodeWithParentUuid[]>tree;
};

export const mapUnitToTree = (units: APIOrganizationUnitResponseDTO[], expandedNodeUuids: string[]) => {
  const mappedHierarchy = units.map<HierachyNodeWithParentUuid>((unit) => ({
    uuid: unit.uuid,
    name: unit.name,
    isRoot: !unit.parentOrganizationUnit,
    status: true,
    parentUuid: unit.parentOrganizationUnit?.uuid,
    children: [],
    color: unit.origin === 'Kitos' ? 'blue' : 'green',
    isExpanded: expandedNodeUuids.includes(unit.uuid),
  }));

  return mapArrayToTree(mappedHierarchy);
};

export const mapArrayToTree = (nodes: HierachyNodeWithParentUuid[]): HierachyNodeWithParentUuid[] => {
  const tree = arrayToTree(nodes, { id: 'uuid', parentId: 'parentUuid', dataField: null });
  return <HierachyNodeWithParentUuid[]>tree;
};
