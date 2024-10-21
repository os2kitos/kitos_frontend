import { Injectable } from '@angular/core';
import { ItSystemUsageUiBluePrint } from '../models/ui-config/it-system-usages-blueprint';
import { UINodeBlueprint } from '../models/ui-config/ui-node-blueprint.model';
import { UIModuleConfigKey } from '../enums/ui-module-config-key';
import { UIModuleConfig } from '../models/ui-config/ui-module-config.model';
import { UIConfigNodeViewModel } from '../models/ui-config/ui-config-node-view-model.model';
import { UINodeCustomization } from '../models/ui-config/ui-node-customization';

@Injectable({
  providedIn: 'root'
})
export class UIConfigService {

  public buildUIModuleConfig(
    blueprint: UINodeBlueprint,
    uiModuleCustomizations: UINodeCustomization[],
    module: UIModuleConfigKey
  ): UIModuleConfig {
    const uiModuleConfigViewModels: UIConfigNodeViewModel[] = this.buildUIConfigNodeViewModels(
      blueprint,
      uiModuleCustomizations
    );
    return { module, configViewModels: uiModuleConfigViewModels };
  }

  private findCustomizedUINode(customizationList: UINodeCustomization[], fullKey: string): UINodeCustomization | null {
    return customizationList.find((elem) => elem.fullKey === fullKey) || null;
  }

  private buildBasicNodeViewModel(
    node: UINodeBlueprint,
    uiNodeCustomizations: UINodeCustomization[],
    nodeFullKey: string
  ): UIConfigNodeViewModel {
    const nodeViewModel: UIConfigNodeViewModel = {
      text: node.text,
      helpText: node.helpText,
      fullKey: nodeFullKey,
      isObligatory: node.isObligatory ?? false,
      isEnabled: true,
      disableIfSubtreeDisabled: node.disableIfSubtreeDisabled,
    };

    const nodeCustomization = this.findCustomizedUINode(uiNodeCustomizations, nodeFullKey);
    if (nodeCustomization && nodeCustomization.enabled !== undefined) {
      nodeViewModel.isEnabled = nodeCustomization.enabled;
    }
    return nodeViewModel;
  }

  private buildUIConfigNodeViewModels(
    node: UINodeBlueprint,
    uiNodeCustomizations: UINodeCustomization[]
  ): UIConfigNodeViewModel[] {
    const nodeViewModels: UIConfigNodeViewModel[] = [];

    if (node.fullKey) {
      const nodeViewModel = this.buildBasicNodeViewModel(node, uiNodeCustomizations, node.fullKey);

      if (node.children) {
        nodeViewModel.children = Object.keys(node.children).map(
          (childKey) => this.buildUIConfigNodeViewModels(node.children![childKey], uiNodeCustomizations)[0]
        );
      }

      nodeViewModels.push(nodeViewModel);
    }

    return nodeViewModels;
  }

  public getUIBlueprint(module: UIModuleConfigKey): UINodeBlueprint {
    const blueprint = this.resolveUIModuleBlueprint(module);
    this.setupUIBlueprintFullKeys(module, blueprint, []);
    return blueprint;
  }

  private resolveUIModuleBlueprint(module: UIModuleConfigKey): UINodeBlueprint {
    switch (module) {
      case UIModuleConfigKey.ItSystemUsage:
        return ItSystemUsageUiBluePrint;
      case UIModuleConfigKey.ItContract:
      case UIModuleConfigKey.DataProcessingRegistrations:
        return this.emptyPlaceholderBlueprint;
    }
  }

  private emptyPlaceholderBlueprint = {
    text: '',
  };

  private setupUIBlueprintFullKeys(currentLevelKey: string, currentNode: UINodeBlueprint, ancestorKeys: string[]) {
    const keyPath = [...ancestorKeys, currentLevelKey];
    currentNode.fullKey = keyPath.join('.');

    if (currentNode.children) {
      Object.keys(currentNode.children).forEach((key) => {
        if (currentNode.children) this.setupUIBlueprintFullKeys(key, currentNode.children[key], keyPath);
      });
    }
  }
}
