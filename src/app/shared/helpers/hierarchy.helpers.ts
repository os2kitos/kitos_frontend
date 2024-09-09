import { arrayToTree } from 'performant-array-to-tree';
import {
  APIOrganizationUnitResponseDTO,
  APIRegistrationHierarchyNodeWithActivationStatusResponseDTO,
} from 'src/app/api/v2';
import { IdentityNamePair } from '../models/identity-name-pair.model';
import { EntityTreeNode, HierachyNodeWithParentUuid } from '../models/structure/entity-tree-node.model';

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

export const mapUnitsToTree = (units: APIOrganizationUnitResponseDTO[], expandedNodeUuids: string[]) => {
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

export function mapTreeToIdentityNamePairs(nodes: EntityTreeNode<never>[]): IdentityNamePair[] {
  let result: IdentityNamePair[] = [];

  nodes.forEach((node) => {
    result.push({ name: node.name, uuid: node.uuid });

    if (node.children.length > 0) {
      result = result.concat(mapTreeToIdentityNamePairs(node.children));
    }
  });

  return result;
}

export function removeNodeAndChildren(
  nodes: EntityTreeNode<never>[],
  rootToRemoveUuid: string
): EntityTreeNode<never>[] {
  return nodes
    .map((node) => removeNodeAndChildrenHelper(node, rootToRemoveUuid))
    .filter((node) => node !== undefined) as EntityTreeNode<never>[];
}

function removeNodeAndChildrenHelper(
  node: EntityTreeNode<never>,
  rootToRemoveUuid: string
): EntityTreeNode<never> | undefined {
  if (node.uuid === rootToRemoveUuid) {
    return undefined;
  }

  node.children = node.children
    .map((child) => removeNodeAndChildrenHelper(child, rootToRemoveUuid))
    .filter((child) => child !== undefined) as EntityTreeNode<never>[];

  return node;
}
