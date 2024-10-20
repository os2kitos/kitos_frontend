import { UIModuleConfigKey } from '../../enums/ui-module-config-key';
import { CustomizedUINode as UINodeCustomization } from '../ui-config/customized-ui-node.model';
import { ItSystemUsageUiBluePrint, UINodeBlueprint } from '../ui-config/it-system-usages-blueprint';
import { UIConfigNodeViewModel } from '../ui-config/ui-config-node-view-model.model';
import { UIModuleConfig } from '../ui-config/ui-module-config.model';

export function collectUIConfigNodeViewModels(
  tree: UINodeBlueprint,
  uiModuleCustomizations: UINodeCustomization[],
  module: UIModuleConfigKey
): UIModuleConfig {
  const uiModuleConfigViewModels: UIConfigNodeViewModel[] = buildUIConfigNodeViewModels(tree, uiModuleCustomizations);
  return { module, configViewModels: uiModuleConfigViewModels };
}

function findCustomizedUINode(customizationList: UINodeCustomization[], fullKey: string): UINodeCustomization | null {
  return customizationList.find((elem) => elem.fullKey === fullKey) || null;
}

function buildBasicNodeViewModel(
  node: UINodeBlueprint,
  uiNodeCustomizations: UINodeCustomization[],
  nodeFullKey: string
) {
  const nodeViewModel: UIConfigNodeViewModel = {
    text: node.text,
    helpText: node.helpText,
    fullKey: nodeFullKey,
    isObligatory: node.isObligatory ?? false,
    isEnabled: true,
  };

  const nodeCustomization = findCustomizedUINode(uiNodeCustomizations, nodeFullKey);
  if (nodeCustomization) {
    nodeViewModel.isEnabled = nodeCustomization.enabled;
  }
  return nodeViewModel;
}

function buildUIConfigNodeViewModels(
  node: UINodeBlueprint,
  uiNodeCustomizations: UINodeCustomization[]
): UIConfigNodeViewModel[] {
  const nodeViewModels: UIConfigNodeViewModel[] = [];

  if (node.fullKey) {
    const nodeViewModel = buildBasicNodeViewModel(node, uiNodeCustomizations, node.fullKey);

    if (node.children) {
      nodeViewModel.children = Object.keys(node.children).map(
        (childKey) => buildUIConfigNodeViewModels(node.children![childKey], uiNodeCustomizations)[0]
      );
    }

    nodeViewModels.push(nodeViewModel);
  }

  return nodeViewModels;
}

export function resolveUIBlueprint(module: UIModuleConfigKey): UINodeBlueprint {
  switch (module) {
    case UIModuleConfigKey.ItSystemUsage:
      return getItSystemUsageUiBluePrint();
    default:
      return getItSystemUsageUiBluePrint();
  }
}

export function getItSystemUsageUiBluePrint(): UINodeBlueprint {
  const blueprint = ItSystemUsageUiBluePrint;
  setupUIBlueprintFullKeys(UIModuleConfigKey.ItSystemUsage, blueprint, []);
  return blueprint;
}

function setupUIBlueprintFullKeys(currentLevelKey: string, currentNode: UINodeBlueprint, ancestorKeys: string[]) {
  const keyPath = [...ancestorKeys, currentLevelKey];
  currentNode.fullKey = keyPath.join('.');

  if (currentNode.children) {
    Object.keys(currentNode.children).forEach((key) => {
      if (currentNode.children) setupUIBlueprintFullKeys(key, currentNode.children[key], keyPath);
    });
  }
}
