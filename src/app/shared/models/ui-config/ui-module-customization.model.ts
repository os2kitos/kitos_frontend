import { APICustomizedUINodeResponseDTO, APIUIModuleCustomizationResponseDTO } from 'src/app/api/v2';
import { UINodeCustomization } from './ui-node-customization';

export interface UIModuleCustomization {
  module: string;
  nodes: UINodeCustomization[];
}

export function adaptUIModuleCustomization(
  source: APIUIModuleCustomizationResponseDTO
): UIModuleCustomization | undefined {
  if (!source.module) return;

  return {
    module: source.module,
    nodes: source.nodes ? adaptCustomizedUINodes(source.nodes) : [],
  };
}

function adaptCustomizedUINodes(sourceNodes: APICustomizedUINodeResponseDTO[]) {
  return sourceNodes.map((node) => {
    return { fullKey: node.key, enabled: node.enabled };
  });
}
