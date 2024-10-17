import { APICustomizedUINodeResponseDTO, APIUIModuleCustomizationResponseDTO } from 'src/app/api/v2';
import { CustomizedUINode } from './customized-ui-node.model';

export interface UIModuleCustomization {
  module: string;
  nodes: CustomizedUINode[];
}

export function adaptUIModuleCustomization(
  source: APIUIModuleCustomizationResponseDTO
): UIModuleCustomization | undefined {
  console.log(JSON.stringify(source) + '    is source')
  if (!source.module) return;

  return {
    module: source.module,
    nodes: source.nodes ? adaptCustomizedUINodes(source.nodes) : [],
  };
}

function adaptCustomizedUINodes(sourceNodes: APICustomizedUINodeResponseDTO[]) {
  return sourceNodes.map((node) => {
    return { key: node.key, enabled: node.enabled };
  });
}
