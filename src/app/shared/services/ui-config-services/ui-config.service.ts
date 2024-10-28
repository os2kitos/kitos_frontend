import { Injectable } from '@angular/core';
import { combineLatestWith, map, Observable } from 'rxjs';
import { UIModuleConfigKey } from '../../enums/ui-module-config-key';
import { filterGridColumnsByUIConfig } from '../../helpers/grid-config-helper';
import { GridColumn } from '../../models/grid-column.model';
import { DataProcessingUiBluePrint } from '../../models/ui-config/blueprints/data-processing-blueprint';
import { ItContractsUiBluePrint } from '../../models/ui-config/blueprints/it-contracts-blueprint';
import { ItSystemUsageUiBluePrint } from '../../models/ui-config/blueprints/it-system-usages-blueprint';
import { UIConfigGridApplication } from '../../models/ui-config/ui-config-grid-application';
import { UIConfigNodeViewModel } from '../../models/ui-config/ui-config-node-view-model.model';
import { UIModuleConfig } from '../../models/ui-config/ui-module-config.model';
import { UINodeBlueprint } from '../../models/ui-config/ui-node-blueprint.model';
import { UINodeCustomization } from '../../models/ui-config/ui-node-customization';
import { GridUIConfigService } from './grid-ui-config.service';

@Injectable({
  providedIn: 'root',
})
export class UIConfigService {
  constructor(private gridConfigService: GridUIConfigService) {}

  public buildUIModuleConfig(uiModuleCustomizations: UINodeCustomization[], module: UIModuleConfigKey): UIModuleConfig {
    const blueprint = this.getUIBlueprintWithFullKeys(module);
    const moduleConfigViewModel: UIConfigNodeViewModel | undefined = this.buildUIConfigNodeViewModels(
      blueprint,
      uiModuleCustomizations
    );
    return { module, moduleConfigViewModel };
  }

  private findCustomizedUINode(customizationList: UINodeCustomization[], fullKey: string): UINodeCustomization | null {
    return customizationList.find((elem) => elem.fullKey === fullKey) || null;
  }

  public filterGridColumnsByUIConfig(
    moduleKey: UIModuleConfigKey
  ): (source: Observable<GridColumn[]>) => Observable<GridColumn[]> {
    return this.applyConfigToGridColumns(this.gridConfigService.getUIConfigApplications(moduleKey));
  }

  private applyConfigToGridColumns(
    uiConfig: Observable<UIConfigGridApplication[]>
  ): (source: Observable<GridColumn[]>) => Observable<GridColumn[]> {
    return (source: Observable<GridColumn[]>) => {
      return source.pipe(
        combineLatestWith(uiConfig),
        map(([gridColumns, uiConfig]) => this.applyAllUIConfigToGridColumns(uiConfig, gridColumns)),
        filterGridColumnsByUIConfig()
      );
    };
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
    return fieldKey.startsWith(tabFullKey + '.');
  }

  public isTab(key: string): boolean {
    return this.countDots(key) === 1;
  }

  private countDots(key: string): number {
    return (key.match(/\./g) || []).length;
  }

  private applyAllUIConfigToGridColumns(applications: UIConfigGridApplication[], columns: GridColumn[]) {
    applications.forEach((application) => (columns = this.applyUIConfigToGridColumns(application, columns)));
    return columns;
  }

  private applyUIConfigToGridColumns(application: UIConfigGridApplication, columns: GridColumn[]) {
    const updatedColumns = columns.map((column) => {
      if (application.columnNamesToConfigure.includes(column.field)) {
        return {
          ...column,
          disabledByUIConfig: !application.shouldEnable,
        };
      }
      return column;
    });

    return updatedColumns;
  }
}
