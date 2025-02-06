import { Injectable } from '@angular/core';
import { UIModuleConfigKey } from '../../enums/ui-module-config-key';
import { DataProcessingUiBluePrint } from '../../models/ui-config/blueprints/data-processing-blueprint';
import { ItContractsUiBluePrint } from '../../models/ui-config/blueprints/it-contracts-blueprint';
import { ItSystemUsageUiBluePrint } from '../../models/ui-config/blueprints/it-system-usages-blueprint';
import { UIConfigNodeViewModel } from '../../models/ui-config/ui-config-node-view-model.model';
import { UIModuleConfig } from '../../models/ui-config/ui-module-config.model';
import { UINodeBlueprint } from '../../models/ui-config/ui-node-blueprint.model';
import { UINodeCustomization } from '../../models/ui-config/ui-node-customization';

@Injectable({
  providedIn: 'root',
})
export class UIConfigService {
  public buildUIModuleConfig(uiModuleCustomizations: UINodeCustomization[], module: UIModuleConfigKey): UIModuleConfig {
    const blueprint = this.getUIBlueprintWithFullKeys(module);
    const moduleConfigViewModel: UIConfigNodeViewModel | undefined = this.buildUIConfigNodeViewModels(
      blueprint,
      uiModuleCustomizations
    );
    return { module, moduleConfigViewModel, cacheTime: undefined };
  }

  public getAllKeysOfBlueprint(moduleKey: UIModuleConfigKey): string[] {
    const blueprint = this.getUIBlueprintWithFullKeys(moduleKey);
    return this.flattenUINodeBlueprintKeys(blueprint);
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
  ): UIConfigNodeViewModel | undefined {
    if (!node.fullKey) return undefined;

    const nodeViewModel = this.buildBasicNodeViewModel(node, uiNodeCustomizations, node.fullKey);

    if (node.children) {
      nodeViewModel.children = Object.keys(node.children)
        .map((childKey) => this.buildUIConfigNodeViewModels(node.children![childKey], uiNodeCustomizations))
        .filter((child) => child !== undefined);
    }
    return nodeViewModel;
  }

  private getUIBlueprintWithFullKeys(module: UIModuleConfigKey): UINodeBlueprint {
    const blueprint = this.resolveUIModuleBlueprint(module);
    this.setupUIBlueprintFullKeys(module, blueprint, []);
    return blueprint;
  }

  private resolveUIModuleBlueprint(module: UIModuleConfigKey): UINodeBlueprint {
    switch (module) {
      case UIModuleConfigKey.ItSystemUsage:
        return ItSystemUsageUiBluePrint;
      case UIModuleConfigKey.ItContract:
        return ItContractsUiBluePrint;
      case UIModuleConfigKey.DataProcessingRegistrations:
        return DataProcessingUiBluePrint;
      default:
        throw new Error(`No blueprint found for module ${module}`);
    }
  }

  private setupUIBlueprintFullKeys(currentLevelKey: string, currentNode: UINodeBlueprint, ancestorKeys: string[]) {
    const keyPath = [...ancestorKeys, currentLevelKey];
    currentNode.fullKey = this.toUIConfigFullKey(keyPath);

    if (currentNode.children) {
      Object.keys(currentNode.children).forEach((key) => {
        if (currentNode.children) this.setupUIBlueprintFullKeys(key, currentNode.children[key], keyPath);
      });
    }
  }

  private toUIConfigFullKey(segments: string[]) {
    return segments.join('.');
  }

  public isChildOfTab(tabFullKey: string, fieldKey: string) {
    return this.isTab(tabFullKey) && fieldKey.startsWith(tabFullKey + '.');
  }

  public isTab(key: string): boolean {
    return this.countDots(key) === 1;
  }

  public isField(key: string): boolean {
    return this.countDots(key) === 2;
  }

  private countDots(key: string): number {
    return (key.match(/\./g) || []).length;
  }

  private flattenUINodeBlueprintKeys(root: UINodeBlueprint): string[] {
    let result: string[] = [];

    // If the current node has a fullKey, add it to the list.
    if (root.fullKey !== undefined) {
      result.push(root.fullKey);
    }

    // If there are children, recursively flatten them and merge into the result.
    if (root.children) {
      for (const key in root.children) {
        const child = root.children[key];
        result = result.concat(this.flattenUINodeBlueprintKeys(child));
      }
    }

    return result;
  }
}
