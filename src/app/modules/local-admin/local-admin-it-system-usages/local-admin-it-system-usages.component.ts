import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { UIModuleCustomizationKey } from 'src/app/shared/enums/ui-module-customization-key';
import {
  getItSystemUsageUiBluePrint,
  UINodeBlueprint,
} from 'src/app/shared/models/ui-blueprints/it-system-usages-blueprint';
import { CustomizedUINode } from 'src/app/shared/models/ui-customization/customized-ui-node.model';
import { OrganizationUiModuleCustomizationActions } from 'src/app/store/organization/organization-ui-customization/actions';
import { selectITSystemUsagesUIModuleCustomization } from 'src/app/store/organization/organization-ui-customization/selectors';

enum LocalAdminSystemUsagesSegmentOptions {
  UiCustomization = 'UiCustomization',
  OptionTypes = 'OptionTypes',
}

@Component({
  selector: 'app-local-admin-it-system-usages',
  templateUrl: './local-admin-it-system-usages.component.html',
  styleUrl: './local-admin-it-system-usages.component.scss',
})
export class LocalAdminItSystemUsagesComponent implements OnInit {
  public readonly LocalAdminSystemUsagesSegmentOptions = LocalAdminSystemUsagesSegmentOptions;
  public selectedSegment: LocalAdminSystemUsagesSegmentOptions = LocalAdminSystemUsagesSegmentOptions.UiCustomization;
  public readonly segmentOptions: SegmentButtonOption<LocalAdminSystemUsagesSegmentOptions>[] = [
    { text: $localize`Lokal tilpasning af brugerfladen`, value: LocalAdminSystemUsagesSegmentOptions.UiCustomization },
    { text: $localize`Udfaldsrum`, value: LocalAdminSystemUsagesSegmentOptions.OptionTypes },
  ];
  public readonly itSystemUsageUIModuleCustomization$ = this.store.select(selectITSystemUsagesUIModuleCustomization);

  public readonly itSystemUsageUIModuleCustomizationForm = new FormGroup({});

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(
      OrganizationUiModuleCustomizationActions.getUIModuleCustomization({
        moduleName: UIModuleCustomizationKey.ItSystemUsage,
      })
    );
    this.setupUIConfig();
  }

  private setupUIConfig() {
    this.itSystemUsageUIModuleCustomization$.subscribe((moduleCustomization) => {
      const blueprint = getItSystemUsageUiBluePrint();

      const moduleCustomizationNodes = moduleCustomization?.nodes;

      if (moduleCustomizationNodes) {
        const viewModels = collectUIConfigNodeViewModels(blueprint, moduleCustomizationNodes);
      } else {
        const viewModels = collectUIConfigNodeViewModels(blueprint, []);
      }
    });
  }
}

export interface UIConfigNodeViewModel {
  text: string;
  helpText?: string;
  fullKey: string;
  isObligatory?: boolean;
  isEnabled?: boolean;
}

function collectUIConfigNodeViewModels(
  tree: UINodeBlueprint,
  uiModuleCustomizations: CustomizedUINode[]
): UIConfigNodeViewModel[] {
  const uiConfigNodeViewModels: UIConfigNodeViewModel[] = [];
  traverseTree(tree, uiConfigNodeViewModels, uiModuleCustomizations);
  return uiConfigNodeViewModels;
}

function findCustomizedUINode(customizationList: CustomizedUINode[], fullKey: string): CustomizedUINode | null {
  return customizationList.find((elem) => elem.fullKey === fullKey) || null;
}

function traverseTree(
  node: UINodeBlueprint,
  uiConfigNodeViewModels: UIConfigNodeViewModel[],
  customizationList: CustomizedUINode[]
): void {
  if (node.fullKey) {
    console.log(node.fullKey + '  ' + node.isObligatory);
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
      traverseTree(node.children![childKey], uiConfigNodeViewModels, customizationList);
    });
  }
}
