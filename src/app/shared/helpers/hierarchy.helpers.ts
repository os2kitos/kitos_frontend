import { arrayToTree } from 'performant-array-to-tree';
import {
  APIItContractResponseDTO,
  APIOrganizationUnitResponseDTO,
  APIRegistrationHierarchyNodeWithActivationStatusResponseDTO,
} from 'src/app/api/v2';
import { EntityTreeNode, HierachyNodeWithParentUuid } from '../models/structure/entity-tree-node.model';
import { IdentityNamePair } from '../models/identity-name-pair.model';

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

export const mapContractsToTree = (contracts: APIItContractResponseDTO[]) => {
  const mappedHierarchy = contracts.map<HierachyNodeWithParentUuid>((unit) => ({
    uuid: unit.uuid,
    name: unit.name,
    isRoot: !unit.parentContract,
    parentUuid: unit.parentContract?.uuid,
    children: [],
  }));

  return mapArrayToTree(mappedHierarchy);
};

const mapArrayToTree = (nodes: HierachyNodeWithParentUuid[]): HierachyNodeWithParentUuid[] => {
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
  nodes: HierachyNodeWithParentUuid[],
  rootToRemoveUuid: string
): HierachyNodeWithParentUuid[] {
  return nodes
    .map((node) => removeNodeAndChildrenHelper(node, rootToRemoveUuid))
    .filter((node) => node !== undefined) as HierachyNodeWithParentUuid[];
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
