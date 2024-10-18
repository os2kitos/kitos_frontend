import { UIModuleCustomizationKey } from "../../enums/ui-module-customization-key";
import { CustomizedUINode } from "../ui-config/customized-ui-node.model";
import { ItSystemUsageUiBluePrint, UINodeBlueprint } from "../ui-config/it-system-usages-blueprint";
import { UIConfigNodeViewModel } from "../ui-config/ui-config-node-view-model.model";

export function collectUIConfigNodeViewModels(
  tree: UINodeBlueprint,
  uiModuleCustomizations: CustomizedUINode[]
): UIConfigNodeViewModel[] {
  const uiConfigNodeViewModels: UIConfigNodeViewModel[] = [];
  buildUIConfigNodeViewModels(tree, uiConfigNodeViewModels, uiModuleCustomizations);
  return uiConfigNodeViewModels;
}

function findCustomizedUINode(customizationList: CustomizedUINode[], fullKey: string): CustomizedUINode | null {
  return customizationList.find((elem) => elem.fullKey === fullKey) || null;
}

function buildUIConfigNodeViewModels(
  node: UINodeBlueprint,
  uiConfigNodeViewModels: UIConfigNodeViewModel[],
  customizationList: CustomizedUINode[]
): void {
  if (node.fullKey) {
    const nodeViewModel: UIConfigNodeViewModel = {
      text: node.text,
      helpText: node.helpText,
      fullKey: node.fullKey,
      isObligatory: node.isObligatory ?? false,
      isEnabled: true,
    };

    const nodeCustomization = findCustomizedUINode(customizationList, node.fullKey);
    if (nodeCustomization) {
      nodeViewModel.isEnabled = nodeCustomization.enabled;
    }
    uiConfigNodeViewModels.push(nodeViewModel);
  }

  if (node.children) {
    Object.keys(node.children).forEach((childKey) => {
      buildUIConfigNodeViewModels(node.children![childKey], uiConfigNodeViewModels, customizationList);
    });
  }
}

export function getItSystemUsageUiBluePrint(): UINodeBlueprint {
  const blueprint = ItSystemUsageUiBluePrint;
  setupUIBlueprintFullKeys(UIModuleCustomizationKey.ItSystemUsage, blueprint, []);
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
