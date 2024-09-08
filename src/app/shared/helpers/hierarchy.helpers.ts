import { arrayToTree } from 'performant-array-to-tree';
import {
  APIIdentityNamePairResponseDTO,
  APIOrganizationUnitResponseDTO,
  APIRegistrationHierarchyNodeWithActivationStatusResponseDTO,
} from 'src/app/api/v2';
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
  }));
  const tree = arrayToTree(mappedHierarchy, { id: 'uuid', parentId: 'parentUuid', dataField: null });

  return <HierachyNodeWithParentUuid[]>tree;
};

export const mapUnitsToTree = (units: APIOrganizationUnitResponseDTO[]) => {
  const mappedHierarchy = units.map<HierachyNodeWithParentUuid>((unit) => ({
    uuid: unit.uuid,
    name: unit.name,
    isRoot: !unit.parentOrganizationUnit,
    status: true,
    parentUuid: unit.parentOrganizationUnit?.uuid,
    children: [],
    color: unit.origin === 'Kitos' ? 'blue' : 'green',
  }));
  const tree = arrayToTree(mappedHierarchy, { id: 'uuid', parentId: 'parentUuid', dataField: null });

  return <HierachyNodeWithParentUuid[]>tree;
};

export function mapNodesToIdentityNamePairs(nodes: EntityTreeNode<never>[]): APIIdentityNamePairResponseDTO[] {
  return nodes.map((node) => {
    return {
      name: node.name,
      uuid: node.uuid
    }
  })
}

export function removeNodeAndChildren(
  nodes: EntityTreeNode<never>[],
  rootUuid: string
): EntityTreeNode<never>[] {
  const rootNode = nodes.find((node) => node.uuid === rootUuid);

  if (!rootNode) return nodes;

  const uuidsToRemove = collectRootAndChildrenUuids(rootNode);

  return nodes.filter((node) => !uuidsToRemove.includes(node.uuid));
}

function collectRootAndChildrenUuids(root: EntityTreeNode<never>): string[] {
  const uuids: string[] = [root.uuid];
  root.children.forEach((child) => {
    uuids.push(...collectRootAndChildrenUuids(child));
  });
  return uuids;
}
